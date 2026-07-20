import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, setLoading } from "./store/slices/authSlice";
import api from "./services/api";

import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import LeadDetails from './pages/LeadDetails';
import AuditLogs from './pages/AuditLogs';
import Leads from "./pages/Leads";
import Customers from "./pages/Customers";
import Deals from "./pages/Deals";
import Marketing from "./pages/Marketing";
import Teams from "./pages/Teams";
import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";

function App() {
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        dispatch(setCredentials({ user: res.data.user }));
      } catch (error) {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
        />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="customers" element={<Customers />} />
          <Route path="deals" element={<Deals />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="teams" element={<Teams />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="settings" element={<Roles />} />{" "}
          {/* settings mapped to roles for now */}
          {/* Add more routes here for other modules */}
          <Route
            path="*"
            element={
              <div className="p-8 text-center text-gray-500">
                Page not found or under construction
              </div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
