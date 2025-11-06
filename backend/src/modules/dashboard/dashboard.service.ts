import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Income } from '@modules/incomes/entities/income.entity';
import { Expense } from '@modules/expenses/entities/expense.entity';
import { Category } from '@modules/categories/entities/category.entity';
import { Saving } from '@modules/savings/entities/saving.entity';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Income)
    private incomesRepository: Repository<Income>,
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Saving)
    private savingsRepository: Repository<Saving>,
  ) {}

  async getDashboardStats(userId: string) {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Get current month income and expenses
    const [monthlyIncome, monthlyExpenses, savingsAccount, categories] = await Promise.all([
      this.getTotalIncome(userId, monthStart, monthEnd),
      this.getTotalExpenses(userId, monthStart, monthEnd),
      this.savingsRepository.findOne({ where: { userId } }),
      this.categoriesRepository.find({ where: { userId } }),
    ]);

    // Calculate current balance (total income - total expenses across all time)
    const totalIncome = await this.getTotalIncome(userId);
    const totalExpenses = await this.getTotalExpenses(userId);
    const currentBalance = totalIncome - totalExpenses;

    // Get category spending
    const categorySpending = await this.getCategorySpending(userId, monthStart, monthEnd, categories);

    // Get recent transactions
    const recentTransactions = await this.getRecentTransactions(userId, 10);

    // Get monthly trend (last 6 months)
    const monthlyTrend = await this.getMonthlyTrend(userId, 6);

    return {
      currentBalance,
      savingsBalance: savingsAccount ? parseFloat(savingsAccount.balance.toString()) : 0,
      monthlyIncome,
      monthlyExpenses,
      monthlyNetIncome: monthlyIncome - monthlyExpenses,
      categorySpending,
      recentTransactions,
      monthlyTrend,
    };
  }

  private async getTotalIncome(userId: string, startDate?: Date, endDate?: Date): Promise<number> {
    const queryBuilder = this.incomesRepository
      .createQueryBuilder('income')
      .select('SUM(income.amount)', 'total')
      .where('income.userId = :userId', { userId });

    if (startDate && endDate) {
      queryBuilder.andWhere('income.date BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    const result = await queryBuilder.getRawOne();
    return parseFloat(result.total) || 0;
  }

  private async getTotalExpenses(userId: string, startDate?: Date, endDate?: Date): Promise<number> {
    const queryBuilder = this.expensesRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.userId = :userId', { userId });

    if (startDate && endDate) {
      queryBuilder.andWhere('expense.date BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    const result = await queryBuilder.getRawOne();
    return parseFloat(result.total) || 0;
  }

  private async getCategorySpending(
    userId: string,
    startDate: Date,
    endDate: Date,
    categories: Category[],
  ) {
    // Get average monthly income for budget calculation
    const monthlyIncome = await this.getTotalIncome(userId, startDate, endDate);

    const spending = await Promise.all(
      categories.map(async (category) => {
        const result = await this.expensesRepository
          .createQueryBuilder('expense')
          .select('SUM(expense.amount)', 'spent')
          .where('expense.userId = :userId', { userId })
          .andWhere('expense.categoryId = :categoryId', { categoryId: category.id })
          .andWhere('expense.date BETWEEN :startDate AND :endDate', { startDate, endDate })
          .getRawOne();

        const spent = parseFloat(result.spent) || 0;
        const budget = (monthlyIncome * parseFloat(category.percentage.toString())) / 100;
        const percentageUsed = budget > 0 ? (spent / budget) * 100 : 0;

        return {
          categoryId: category.id,
          categoryName: category.name,
          categoryColor: category.color,
          spent,
          budget,
          remaining: Math.max(0, budget - spent),
          percentageUsed: Math.min(100, percentageUsed),
        };
      }),
    );

    return spending.sort((a, b) => b.spent - a.spent);
  }

  private async getRecentTransactions(userId: string, limit: number = 10) {
    // Get recent incomes
    const incomes = await this.incomesRepository.find({
      where: { userId },
      order: { date: 'DESC', createdAt: 'DESC' },
      take: limit,
    });

    // Get recent expenses
    const expenses = await this.expensesRepository.find({
      where: { userId },
      relations: ['category'],
      order: { date: 'DESC', createdAt: 'DESC' },
      take: limit,
    });

    // Combine and sort
    const transactions = [
      ...incomes.map((income) => ({
        ...income,
        type: 'income' as const,
      })),
      ...expenses.map((expense) => ({
        ...expense,
        type: 'expense' as const,
      })),
    ].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateB.getTime() !== dateA.getTime()) {
        return dateB.getTime() - dateA.getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return transactions.slice(0, limit);
  }

  private async getMonthlyTrend(userId: string, months: number = 6) {
    const trends = [];

    for (let i = 0; i < months; i++) {
      const month = subMonths(new Date(), i);
      const startDate = startOfMonth(month);
      const endDate = endOfMonth(month);

      const [income, expenses] = await Promise.all([
        this.getTotalIncome(userId, startDate, endDate),
        this.getTotalExpenses(userId, startDate, endDate),
      ]);

      trends.unshift({
        month: startDate.toISOString(),
        monthLabel: startDate.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long' }),
        income,
        expenses,
        net: income - expenses,
      });
    }

    return trends;
  }
}
