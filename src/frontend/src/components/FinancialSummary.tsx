import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import type { FinancialRecord } from '../backend';
import { RecordType } from '../backend';

interface FinancialSummaryProps {
  records: FinancialRecord[];
  isLoading: boolean;
}

export function FinancialSummary({ records, isLoading }: FinancialSummaryProps) {
  const calculateTotals = () => {
    let totalIncome = 0;
    let totalExpenses = 0;

    records.forEach((record) => {
      if (record.category === RecordType.income) {
        totalIncome += record.amount;
      } else {
        totalExpenses += record.amount;
      }
    });

    const netBalance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, netBalance };
  };

  const { totalIncome, totalExpenses, netBalance } = calculateTotals();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white shadow-lg border-sage/20">
            <CardContent className="py-8">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-sage/20 rounded w-1/2"></div>
                <div className="h-8 bg-sage/20 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Income */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Total Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-900">
            {formatCurrency(totalIncome)}
          </div>
        </CardContent>
      </Card>

      {/* Total Expenses */}
      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-red-800 flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Total Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-900">
            {formatCurrency(totalExpenses)}
          </div>
        </CardContent>
      </Card>

      {/* Net Balance */}
      <Card className="bg-gradient-to-br from-terracotta/20 to-terracotta/30 border-terracotta/40 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-terracotta-dark flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Net Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-3xl font-bold ${
              netBalance >= 0 ? 'text-green-900' : 'text-red-900'
            }`}
          >
            {formatCurrency(netBalance)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
