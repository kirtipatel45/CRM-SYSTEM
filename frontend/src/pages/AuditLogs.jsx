import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { format } from 'date-fns';
import { Shield, FileText, User, Filter, Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function AuditLogs() {
  const { user } = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    resource: '',
    action: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['auditLogs', page, filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams({ page, limit: 15 });
      if (filters.resource) queryParams.append('resource', filters.resource);
      if (filters.action) queryParams.append('action', filters.action);
      
      const { data } = await api.get(`/audit-logs?${queryParams.toString()}`);
      return data;
    },
    // Only fetch if admin
    enabled: user?.role?.name === 'Admin'
  });

  const logs = data?.data || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  if (user?.role?.name !== 'Admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Shield className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-gray-500 dark:text-gray-400">You do not have permission to view audit logs. This area is restricted to Administrators only.</p>
      </div>
    );
  }

  const getActionColor = (action) => {
    const act = action.toLowerCase();
    if (act.includes('create')) return 'bg-green-100 text-green-800';
    if (act.includes('update') || act.includes('edit')) return 'bg-blue-100 text-blue-800';
    if (act.includes('delete') || act.includes('remove')) return 'bg-red-100 text-red-800';
    if (act.includes('login') || act.includes('auth')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Audit Logs
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            System-wide security and activity monitoring
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
          <Filter className="w-4 h-4" />
          Filters:
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <select 
            value={filters.resource}
            onChange={(e) => setFilters(prev => ({ ...prev, resource: e.target.value }))}
            className="w-full pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">All Resources</option>
            {['Leads', 'Customers', 'Deals', 'Users', 'Roles', 'Settings', 'Auth', 'Other'].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-1 min-w-[200px] relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search actions (e.g., login, create)..."
            value={filters.action}
            onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resource</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP Address</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-slate-700/50">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                        <p>No audit logs found matching criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={log._id} 
                      className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs shrink-0">
                            {log.performedBy ? log.performedBy.name.charAt(0) : 'S'}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {log.performedBy ? log.performedBy.name : 'System'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {log.resource}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono text-xs">
                        {log.ipAddress || 'Unknown'}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!isLoading && logs.length > 0 && (
          <div className="bg-gray-50 dark:bg-slate-900/50 px-6 py-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing page <span className="font-medium text-gray-900 dark:text-white">{pagination.page}</span> of <span className="font-medium text-gray-900 dark:text-white">{pagination.pages}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
