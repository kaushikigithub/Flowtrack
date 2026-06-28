import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './pages/Login';
import Register from './pages/Register';
import ManagerDashboard from './pages/ManagerDashboard';
import MemberDashboard from './pages/MemberDashboard';
import ProjectView from './pages/ProjectView';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function DashboardRouter() {
  const { isManager } = useAuth();
  return isManager ? <ManagerDashboard /> : <MemberDashboard />;
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageWrapper><DashboardRouter /></PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <PageWrapper><ProjectView /></PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;