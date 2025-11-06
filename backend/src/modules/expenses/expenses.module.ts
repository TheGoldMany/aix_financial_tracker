import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { Expense } from './entities/expense.entity';
import { Saving } from '@modules/savings/entities/saving.entity';
import { Category } from '@modules/categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Saving, Category])],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
