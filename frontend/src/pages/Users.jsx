import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import DataTable from '../components/ui/DataTable';
import { Edit2, Trash2, Shield, CircleAlert } from 'lucide-react';

export default function Users() {
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users');
      return data;
    }
  });

  const users = response?.data || [];

  const columns = [
    {
      header: 'Name',
      cell: (row) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
              {row.name.charAt(0)}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{row.name}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      cell: (row) => (
        <div className="flex items-center">
          <Shield className="w-4 h-4 mr-2 text-indigo-500" />
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
            {row.role?.name || 'No Role'}
          </span>
        </div>
      )
    },
    {
      header: 'Status',
      cell: (row) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.isActive 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  if (isError) {
    return (
      <div className="bg-red-50 p-4 rounded-xl flex items-center text-red-800">
        <CircleAlert className="w-5 h-5 mr-3" />
        Failed to load users. Please check your permissions or network.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DataTable 
        title="Users"
        description="Manage your team members and their account access."
        columns={columns}
        data={users}
        loading={isLoading}
        onAdd={() => console.log('Open Add User Modal')}
        addButtonText="Add User"
      />
    </div>
  );
}
