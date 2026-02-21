import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import type { FinancialRecord } from '../backend';
import { RecordType } from '../backend';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface RecordsTableProps {
  records: FinancialRecord[];
  isLoading: boolean;
  onDelete: (id: bigint) => Promise<void>;
}

export function RecordsTable({ records, isLoading, onDelete }: RecordsTableProps) {
  const formatDateTime = (dateTime: FinancialRecord['date']): string => {
    try {
      const date = new Date(
        Number(dateTime.year),
        Number(dateTime.month) - 1,
        Number(dateTime.day),
        Number(dateTime.hour),
        Number(dateTime.minute),
        Number(dateTime.second)
      );
      return format(date, 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card className="bg-white shadow-lg border-sage/20">
        <CardContent className="py-12">
          <div className="text-center text-sage-dark/60">Loading records...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg border-sage/20">
      <CardHeader className="bg-sage/10">
        <CardTitle className="text-2xl text-sage-dark flex items-center gap-2">
          <Receipt className="w-6 h-6" />
          Transaction History
        </CardTitle>
        <CardDescription className="text-sage-dark/70">
          {records.length} {records.length === 1 ? 'record' : 'records'} total
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {records.length === 0 ? (
          <div className="text-center py-12 text-sage-dark/60">
            <Receipt className="w-16 h-16 mx-auto mb-4 text-sage/40" />
            <p className="text-lg">No records yet</p>
            <p className="text-sm mt-2">Add your first transaction to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-sage/20 hover:bg-sage/5">
                  <TableHead className="text-sage-dark font-semibold">Date</TableHead>
                  <TableHead className="text-sage-dark font-semibold">Description</TableHead>
                  <TableHead className="text-sage-dark font-semibold">Category</TableHead>
                  <TableHead className="text-sage-dark font-semibold text-right">Amount</TableHead>
                  <TableHead className="text-sage-dark font-semibold text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id.toString()} className="border-sage/10 hover:bg-sage/5">
                    <TableCell className="text-sage-dark/80">
                      {formatDateTime(record.date)}
                    </TableCell>
                    <TableCell className="text-sage-dark font-medium">
                      {record.description}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.category === RecordType.income
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {record.category === RecordType.income ? 'Income' : 'Expense'}
                      </span>
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold ${
                        record.category === RecordType.income
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}
                    >
                      {record.category === RecordType.income ? '+' : '-'}
                      {formatCurrency(record.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Record</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this record? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(record.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
