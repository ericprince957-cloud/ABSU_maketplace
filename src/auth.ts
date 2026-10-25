// Auth utilities - Supabase-backed with localStorage mock fallback

import { USE_SUPABASE, SUPABASE_READY } from './supabase-config';
import { supabase } from './supabase';
import { notifyCartChanged } from './cartEvents';
import { loginUser, createUser, findUserByEmail, logoutUser, getSession, User } from './db';

const USE_AUTH = USE_SUPABASE && SUPABASE_READY;

// Auth result shape
export interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
}

// Login function
export async function loginWithEmail(email: string, password: string): Promise<AuthResult> {
  if (USE_AUTH) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true, user: data.user };
  }

  return loginUser(email, password);
}

// Signup function — creates auth user, then inserts the profile row.
// Sellers start 'pending', students start 'verified' (matches mock behaviour).
export async function signupWithEmail(
  email: string,
  password: string,
  profileData: {
    name: string;
    phone: string;
    department: string;
    role: 'student' | 'seller';
    category?: string;
  }
): Promise<AuthResult> {
  if (USE_AUTH) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { success: false, error: error.message };
    if (!data.user) return { success: false, error: 'Sign-up failed. Please try again.' };

    // Insert profile (uses the auth user id as primary key)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: data.user.id,
        name: profileData.name,
        email: email.toLowerCase(),
        phone: profileData.phone,
        department: profileData.department,
        role: profileData.role,
        status: profileData.role === 'seller' ? 'pending' : 'verified',
        category: profileData.category || null,
      }])
      .select()
      .single();

    if (profileError) return { success: false, error: profileError.message };
    return { success: true, user: profile };
  }

  // ---- Mock mode ----
  const existing = await findUserByEmail(email);
  if (existing) {
    return { success: false, error: 'An account with this email already exists' };
  }

  const user = await createUser({
    name: profileData.name,
    email: email.toLowerCase(),
    phone: profileData.phone,
    department: profileData.department,
    role: profileData.role,
    status: profileData.role === 'seller' ? 'pending' : 'verified',
    category: profileData.category,
  });

  // Auto-login
  localStorage.setItem('absu_session', JSON.stringify(user));
  notifyCartChanged();

  return { success: true, user };
}

// Logout function
export async function logout(): Promise<void> {
  if (USE_AUTH) {
    await supabase.auth.signOut();
    return;
  }

  await logoutUser();
}

// Get current session (returns the profile, not the raw auth user)
export async function getCurrentSession(): Promise<User | null> {
  return getSession();
}

// Password reset request
export async function requestPasswordReset(email: string): Promise<AuthResult> {
  if (USE_AUTH) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/#/reset-password',
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  // Mock - just return success
  return { success: true };
}

// Validation helpers
export function validateEmail(email: string): string | null {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone) return 'Phone number is required';
  const phoneRegex = /^\d{10,15}$/;
  if (!phoneRegex.test(phone)) return 'Phone number must be 10-15 digits';
  return null;
}

export function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-orange-500' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-500' };
  if (score <= 4) return { score, label: 'Strong', color: 'bg-green-500' };
  return { score, label: 'Very Strong', color: 'bg-green-600' };
}
