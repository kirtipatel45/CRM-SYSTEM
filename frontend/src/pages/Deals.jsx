import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { motion } from 'framer-motion';
import { CircleAlert, DollarSign, Calendar, TrendingUp, Building2, Edit2, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import DealForm from '../components/forms/DealForm';

const stages = ['Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost'];

export default function Deals() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const { data } = await api.get('/deals');
      return data;
    }
  });

  const updateDealStage = useMutation({
    mutationFn: async ({ dealId, newStage }) => {
      const { data } = await api.put(`/deals/${dealId}`, { stage: newStage });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/deals/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      setIsConfirmOpen(false);
      setSelectedRecord(null);
    }
  });

  const deals = response?.data || [];

  const handleDragStart = (e, dealId) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, stage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    if (dealId) {
      updateDealStage.mutate({ dealId, newStage: stage });
    }
  };

  const handleAdd = () => {
    setSelectedRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record, e) => {
    e.stopPropagation();
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (record, e) => {
    e.stopPropagation();
    setSelectedRecord(record);
    setIsConfirmOpen(true);
  };

  if (isError) {
    return (
      <div className="bg-red-50 p-4 rounded-xl flex items-center text-red-800">
        <CircleAlert className="w-5 h-5 mr-3" />
        Failed to load deals.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Sales Pipeline</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track and manage your ongoing deals across stages.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Deal
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 min-h-[600px]">
        {stages.map((stage) => {
          const stageDeals = deals.filter(d => d.stage === stage);
          const stageTotal = stageDeals.reduce((sum, deal) => sum + deal.value, 0);

          return (
            <div 
              key={stage} 
              className="flex-shrink-0 w-80 bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 border border-gray-200 dark:border-slate-800 flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className="mb-4 px-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">{stage}</h3>
                  <span className="bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    {stageDeals.length}
                  </span>
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-1 flex items-center">
                  <DollarSign className="w-3 h-3 mr-0.5" />
                  {stageTotal.toLocaleString()}
                </div>
              </div>
              
              <div className="flex-1 space-y-3 overflow-y-auto min-h-[150px]">
                {isLoading ? (
                  <div className="text-center text-sm text-gray-400 py-4">Loading...</div>
                ) : (
                  stageDeals.map((deal) => (
                    <motion.div
                      layoutId={deal._id}
                      key={deal._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal._id)}
                      className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                        stage === 'Won' ? 'bg-green-500' : 
                        stage === 'Lost' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                      
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {deal.title}
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => handleEdit(deal, e)}
                            className="p-1 text-gray-400 hover:text-blue-500 rounded transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteClick(deal, e)}
                            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                        <Building2 className="w-3 h-3 mr-1" />
                        {deal.customer?.company || 'No Company'}
                      </div>
                      
                      <div className="flex justify-between items-end mt-4">
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            {deal.value.toLocaleString()}
                          </div>
                          {deal.expectedCloseDate && (
                            <div className="text-[10px] text-gray-400 mt-1 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {format(new Date(deal.expectedCloseDate), 'MMM dd')}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center text-xs font-medium text-orange-500 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-md">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {deal.probability}%
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedRecord ? 'Edit Deal' : 'Create Deal'}
      >
        <DealForm 
          initialData={selectedRecord}
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedRecord?._id)}
        title="Delete Deal"
        message={`Are you sure you want to delete the deal "${selectedRecord?.title}"?`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
