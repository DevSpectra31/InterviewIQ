import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Settings,
  History,
  BarChart3,
  Cpu,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Play,
} from 'lucide-react';
import useAuthStore from '../context/authStore.js';

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Start Interview', path: '/interviews', icon: Play },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'History', path: '/history', icon: History },
];

/**
 * Main app layout — sticky navbar with user info, mobile menu,
 * and page content via Outlet.
 */
export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased">
      {/* ─── Top Navbar ────────────────────────────────────────────── */}
      <header className="w-full sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="layout-container px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 no-underline">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-400 via-indigo-200 to-white bg-clip-text text-transparent">
                InterviewIQ
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-violet-500/10 text-violet-400 rounded-full border border-violet-500/20 hidden sm:inline-block">
                AI Powered
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all no-underline flex items-center gap-2 ${
                  isActive(item.path)
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <Link
              to="/profile"
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
              title="Profile Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* User Info */}
            <Link
              to="/profile"
              className="hidden sm:flex items-center space-x-2 border-l border-slate-800 pl-3 no-underline hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium text-slate-300 max-w-[100px] truncate">
                {user?.name || 'Candidate'}
              </span>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ─── Mobile Menu ───────────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-md w-full">
            <nav className="px-4 py-4 space-y-1 layout-container">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all no-underline ${
                    isActive(item.path)
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 w-full transition-all"
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* ─── Page Content ──────────────────────────────────────────── */}
      <main className="flex-1 layout-container px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* ─── Footer ────────────────────────────────────────────────── */}
      <footer className="w-full mt-auto border-t border-slate-900 bg-slate-950 py-6">
        <div className="layout-container px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          <p>© 2026 InterviewIQ Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
