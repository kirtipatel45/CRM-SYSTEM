import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Target, 
  Megaphone, 
  Settings,
  ListTodo
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Leads', path: '/leads', icon: Target },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Deals', path: '/deals', icon: Briefcase },
  { name: 'Marketing', path: '/marketing', icon: Megaphone },
  { name: 'Tasks', path: '/tasks', icon: ListTodo },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <div className="w-64 flex-shrink-0 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 h-full flex flex-col transition-colors duration-200">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Target className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">CRM Pro</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-slate-700">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white shadow-lg shadow-blue-500/20">
          <h4 className="text-sm font-semibold mb-1">Need help?</h4>
          <p className="text-xs text-blue-100 mb-3">Check our documentation</p>
          <button className="text-xs w-full bg-white/20 hover:bg-white/30 transition-colors py-1.5 rounded-md font-medium">
            Docs
          </button>
        </div>
      </div>
    </div>
  );
}
