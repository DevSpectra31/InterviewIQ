import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AppLayout from '../layouts/AppLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';

// Route Guards
import ProtectedRoute from './ProtectedRoute.jsx';

// Pages
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import InterviewSetupPage from '../pages/InterviewSetupPage.jsx';
import InterviewSessionPage from '../pages/InterviewSessionPage.jsx';
import HistoryPage from '../pages/HistoryPage.jsx';
import AnalyticsPage from '../pages/AnalyticsPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';

// Auth-aware redirect: push authenticated users away from login/register
import useAuthStore from '../context/authStore.js';

function GuestRoute({ children }) {
  const { isAuthenticated, isHydrating } = useAuthStore();

  if (isHydrating) return null; // Wait until auth check completes
  if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
}

/**
 * AppRouter — defines all application routes.
 */
export default function AppRouter() {
  return (
    <Routes>
      {/* ─── Auth Routes (public, guest-only) ──────────────────────── */}
      <Route
        element={
          <GuestRoute>
            <AuthLayout />
          </GuestRoute>
        }
      >
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* ─── Protected App Routes ──────────────────────────────────── */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/interviews" element={<InterviewSetupPage />} />
        <Route path="/interviews/:id" element={<InterviewSessionPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* ─── Catch-all → Dashboard ─────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
