'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { LogOut, TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import api from '@/lib/api';

interface DashboardStats {
  currentBalance: number;
  savingsBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyNetIncome: number;
  categorySpending: Array<{
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    spent: number;
    budget: number;
    remaining: number;
    percentageUsed: number;
  }>;
  recentTransactions: any[];
  monthlyTrend: any[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get<DashboardStats>('/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Betöltés...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Üdvözöljük, {user?.firstName || user?.email}!
          </h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Kijelentkezés
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jelenlegi egyenleg</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats?.currentBalance || 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Összes bevétel - kiadás
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Megtakarítás</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats?.savingsBalance || 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Félretett összeg
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Havi bevétel</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +{formatCurrency(stats?.monthlyIncome || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ebben a hónapban
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Havi kiadás</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                -{formatCurrency(stats?.monthlyExpenses || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ebben a hónapban
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Spending */}
        {stats && stats.categorySpending && stats.categorySpending.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Költségvetés kategóriák szerint</CardTitle>
              <CardDescription>
                A havi költségvetés felhasználása kategóriánként
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.categorySpending.map((category) => (
                  <div key={category.categoryId}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: category.categoryColor }}
                        />
                        <span className="text-sm font-medium">{category.categoryName}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(category.spent)} / {formatCurrency(category.budget)}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          category.percentageUsed > 100 ? 'bg-red-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(category.percentageUsed, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {category.percentageUsed.toFixed(1)}% felhasználva
                      </span>
                      <span
                        className={`text-xs ${
                          category.remaining < 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {category.remaining < 0 ? 'Túllépés: ' : 'Fennmaradó: '}
                        {formatCurrency(Math.abs(category.remaining))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Welcome Message for New Users */}
        {(!stats || stats.monthlyIncome === 0) && (
          <Card>
            <CardHeader>
              <CardTitle>Kezdje el használni a Pénzügyi Követőt!</CardTitle>
              <CardDescription>
                Még nincsenek tranzakciói. Kezdje el bevételei és kiadásai rögzítésével.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Button className="w-full" onClick={() => router.push('/incomes')}>
                  Bevétel hozzáadása
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push('/expenses')}>
                  Kiadás hozzáadása
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
