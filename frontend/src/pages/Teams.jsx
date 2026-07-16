import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import DataTable from '../components/ui/DataTable';
import { Users2, Edit2, Trash2, CircleAlert, Crown } from 'lucide-react';

export default function Teams() {
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data } = await api.get('/teams');
      return data;
    }
  });

  const teams = response?.data || [];

  const columns = [
    {
      header: 'Team Name',
      cell: (row) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Users2 className="w-5 h-5" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {row.name}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {row.department}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Leader',
      cell: (row) => (
        row.leader ? (
          <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100">
            <Crown className="w-4 h-4 mr-2 text-yellow-500" />
            {row.leader.name}
          </div>
        ) : (
          <span className="text-sm text-gray-400">Unassigned</span>
        )
      )
    },
    {
      header: 'Members',
      cell: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300">
          {row.members?.length || 0} Members
        </span>
      )
    },
    {
      header: 'Targets',
      cell: (row) => (
        <div className="text-xs space-y-1 text-gray-500 dark:text-gray-400">
          <div>Revenue: <span className="font-medium text-gray-900 dark:text-white">${row.targets?.revenue?.toLocaleString() || 0}</span></div>
          <div>Leads: <span className="font-medium text-gray-900 dark:text-white">{row.targets?.leads || 0}</span></div>
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
        Failed to load teams.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DataTable 
        title="Departments & Teams"
        description="Manage organizational hierarchy, assign leaders, and set team targets."
        columns={columns}
        data={teams}
        loading={isLoading}
        onAdd={() => console.log('Add Team')}
        addButtonText="Create Team"
      />
    </div>
  );
}
