import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Income } from './entities/income.entity';
import { Saving } from '@modules/savings/entities/saving.entity';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { QueryIncomeDto } from './dto/query-income.dto';

@Injectable()
export class IncomesService {
  constructor(
    @InjectRepository(Income)
    private incomesRepository: Repository<Income>,
    @InjectRepository(Saving)
    private savingsRepository: Repository<Saving>,
  ) {}

  async create(userId: string, createIncomeDto: CreateIncomeDto): Promise<Income> {
    const income = this.incomesRepository.create({
      ...createIncomeDto,
      userId,
      savingsPercentage: createIncomeDto.savingsPercentage || 0,
    });

    const savedIncome = await this.incomesRepository.save(income);

    // Update savings if percentage is specified
    if (createIncomeDto.savingsPercentage && createIncomeDto.savingsPercentage > 0) {
      const savingsAmount = (createIncomeDto.amount * createIncomeDto.savingsPercentage) / 100;
      await this.updateSavingsBalance(userId, savingsAmount);
    }

    return savedIncome;
  }

  async findAll(userId: string, query: QueryIncomeDto) {
    const { page = 1, limit = 20, sort = 'date', order = 'desc', dateFrom, dateTo, category } = query;

    const queryBuilder = this.incomesRepository
      .createQueryBuilder('income')
      .where('income.userId = :userId', { userId });

    // Date range filtering
    if (dateFrom && dateTo) {
      queryBuilder.andWhere('income.date BETWEEN :dateFrom AND :dateTo', { dateFrom, dateTo });
    } else if (dateFrom) {
      queryBuilder.andWhere('income.date >= :dateFrom', { dateFrom });
    } else if (dateTo) {
      queryBuilder.andWhere('income.date <= :dateTo', { dateTo });
    }

    // Category filtering
    if (category) {
      queryBuilder.andWhere('income.category = :category', { category });
    }

    // Sorting
    queryBuilder.orderBy(`income.${sort}`, order.toUpperCase() as 'ASC' | 'DESC');

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, id: string): Promise<Income> {
    const income = await this.incomesRepository.findOne({
      where: { id, userId },
    });

    if (!income) {
      throw new NotFoundException('Income not found');
    }

    return income;
  }

  async update(userId: string, id: string, updateIncomeDto: UpdateIncomeDto): Promise<Income> {
    const income = await this.findOne(userId, id);

    // Calculate difference in savings if amount or percentage changed
    const oldSavingsAmount = (income.amount * income.savingsPercentage) / 100;
    const newAmount = updateIncomeDto.amount ?? income.amount;
    const newPercentage = updateIncomeDto.savingsPercentage ?? income.savingsPercentage;
    const newSavingsAmount = (newAmount * newPercentage) / 100;
    const savingsDifference = newSavingsAmount - oldSavingsAmount;

    // Update income
    Object.assign(income, updateIncomeDto);
    const updatedIncome = await this.incomesRepository.save(income);

    // Adjust savings balance
    if (savingsDifference !== 0) {
      await this.updateSavingsBalance(userId, savingsDifference);
    }

    return updatedIncome;
  }

  async remove(userId: string, id: string): Promise<void> {
    const income = await this.findOne(userId, id);

    // Reverse savings allocation
    const savingsAmount = (income.amount * income.savingsPercentage) / 100;
    if (savingsAmount > 0) {
      await this.updateSavingsBalance(userId, -savingsAmount);
    }

    await this.incomesRepository.remove(income);
  }

  async getTotalIncome(userId: string, dateFrom?: Date, dateTo?: Date): Promise<number> {
    const queryBuilder = this.incomesRepository
      .createQueryBuilder('income')
      .select('SUM(income.amount)', 'total')
      .where('income.userId = :userId', { userId });

    if (dateFrom && dateTo) {
      queryBuilder.andWhere('income.date BETWEEN :dateFrom AND :dateTo', { dateFrom, dateTo });
    }

    const result = await queryBuilder.getRawOne();
    return parseFloat(result.total) || 0;
  }

  private async updateSavingsBalance(userId: string, amount: number): Promise<void> {
    const savings = await this.savingsRepository.findOne({ where: { userId } });

    if (savings) {
      savings.balance = parseFloat(savings.balance.toString()) + amount;
      await this.savingsRepository.save(savings);
    }
  }
}
