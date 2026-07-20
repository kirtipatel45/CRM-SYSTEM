import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import DataTable from '../components/ui/DataTable';
import { Edit2, Trash2, Shield, CircleAlert } from 'lucide-react';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import UserForm from '../components/forms/UserForm';

export default function Users() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users');
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsConfirmOpen(false);
      setSelectedRecord(null);
    }
  });

  const handleAdd = () => {
    setSelectedRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (record) => {
    setSelectedRecord(record);
    setIsConfirmOpen(true);
  };

  const users = response?.data || [];

  const columns = [
    {
      header: 'Name',
      cell: (row) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
              {row.name ? row.name.charAt(0) : '?'}
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
      header: 'Department / Team',
      cell: (row) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {row.department || '-'} <span className="text-gray-500">/</span> {row.team || '-'}
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
          <button 
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDeleteClick(row)}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          >
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
        onAdd={handleAdd}
        addButtonText="Add User"
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedRecord ? 'Edit User' : 'Create User'}
      >
        <UserForm 
          initialData={selectedRecord}
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedRecord?._id)}
        title="Delete User"
        message={`Are you sure you want to delete "${selectedRecord?.name}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
