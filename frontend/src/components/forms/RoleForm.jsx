import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Loader2 } from 'lucide-react';

const roleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  isSystem: z.boolean().default(false),
});

export default function RoleForm({ initialData, onSuccess, onCancel }) {
  const queryClient = useQueryClient();
  const isEdit = !!initialData;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: initialData?.name || '',
      isSystem: initialData?.isSystem || false,
    }
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      // In a real app, we'd also handle the complex permissions array in this form.
      // For this simplified version, we'll just handle the name.
      const payload = {
        ...data,
        permissions: initialData?.permissions || []
      };

      if (isEdit) {
        return await api.put(`/roles/${initialData._id}`, payload);
      } else {
        return await api.post('/roles', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role Name</label>
        <input
          type="text"
          {...register('name')}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="e.g., Sales Manager"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
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
          {isEdit ? 'Save Changes' : 'Create Role'}
        </button>
      </div>
    </form>
  );
}
