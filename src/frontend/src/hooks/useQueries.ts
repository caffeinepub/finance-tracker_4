import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { FinancialRecord, DateTime, RecordType } from '../backend';

export function useFinancialRecords() {
  const { actor, isFetching: isActorFetching } = useActor();
  const queryClient = useQueryClient();

  // Fetch all records
  const { data: records, isLoading } = useQuery<FinancialRecord[]>({
    queryKey: ['financial-records'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecordsSortedByDate();
    },
    enabled: !!actor && !isActorFetching,
  });

  // Add new record
  const addRecordMutation = useMutation({
    mutationFn: async ({
      date,
      description,
      amount,
      category,
    }: {
      date: DateTime;
      description: string;
      amount: number;
      category: RecordType;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addRecord(date, description, amount, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-records'] });
    },
  });

  // Delete record
  const deleteRecordMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteRecord(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-records'] });
    },
  });

  return {
    records,
    isLoading,
    addRecord: addRecordMutation.mutateAsync,
    deleteRecord: deleteRecordMutation.mutateAsync,
    isAddingRecord: addRecordMutation.isPending,
    isDeletingRecord: deleteRecordMutation.isPending,
  };
}
