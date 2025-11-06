import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense, ExpenseSource } from './entities/expense.entity';
import { Saving } from '@modules/savings/entities/saving.entity';
import { Category } from '@modules/categories/entities/category.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { QueryExpenseDto } from './dto/query-expense.dto';
import { startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
    @InjectRepository(Saving)
    private savingsRepository: Repository<Saving>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(userId: string, createExpenseDto: CreateExpenseDto): Promise<Expense> {
    // Verify category belongs to user
    const category = await this.categoriesRepository.findOne({
      where: { id: createExpenseDto.categoryId, userId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if expense exceeds budget (warning only, not blocking)
    const budgetInfo = await this.checkBudget(
      userId,
      createExpenseDto.categoryId,
      createExpenseDto.amount,
      new Date(createExpenseDto.date),
    );

    // If paying from savings, verify sufficient funds
    if (createExpenseDto.source === ExpenseSource.SAVINGS) {
      const savings = await this.savingsRepository.findOne({ where: { userId } });
      if (!savings || parseFloat(savings.balance.toString()) < createExpenseDto.amount) {
        throw new BadRequestException('Insufficient savings balance');
      }

      // Deduct from savings
      savings.balance = parseFloat(savings.balance.toString()) - createExpenseDto.amount;
      await this.savingsRepository.save(savings);
    }

    const expense = this.expensesRepository.create({
      ...createExpenseDto,
      userId,
      source: createExpenseDto.source || ExpenseSource.BALANCE,
    });

    const savedExpense = await this.expensesRepository.save(expense);

    // Return with budget warning if applicable
    return {
      ...savedExpense,
      budgetWarning: budgetInfo.overBudget ? budgetInfo : undefined,
    } as any;
  }

  async findAll(userId: string, query: QueryExpenseDto) {
    const { page = 1, limit = 20, sort = 'date', order = 'desc', dateFrom, dateTo, categoryId, source } = query;

    const queryBuilder = this.expensesRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.category', 'category')
      .where('expense.userId = :userId', { userId });

    // Date range filtering
    if (dateFrom && dateTo) {
      queryBuilder.andWhere('expense.date BETWEEN :dateFrom AND :dateTo', { dateFrom, dateTo });
    } else if (dateFrom) {
      queryBuilder.andWhere('expense.date >= :dateFrom', { dateFrom });
    } else if (dateTo) {
      queryBuilder.andWhere('expense.date <= :dateTo', { dateTo });
    }

    // Category filtering
    if (categoryId) {
      queryBuilder.andWhere('expense.categoryId = :categoryId', { categoryId });
    }

    // Source filtering
    if (source) {
      queryBuilder.andWhere('expense.source = :source', { source });
    }

    // Sorting
    queryBuilder.orderBy(`expense.${sort}`, order.toUpperCase() as 'ASC' | 'DESC');

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

  async findOne(userId: string, id: string): Promise<Expense> {
    const expense = await this.expensesRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async update(userId: string, id: string, updateExpenseDto: UpdateExpenseDto): Promise<Expense> {
    const expense = await this.findOne(userId, id);

    // If category changed, verify new category
    if (updateExpenseDto.categoryId && updateExpenseDto.categoryId !== expense.categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: updateExpenseDto.categoryId, userId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    // Handle source change
    if (updateExpenseDto.source && updateExpenseDto.source !== expense.source) {
      const savings = await this.savingsRepository.findOne({ where: { userId } });
      const amount = updateExpenseDto.amount ?? expense.amount;

      if (expense.source === ExpenseSource.SAVINGS) {
        // Was from savings, now from balance - add back to savings
        if (savings) {
          savings.balance = parseFloat(savings.balance.toString()) + parseFloat(expense.amount.toString());
          await this.savingsRepository.save(savings);
        }
      }

      if (updateExpenseDto.source === ExpenseSource.SAVINGS) {
        // Now from savings - deduct from savings
        if (!savings || parseFloat(savings.balance.toString()) < amount) {
          throw new BadRequestException('Insufficient savings balance');
        }
        savings.balance = parseFloat(savings.balance.toString()) - amount;
        await this.savingsRepository.save(savings);
      }
    }

    // Handle amount change when source is savings
    if (updateExpenseDto.amount && expense.source === ExpenseSource.SAVINGS && updateExpenseDto.amount !== parseFloat(expense.amount.toString())) {
      const savings = await this.savingsRepository.findOne({ where: { userId } });
      const amountDiff = updateExpenseDto.amount - parseFloat(expense.amount.toString());

      if (savings) {
        const newBalance = parseFloat(savings.balance.toString()) - amountDiff;
        if (newBalance < 0) {
          throw new BadRequestException('Insufficient savings balance');
        }
        savings.balance = newBalance;
        await this.savingsRepository.save(savings);
      }
    }

    Object.assign(expense, updateExpenseDto);
    return this.expensesRepository.save(expense);
  }

  async remove(userId: string, id: string): Promise<void> {
    const expense = await this.findOne(userId, id);

    // If from savings, add back to savings
    if (expense.source === ExpenseSource.SAVINGS) {
      const savings = await this.savingsRepository.findOne({ where: { userId } });
      if (savings) {
        savings.balance = parseFloat(savings.balance.toString()) + parseFloat(expense.amount.toString());
        await this.savingsRepository.save(savings);
      }
    }

    await this.expensesRepository.remove(expense);
  }

  async getTotalExpenses(userId: string, dateFrom?: Date, dateTo?: Date): Promise<number> {
    const queryBuilder = this.expensesRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.userId = :userId', { userId });

    if (dateFrom && dateTo) {
      queryBuilder.andWhere('expense.date BETWEEN :dateFrom AND :dateTo', { dateFrom, dateTo });
    }

    const result = await queryBuilder.getRawOne();
    return parseFloat(result.total) || 0;
  }

  async getCategorySpending(userId: string, categoryId: string, month: Date): Promise<number> {
    const startDate = startOfMonth(month);
    const endDate = endOfMonth(month);

    const result = await this.expensesRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.userId = :userId', { userId })
      .andWhere('expense.categoryId = :categoryId', { categoryId })
      .andWhere('expense.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  async checkBudget(
    userId: string,
    categoryId: string,
    amount: number,
    date: Date,
  ): Promise<{ overBudget: boolean; spent: number; budget: number; remaining: number }> {
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId, userId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Get monthly income average (simplified - would need IncomesService)
    // For now, using a placeholder - this should be calculated from actual income
    const averageMonthlyIncome = 300000; // TODO: Calculate from actual incomes

    const categoryBudget = (averageMonthlyIncome * parseFloat(category.percentage.toString())) / 100;
    const spent = await this.getCategorySpending(userId, categoryId, date);
    const remaining = categoryBudget - spent - amount;

    return {
      overBudget: remaining < 0,
      spent,
      budget: categoryBudget,
      remaining: Math.max(0, remaining),
    };
  }
}
