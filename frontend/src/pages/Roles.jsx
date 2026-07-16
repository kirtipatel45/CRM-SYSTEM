import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import DataTable from '../components/ui/DataTable';
import { Edit2, Trash2, KeyRound, CircleAlert } from 'lucide-react';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import RoleForm from '../components/forms/RoleForm';

export default function Roles() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data } = await api.get('/roles');
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/roles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
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

  const roles = response?.data || [];

  const columns = [
    {
      header: 'Role Name',
      cell: (row) => (
        <div className="flex items-center font-medium text-gray-900 dark:text-white">
          <KeyRound className="w-4 h-4 mr-2 text-blue-500" />
          {row.name}
          {row.isSystem && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300">
              System
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Permissions Configured',
      cell: (row) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {row.permissions?.length || 0} Modules
        </div>
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
          {!row.isSystem && (
            <button 
              onClick={() => handleDeleteClick(row)}
              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  if (isError) {
    return (
      <div className="bg-red-50 p-4 rounded-xl flex items-center text-red-800">
        <CircleAlert className="w-5 h-5 mr-3" />
        Failed to load roles. Please check your permissions or network.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DataTable 
        title="Roles & Permissions"
        description="Manage system roles and configure module-level access."
        columns={columns}
        data={roles}
        loading={isLoading}
        onAdd={handleAdd}
        addButtonText="Create Role"
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedRecord ? 'Edit Role' : 'Create Role'}
      >
        <RoleForm 
          initialData={selectedRecord}
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedRecord?._id)}
        title="Delete Role"
        message={`Are you sure you want to delete the role "${selectedRecord?.name}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
