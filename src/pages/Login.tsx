// Login Page - Clean, focused login experience
// Ready for Supabase integration
// TODO SUPABASE: Replace mock auth with supabase.auth.signInWithPassword

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { loginWithEmail, validateEmail } from '../auth';
import { showToast } from '../components/Toast';
import type { User } from '../data';

interface LoginProps {
  setSession: (user: User | null) => void;
}

export default function Login({ setSession }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    
    if (!password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    const result = await loginWithEmail(email.trim(), password);
    setLoading(false);

    if (result.success && result.user) {
      setSession(result.user);
      showToast(`Welcome back, ${result.user.name}!`, 'success');
      
      // Redirect based on role
      if (result.user.role === 'seller') {
        navigate('/seller-dashboard');
      } else {
        navigate('/');
      }
    } else {
      showToast(result.error || 'Login failed', 'error');
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your ABSU Marketplace account"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              placeholder="you@example.com"
              className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              }`}
              autoComplete="email"
              disabled={loading}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>
          )}
        </div>

        {/* Password field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              placeholder="Enter your password"
              className={`w-full pl-11 pr-12 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                errors.password ? 'border-red-500' : 'border-gray-200'
              }`}
              autoComplete="current-password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1.5">{errors.password}</p>
          )}
        </div>

        {/* Forgot password link */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => showToast('Password reset coming soon with Supabase!', 'info')}
            className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        {/* Demo hint */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
          <p className="font-medium mb-1">💡 Demo Mode</p>
          <p>
            Type <code className="bg-blue-100 px-1.5 py-0.5 rounded">seller1</code> as email to login as a demo seller.
            Any password works in demo mode.
          </p>
        </div>
      </form>

      {/* Sign up link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:text-primary-dark font-semibold transition-colors">
            Create Account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
