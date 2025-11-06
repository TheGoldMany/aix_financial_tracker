import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Income } from '@modules/incomes/entities/income.entity';
import { Expense } from '@modules/expenses/entities/expense.entity';
import { Category } from '@modules/categories/entities/category.entity';
import { Saving } from '@modules/savings/entities/saving.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Income, Expense, Category, Saving])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
