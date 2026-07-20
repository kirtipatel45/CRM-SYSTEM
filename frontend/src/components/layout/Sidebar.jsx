import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Target, 
  Megaphone, 
  Settings,
  ListTodo,
  UserCog,
  Shield
} from 'lucide-react';
import { useSelector } from 'react-redux';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Leads', path: '/leads', icon: Target },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Deals', path: '/deals', icon: Briefcase },
  { name: 'Marketing', path: '/marketing', icon: Megaphone },
  { name: 'Tasks', path: '/tasks', icon: ListTodo },
  { name: 'Users', path: '/users', icon: UserCog },
  { name: 'Audit Logs', path: '/audit-logs', icon: Shield },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  
  const filteredNavItems = navItems.filter(item => {
    if (item.name === 'Audit Logs') {
      return user?.role?.name === 'Admin';
    }
    return true;
  });
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="w-64 flex-shrink-0 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 h-full flex flex-col transition-colors duration-200">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-slate-700">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Target className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">CRM Pro</span>
        </motion.div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto py-4 px-3 space-y-1"
      >
        {filteredNavItems.map((item) => (
          <motion.div key={item.name} variants={itemVariants}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'bg-blue-50/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-medium shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm z-10">{item.name}</span>
            </NavLink>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="p-4 border-t border-gray-200 dark:border-slate-700">
        <motion.div 
          whileHover={{ scale: 1.02, translateY: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-10 rounded-full -mr-8 -mt-8 transform rotate-45 pointer-events-none"></div>
          <h4 className="text-sm font-semibold mb-1">Need help?</h4>
          <p className="text-xs text-blue-100 mb-3">Check our documentation</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs w-full bg-white/20 hover:bg-white/30 transition-colors py-1.5 rounded-md font-medium"
          >
            Docs
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
