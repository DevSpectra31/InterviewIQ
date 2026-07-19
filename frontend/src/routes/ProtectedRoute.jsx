import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../context/authStore.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

/**
 * ProtectedRoute — guards routes that require authentication.
 * Shows loading spinner while auth is being verified on first load.
 * Redirects to /login if not authenticated.
 *
 * @param {{ children: React.ReactNode }} props
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isHydrating } = useAuthStore();
  const location = useLocation();

  // Still checking stored token validity
  if (isHydrating) {
    return <LoadingSpinner text="Verifying session..." />;
  }

  if (!isAuthenticated) {
    // Save the attempted URL so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
