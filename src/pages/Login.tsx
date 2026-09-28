// Login Page - Authentication for students and sellers
// Two tabs: Student/Seller, Login/Signup toggle
// Shortcut: "seller1" logs in as first verified seller
// TODO SUPABASE: Replace mock auth with supabase.auth at launch

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { loginUser, createUser, findUserByEmail } from '../db';
import { DEPARTMENTS, CATEGORIES } from '../config';
import { showToast } from '../components/Toast';
import type { User } from '../data';

interface LoginProps {
  setSession: (user: User | null) => void;
}

export default function Login({ setSession }: LoginProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'student' | 'seller'>('student');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your email or username', 'error');
      return;
    }
    setLoading(true);
    const result = await loginUser(email.trim(), password);
    setLoading(false);

    if (result.success && result.user) {
      setSession(result.user);
      showToast(`Welcome back, ${result.user.name}!`, 'success');
      if (result.user.role === 'seller') {
        navigate('/seller-dashboard');
      } else {
        navigate('/');
      }
    } else {
      showToast(result.error || 'Login failed', 'error');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || !email.trim() || !phone.trim() || !department || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    if (tab === 'seller' && !category) {
      showToast('Please select your main category', 'error');
      return;
    }
    if (!/^\d{10,15}$/.test(phone)) {
      showToast('Phone number must be 10-15 digits', 'error');
      return;
    }

    // Check if email exists
    const existing = await findUserByEmail(email.trim());
    if (existing) {
      showToast('An account with this email already exists', 'error');
      return;
    }

    setLoading(true);
    const user = await createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      department,
      role: tab,
      status: tab === 'seller' ? 'pending' : 'verified',
      category: tab === 'seller' ? category : undefined,
    });
    setLoading(false);

    // Auto-login after signup
    localStorage.setItem('absu_session', JSON.stringify(user));
    setSession(user);

    if (tab === 'seller') {
      showToast('Account created! Your seller status is pending admin verification.', 'success');
      navigate('/seller-dashboard');
    } else {
      showToast(`Welcome, ${user.name}!`, 'success');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Simple header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Marketplace</span>
          </Link>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            {/* Title */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {mode === 'login' ? 'Sign in to your account' : 'Join the ABSU Marketplace community'}
              </p>
            </div>

            {/* Role tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setTab('student')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  tab === 'student' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🎓 Student
              </button>
              <button
                onClick={() => setTab('seller')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  tab === 'seller' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🏪 Seller
              </button>
            </div>

            {/* Login/Signup toggle */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setMode('login')}
                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                  mode === 'login' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                  mode === 'signup' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Login form */}
            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email or Username
                  </label>
                  <input
                    id="login-email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com or seller1"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    autoComplete="email"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    💡 Tip: Type "seller1" to login as a demo seller
                  </p>
                </div>
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Any password works in demo"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            ) : (
              /* Signup form */
              <form onSubmit={handleSignup} className="space-y-3">
                <div>
                  <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="signup-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="2348012345678"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="signup-dept" className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    id="signup-dept"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                {tab === 'seller' && (
                  <div>
                    <label htmlFor="signup-category" className="block text-sm font-medium text-gray-700 mb-1">
                      Main Category
                    </label>
                    <select
                      id="signup-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
                    >
                      <option value="">Select your main category</option>
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
                {tab === 'seller' && (
                  <p className="text-xs text-gray-500 text-center">
                    ⏳ New seller accounts require admin verification before products show the Verified badge.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
