import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import DataTable from '../components/ui/DataTable';
import { Building2, Edit2, Trash2, Globe, Mail, Phone, CircleAlert } from 'lucide-react';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import CustomerForm from '../components/forms/CustomerForm';

export default function Customers() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data } = await api.get('/customers');
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
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

  const customers = response?.data || [];

  const columns = [
    {
      header: 'Company Name',
      cell: (row) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {row.company}
            </div>
            <div className="text-xs flex flex-wrap gap-2 mt-1 text-gray-500">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {row.email}</span>
              {row.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3"/> {row.phone}</span>}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Contact Person',
      accessor: 'contactPerson'
    },
    {
      header: 'Website',
      cell: (row) => (
        row.website ? (
          <a href={row.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
            <Globe className="w-3 h-3" /> Visit
          </a>
        ) : (
          <span className="text-gray-400 text-sm">N/A</span>
        )
      )
    },
    {
      header: 'Revenue',
      cell: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          ${row.revenue?.toLocaleString() || 0}
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
        Failed to load customers. Please check your permissions or network.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DataTable 
        title="Customers"
        description="Manage your active customer base and their details."
        columns={columns}
        data={customers}
        loading={isLoading}
        onAdd={handleAdd}
        addButtonText="New Customer"
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedRecord ? 'Edit Customer' : 'Create Customer'}
      >
        <CustomerForm 
          initialData={selectedRecord}
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedRecord?._id)}
        title="Delete Customer"
        message={`Are you sure you want to delete "${selectedRecord?.company}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
