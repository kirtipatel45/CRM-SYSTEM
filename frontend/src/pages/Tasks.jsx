import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import DataTable from '../components/ui/DataTable';
import { CheckSquare, Clock, Edit2, Trash2, CircleAlert } from 'lucide-react';
import { format } from 'date-fns';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import TaskForm from '../components/forms/TaskForm';

export default function Tasks() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await api.get('/tasks');
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
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

  const tasks = response?.data || [];

  const columns = [
    {
      header: 'Task',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-white">{row.title}</span>
          {row.description && <span className="text-xs text-gray-500 mt-1 line-clamp-1">{row.description}</span>}
        </div>
      )
    },
    {
      header: 'Status',
      cell: (row) => {
        const colors = {
          'To Do': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
          'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          'Done': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[row.status]}`}>
            {row.status === 'Done' && <CheckSquare className="w-3 h-3 mr-1" />}
            {row.status}
          </span>
        );
      }
    },
    {
      header: 'Priority',
      cell: (row) => {
        const colors = {
          'Low': 'text-gray-500',
          'Medium': 'text-orange-500',
          'High': 'text-red-500 font-medium'
        };
        return <span className={colors[row.priority]}>{row.priority}</span>;
      }
    },
    {
      header: 'Due Date',
      cell: (row) => (
        row.dueDate ? (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-3 h-3 mr-1" />
            {format(new Date(row.dueDate), 'MMM dd, yyyy')}
          </div>
        ) : <span className="text-gray-400 text-sm">No Due Date</span>
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
        Failed to load tasks.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DataTable 
        title="My Tasks"
        description="Manage your daily tasks and priorities."
        columns={columns}
        data={tasks}
        loading={isLoading}
        onAdd={handleAdd}
        addButtonText="Create Task"
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedRecord ? 'Edit Task' : 'Create Task'}
      >
        <TaskForm 
          initialData={selectedRecord}
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedRecord?._id)}
        title="Delete Task"
        message={`Are you sure you want to delete the task "${selectedRecord?.title}"?`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
