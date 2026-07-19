import { Routes, Route, Navigate } from 'react-router-dom';
import { Cpu } from 'lucide-react';

// Layouts
import AppLayout from '../layouts/AppLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';

// Route Guards
import ProtectedRoute from './ProtectedRoute.jsx';

// Pages
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';

// Auth-aware redirect: push authenticated users away from login/register
import useAuthStore from '../context/authStore.js';

function GuestRoute({ children }) {
  const { isAuthenticated, isHydrating } = useAuthStore();

  if (isHydrating) return null; // Wait until auth check completes
  if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
}

/**
 * Placeholder page for routes not yet implemented.
 */
function PlaceholderPage({ title }) {
  return (
    <section className="bg-slate-900/30 border border-slate-800 rounded-2xl p-12 text-center">
      <Cpu className="w-12 h-12 text-violet-400 mx-auto mb-4 animate-pulse" />
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 max-w-md mx-auto">
        This module is coming soon. We&apos;re building something amazing here.
      </p>
    </section>
  );
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
        <Route
          path="/interviews"
          element={<PlaceholderPage title="Start Interview" />}
        />
        <Route
          path="/analytics"
          element={<PlaceholderPage title="Analytics" />}
        />
        <Route
          path="/history"
          element={<PlaceholderPage title="History" />}
        />
      </Route>

      {/* ─── Catch-all → Dashboard ─────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
