import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { motion } from "framer-motion";
import { Users, Target, Briefcase, TrendingUp } from "lucide-react";

const stats = [
  {
    name: "Total Leads",
    value: "2,845",
    change: "+12.5%",
    icon: Target,
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    name: "Qualified Leads",
    value: "1,234",
    change: "+18.2%",
    icon: Users,
    color: "text-indigo-600",
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
  },
  {
    name: "Customers",
    value: "845",
    change: "+5.4%",
    icon: Briefcase,
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  {
    name: "Revenue",
    value: "$84,532",
    change: "+24.5%",
    icon: TrendingUp,
    color: "text-purple-600",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
];

export default function Dashboard() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data } = await api.get("/reports/dashboard");
      return data;
    },
  });

  const liveStats = response?.data || {
    totalLeads: 0,
    qualifiedLeads: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    conversionRate: 0,
  };

  const stats = [
    {
      name: "Total Leads",
      value: liveStats.totalLeads,
      change: "--",
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      name: "Qualified Leads",
      value: liveStats.qualifiedLeads,
      change: "--",
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      name: "Customers",
      value: liveStats.totalCustomers,
      change: "--",
      icon: Briefcase,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      name: "Revenue",
      value: `$${liveStats.totalRevenue.toLocaleString()}`,
      change: "--",
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, here's what's happening today.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={item.name}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {item.name}
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {item.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${item.bg}`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {item.change}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                from last month
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 min-h-[400px] flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            Sales Chart (Coming Soon)
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 min-h-[400px] flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            Recent Activities (Coming Soon)
          </p>
        </div>
      </div>
    </div>
  );
}
