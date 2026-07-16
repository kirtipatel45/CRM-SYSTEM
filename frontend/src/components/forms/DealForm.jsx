import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Loader2 } from 'lucide-react';

const dealSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  value: z.coerce.number().min(0).default(0),
  customer: z.string().min(1, 'Customer is required'),
  stage: z.enum(['Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost']).default('Discovery'),
  expectedCloseDate: z.string().optional(),
  probability: z.coerce.number().min(0).max(100).default(50),
});

export default function DealForm({ initialData, onSuccess, onCancel }) {
  const queryClient = useQueryClient();
  const isEdit = !!initialData;

  // Fetch customers for the dropdown
  const { data: customersData, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data } = await api.get('/customers');
      return data;
    }
  });
  const customers = customersData?.data || [];

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: initialData?.title || '',
      value: initialData?.value || 0,
      customer: initialData?.customer?._id || initialData?.customer || '',
      stage: initialData?.stage || 'Discovery',
      expectedCloseDate: initialData?.expectedCloseDate ? new Date(initialData.expectedCloseDate).toISOString().split('T')[0] : '',
      probability: initialData?.probability || 50,
    }
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const payload = { ...data };
      if (!payload.expectedCloseDate) delete payload.expectedCloseDate;
      
      if (isEdit) {
        return await api.put(`/deals/${initialData._id}`, payload);
      } else {
        return await api.post('/deals', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      onSuccess();
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {mutation.isError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
          {mutation.error?.response?.data?.message || 'Something went wrong.'}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deal Title</label>
        <input
          type="text"
          {...register('title')}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="e.g., Enterprise License - Q4"
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer</label>
        <select
          {...register('customer')}
          disabled={isLoadingCustomers}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50"
        >
          <option value="">Select a customer...</option>
          {customers.map(c => (
            <option key={c._id} value={c._id}>{c.company}</option>
          ))}
        </select>
        {errors.customer && <p className="mt-1 text-sm text-red-500">{errors.customer.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value ($)</label>
          <input
            type="number"
            {...register('value')}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Probability (%)</label>
          <input
            type="number"
            {...register('probability')}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stage</label>
          <select
            {...register('stage')}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {['Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Close Date</label>
          <input
            type="date"
            {...register('expectedCloseDate')}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 dark:border-slate-700 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={mutation.isPending}
          className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70"
        >
          {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isEdit ? 'Save Changes' : 'Create Deal'}
        </button>
      </div>
    </form>
  );
}
