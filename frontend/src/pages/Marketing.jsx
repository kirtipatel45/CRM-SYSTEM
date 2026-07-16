import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import DataTable from '../components/ui/DataTable';
import { motion } from 'framer-motion';
import { Megaphone, Mail, MessageCircle, BarChart3, Edit2, Trash2, CircleAlert } from 'lucide-react';
import { format } from 'date-fns';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import CampaignForm from '../components/forms/CampaignForm';

const metrics = [
  { name: 'Total Campaigns', value: '45', change: '+12%', icon: Megaphone, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { name: 'Avg. Open Rate', value: '24.8%', change: '+2.4%', icon: Mail, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { name: 'Avg. Click Rate', value: '4.2%', change: '+0.8%', icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
  { name: 'Total Conversions', value: '1,284', change: '+18%', icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
];

export default function Marketing() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data } = await api.get('/campaigns');
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/campaigns/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
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

  const campaigns = response?.data || [];

  const columns = [
    {
      header: 'Campaign Name',
      cell: (row) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {row.name}
          <div className="text-xs text-gray-500 mt-1">{row.type}</div>
        </div>
      )
    },
    {
      header: 'Status',
      cell: (row) => {
        const colors = {
          Active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
          Completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          Paused: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[row.status]}`}>
            {row.status}
          </span>
        );
      }
    },
    {
      header: 'Duration',
      cell: (row) => (
        <div className="text-sm text-gray-500">
          {row.startDate ? format(new Date(row.startDate), 'MMM dd, yyyy') : 'N/A'} - 
          {row.endDate ? format(new Date(row.endDate), 'MMM dd, yyyy') : 'N/A'}
        </div>
      )
    },
    {
      header: 'Performance',
      cell: (row) => (
        <div className="text-xs space-y-1">
          <div className="flex justify-between w-32">
            <span className="text-gray-500">Sent:</span>
            <span className="font-medium text-gray-900 dark:text-white">{row.metrics?.sent?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between w-32">
            <span className="text-gray-500">Opened:</span>
            <span className="font-medium text-gray-900 dark:text-white">{row.metrics?.opened?.toLocaleString() || 0}</span>
          </div>
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
        Failed to load campaigns.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Marketing Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor your campaign performance and ROI.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((item, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={item.name}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{item.name}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{item.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${item.bg}`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <DataTable 
        title="Active Campaigns"
        description="Manage your email, SMS, and social media campaigns."
        columns={columns}
        data={campaigns}
        loading={isLoading}
        onAdd={handleAdd}
        addButtonText="Create Campaign"
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedRecord ? 'Edit Campaign' : 'Create Campaign'}
      >
        <CampaignForm 
          initialData={selectedRecord}
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedRecord?._id)}
        title="Delete Campaign"
        message={`Are you sure you want to delete the campaign "${selectedRecord?.name}"?`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
