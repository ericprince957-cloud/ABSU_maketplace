// Signup Page - Create account for students or sellers
// Ready for Supabase integration
// TODO SUPABASE: Replace mock auth with supabase.auth.signUp + profile insert

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, GraduationCap, Store, Loader2, Check } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { signupWithEmail, validateEmail, validatePassword, validatePhone, getPasswordStrength } from '../auth';
import { DEPARTMENTS, CATEGORIES } from '../config';
import { showToast } from '../components/Toast';
import type { User as UserType } from '../data';

interface SignupProps {
  setSession: (user: UserType | null) => void;
}

export default function Signup({ setSession }: SignupProps) {
  const navigate = useNavigate();
  const [role, setRole] = useState<'student' | 'seller'>('student');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [category, setCategory] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordStrength = getPasswordStrength(password);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    
    const phoneError = validatePhone(phone);
    if (phoneError) newErrors.phone = phoneError;
    
    if (!department) newErrors.department = 'Please select your department';
    
    if (role === 'seller' && !category) {
      newErrors.category = 'Please select your main category';
    }
    
    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    const result = await signupWithEmail(email.trim(), password, {
      name: name.trim(),
      phone: phone.trim(),
      department,
      role,
      category: role === 'seller' ? category : undefined,
    });
    setLoading(false);

    if (result.success && result.user) {
      setSession(result.user);

      if (role === 'seller') {
        showToast('Account created! Your seller status is pending admin verification.', 'success');
        navigate('/seller-dashboard');
      } else {
        showToast(`Welcome to ABSU Marketplace, ${result.user.name}!`, 'success');
        navigate('/');
      }
    } else {
      showToast(result.error || 'Signup failed', 'error');
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join the ABSU Marketplace community"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            I want to
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setRole('student'); clearError('role'); }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                role === 'student'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span className="font-medium text-sm">Buy Products</span>
            </button>
            <button
              type="button"
              onClick={() => { setRole('seller'); clearError('role'); }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                role === 'seller'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <Store className="w-5 h-5" />
              <span className="font-medium text-sm">Sell Products</span>
            </button>
          </div>
        </div>

        {/* Name field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); clearError('name'); }}
              placeholder="Your full name"
              className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                errors.name ? 'border-red-500' : 'border-gray-200'
              }`}
              disabled={loading}
            />
          </div>
          {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
        </div>

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
              onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
              placeholder="you@example.com"
              className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              }`}
              autoComplete="email"
              disabled={loading}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
        </div>

        {/* Phone field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); clearError('phone'); }}
              placeholder="2348012345678"
              className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                errors.phone ? 'border-red-500' : 'border-gray-200'
              }`}
              disabled={loading}
            />
          </div>
          {errors.phone && <p className="text-xs text-red-500 mt-1.5">{errors.phone}</p>}
        </div>

        {/* Department field */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1.5">
            Department
          </label>
          <select
            id="department"
            value={department}
            onChange={(e) => { setDepartment(e.target.value); clearError('department'); }}
            className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white ${
              errors.department ? 'border-red-500' : 'border-gray-200'
            }`}
            disabled={loading}
          >
            <option value="">Select your department</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.department && <p className="text-xs text-red-500 mt-1.5">{errors.department}</p>}
        </div>

        {/* Category field (sellers only) */}
        {role === 'seller' && (
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
              Main Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => { setCategory(e.target.value); clearError('category'); }}
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white ${
                errors.category ? 'border-red-500' : 'border-gray-200'
              }`}
              disabled={loading}
            >
              <option value="">Select your main category</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-500 mt-1.5">{errors.category}</p>}
            <p className="text-xs text-gray-500 mt-1.5">
              ⏳ New seller accounts require admin verification before products show the Verified badge.
            </p>
          </div>
        )}

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
              onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
              placeholder="Create a password"
              className={`w-full pl-11 pr-12 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                errors.password ? 'border-red-500' : 'border-gray-200'
              }`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1.5">{errors.password}</p>}
          
          {/* Password strength indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i <= passwordStrength.score ? passwordStrength.color : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs ${
                passwordStrength.score <= 1 ? 'text-red-500' :
                passwordStrength.score <= 2 ? 'text-orange-500' :
                passwordStrength.score <= 3 ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {passwordStrength.label}
              </p>
            </div>
          )}
        </div>

        {/* Confirm password field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }}
              placeholder="Confirm your password"
              className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
              }`}
              disabled={loading}
            />
            {confirmPassword && password === confirmPassword && (
              <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1.5">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms checkbox */}
        <div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => { setAgreeTerms(e.target.checked); clearError('terms'); }}
              className="mt-0.5 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              disabled={loading}
            />
            <span className="text-xs text-gray-600">
              I agree to the{' '}
              <button type="button" className="text-primary hover:underline">Terms of Service</button>
              {' '}and{' '}
              <button type="button" className="text-primary hover:underline">Privacy Policy</button>
            </span>
          </label>
          {errors.terms && <p className="text-xs text-red-500 mt-1.5">{errors.terms}</p>}
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
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Login link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-dark font-semibold transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
