import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ArrowLeft, Activity, Calendar, MessageSquare, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('activity');

  const { data: response, isLoading } = useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const { data } = await api.get(`/leads/${id}`);
      return data;
    }
  });

  const lead = response?.data;

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading Lead Details...</div>;
  }

  if (!lead) {
    return <div className="p-8 text-center text-red-500">Lead not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info */}
        <div className="col-span-1 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{lead.firstName} {lead.lastName}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{lead.jobTitle} {lead.company ? `at ${lead.company}` : ''}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700 space-y-3">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500">Status</span>
                 <span className="font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{lead.status}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500">Priority</span>
                 <span className={`font-medium px-2 py-1 rounded-full`}>{lead.priority || 'Normal'}</span>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Tabs */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden min-h-[600px] flex flex-col">
            <div className="flex border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 p-2 gap-2">
              {[
                { id: 'activity', label: 'Activity', icon: Activity },
                { id: 'followups', label: 'Follow-ups', icon: Calendar },
                { id: 'notes', label: 'Notes', icon: MessageSquare }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm border border-gray-200 dark:border-slate-700'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 flex-1 bg-gray-50/20 dark:bg-slate-900/20">
              {activeTab === 'activity' && (
                 <div className="text-center text-gray-500 mt-12">
                   <p>Activity timeline will be displayed here</p>
                 </div>
              )}

              {activeTab === 'followups' && (
                <div className="text-center text-gray-500 mt-12">
                  <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p>Follow-ups module coming soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
