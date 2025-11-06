import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Saving } from './entities/saving.entity';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@Injectable()
export class SavingsService {
  constructor(
    @InjectRepository(Saving)
    private savingsRepository: Repository<Saving>,
  ) {}

  async getSavings(userId: string): Promise<Saving> {
    const savings = await this.savingsRepository.findOne({
      where: { userId },
    });

    if (!savings) {
      throw new NotFoundException('Savings account not found');
    }

    return savings;
  }

  async deposit(userId: string, depositDto: DepositDto): Promise<Saving> {
    const savings = await this.getSavings(userId);

    savings.balance = parseFloat(savings.balance.toString()) + depositDto.amount;
    return this.savingsRepository.save(savings);
  }

  async withdraw(userId: string, withdrawDto: WithdrawDto): Promise<Saving> {
    const savings = await this.getSavings(userId);

    const currentBalance = parseFloat(savings.balance.toString());
    if (currentBalance < withdrawDto.amount) {
      throw new BadRequestException(
        `Insufficient savings balance. Available: ${currentBalance}, Requested: ${withdrawDto.amount}`,
      );
    }

    savings.balance = currentBalance - withdrawDto.amount;
    return this.savingsRepository.save(savings);
  }

  async getBalance(userId: string): Promise<number> {
    const savings = await this.getSavings(userId);
    return parseFloat(savings.balance.toString());
  }
}
