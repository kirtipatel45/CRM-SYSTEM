import { motion } from 'framer-motion';

const statuses = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];

export default function LeadKanban({ leads, loading, onStatusChange }) {
  if (loading) {
    return <div className="text-center p-12 text-gray-500">Loading Kanban...</div>;
  }

  const handleDragStart = (e, leadId) => {
    e.dataTransfer.setData('leadId', leadId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (leadId) {
      onStatusChange(leadId, status);
    }
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 min-h-[600px]">
      {statuses.map((status) => (
        <div 
          key={status} 
          className="flex-shrink-0 w-80 bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 border border-gray-200 dark:border-slate-800 flex flex-col"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
        >
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">{status}</h3>
            <span className="bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              {leads.filter(l => l.status === status).length}
            </span>
          </div>
          
          <div className="flex-1 space-y-3 overflow-y-auto">
            {leads.filter(l => l.status === status).map((lead) => (
              <motion.div
                layoutId={lead._id}
                key={lead._id}
                draggable
                onDragStart={(e) => handleDragStart(e, lead._id)}
                className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  {lead.firstName} {lead.lastName}
                </div>
                {lead.company && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {lead.company}
                  </div>
                )}
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-md">
                    {lead.source}
                  </span>
                  <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold" title={lead.owner?.name}>
                    {lead.owner ? lead.owner.name.charAt(0) : '?'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
