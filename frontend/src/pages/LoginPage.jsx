import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { useToast } from '../components/Toast.jsx';
import useAuthStore from '../context/authStore.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { login, isLoading } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error on type
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!form.password) {
      errs.password = 'Password is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await login({
      email: form.email.trim(),
      password: form.password,
    });

    if (result.success) {
      addToast({
        type: 'success',
        title: 'Welcome back!',
        message: 'You have been logged in successfully.',
      });
      navigate('/', { replace: true });
    } else {
      addToast({
        type: 'error',
        title: 'Login failed',
        message: result.message || 'Invalid email or password.',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="auth-card-header">
        <h1>Welcome back</h1>
        <p>Sign in to your InterviewIQ account</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <Input
          id="login-email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          value={form.email}
          onChange={updateField('email')}
          error={errors.email}
          required
          autoComplete="email"
        />

        <Input
          id="login-password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon={Lock}
          value={form.password}
          onChange={updateField('password')}
          error={errors.password}
          required
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between mb-6 mt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-violet-500 focus:ring-violet-500 focus:ring-offset-0 cursor-pointer accent-violet-500"
            />
            <span className="text-xs text-slate-400">Remember me</span>
          </label>
          <button
            type="button"
            className="text-xs text-violet-400 hover:text-violet-300 font-medium bg-transparent border-none cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
        >
          Sign In
        </Button>
      </form>

      {/* Footer */}
      <div className="auth-footer">
        <p>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="auth-link">
            Create one
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
