import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import type { DateTime, RecordType } from '../backend';
import { RecordType as RecordTypeEnum } from '../backend';

interface RecordFormProps {
  onSubmit: (data: {
    date: DateTime;
    description: string;
    amount: number;
    category: RecordType;
  }) => Promise<bigint>;
}

export function RecordForm({ onSubmit }: RecordFormProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<RecordType>(RecordTypeEnum.expense);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    try {
      setIsSubmitting(true);

      // Convert Date to DateTime format
      const dateTime: DateTime = {
        year: BigInt(date.getFullYear()),
        month: BigInt(date.getMonth() + 1),
        day: BigInt(date.getDate()),
        hour: BigInt(date.getHours()),
        minute: BigInt(date.getMinutes()),
        second: BigInt(date.getSeconds()),
      };

      await onSubmit({
        date: dateTime,
        description: description.trim(),
        amount: amountNum,
        category,
      });

      // Reset form
      setDescription('');
      setAmount('');
      setDate(new Date());
      setCategory(RecordTypeEnum.expense);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white shadow-lg border-sage/20">
      <CardHeader className="bg-sage/10">
        <CardTitle className="text-2xl text-sage-dark flex items-center gap-2">
          <Plus className="w-6 h-6" />
          Add New Record
        </CardTitle>
        <CardDescription className="text-sage-dark/70">
          Track your income and expenses
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sage-dark font-medium">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-sage/30 hover:bg-sage/5"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-sage" />
                    {format(date, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sage-dark font-medium">
                Category
              </Label>
              <Select value={category} onValueChange={(value) => setCategory(value as RecordType)}>
                <SelectTrigger className="border-sage/30 hover:bg-sage/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={RecordTypeEnum.income}>Income</SelectItem>
                  <SelectItem value={RecordTypeEnum.expense}>Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sage-dark font-medium">
              Description
            </Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Grocery shopping, Salary, etc."
              className="border-sage/30 focus:border-sage focus:ring-sage"
              required
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sage-dark font-medium">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="border-sage/30 focus:border-sage focus:ring-sage"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-terracotta hover:bg-terracotta-dark text-cream font-semibold"
          >
            {isSubmitting ? 'Adding...' : 'Add Record'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
