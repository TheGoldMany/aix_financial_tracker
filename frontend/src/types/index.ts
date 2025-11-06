export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isPro: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  percentage: number;
  color: string;
  isDefault: boolean;
  description?: string;
}

export interface Income {
  id: string;
  amount: number;
  description?: string;
  date: string;
  category?: string;
  savingsPercentage: number;
  createdAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  description?: string;
  date: string;
  categoryId: string;
  source: 'balance' | 'savings';
  createdAt: string;
  category?: Category;
}

export interface Saving {
  id: string;
  balance: number;
  updatedAt: string;
}

export interface DashboardStats {
  currentBalance: number;
  savingsBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  categorySpending: Array<{
    categoryId: string;
    categoryName: string;
    spent: number;
    budget: number;
    percentage: number;
  }>;
  recentTransactions: Array<Income | Expense>;
}
