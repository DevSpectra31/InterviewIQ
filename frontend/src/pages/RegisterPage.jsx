import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, UserPlus } from 'lucide-react';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { useToast } from '../components/Toast.jsx';
import useAuthStore from '../context/authStore.js';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { register, isLoading } = useAuthStore();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const errs = {};

    if (!form.name.trim()) {
      errs.name = 'Name is required';
    } else if (form.name.trim().length > 100) {
      errs.name = 'Name cannot exceed 100 characters';
    }

    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address';
    }

    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    });

    if (result.success) {
      addToast({
        type: 'success',
        title: 'Account created!',
        message: 'Welcome to InterviewIQ. Let\'s get started.',
      });
      navigate('/', { replace: true });
    } else {
      addToast({
        type: 'error',
        title: 'Registration failed',
        message: result.message || 'Could not create account.',
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
        <h1>Create your account</h1>
        <p>Start your AI-powered interview prep journey</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <Input
          id="register-name"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          icon={UserPlus}
          value={form.name}
          onChange={updateField('name')}
          error={errors.name}
          required
          autoComplete="name"
        />

        <Input
          id="register-email"
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
          id="register-password"
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          icon={Lock}
          value={form.password}
          onChange={updateField('password')}
          error={errors.password}
          required
          autoComplete="new-password"
        />

        <Input
          id="register-confirm"
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          icon={Lock}
          value={form.confirmPassword}
          onChange={updateField('confirmPassword')}
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
        />

        <div className="mt-2">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
          >
            Create Account
          </Button>
        </div>
      </form>

      {/* Footer */}
      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
