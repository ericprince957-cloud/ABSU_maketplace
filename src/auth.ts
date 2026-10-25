// Auth utilities - Ready for Supabase integration
// All functions have SUPABASE SWAP comments for easy migration
// TODO SUPABASE: Replace localStorage mock with supabase.auth calls

import { USE_SUPABASE } from './supabase-config';
import { notifyCartChanged } from './cartEvents';
import { loginUser, createUser, findUserByEmail, logoutUser, getSession } from './db';

// Auth result shape
export interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
}

// Login function
// SUPABASE SWAP: const { data, error } = await supabase.auth.signInWithPassword({ email, password })
export async function loginWithEmail(email: string, password: string): Promise<AuthResult> {
  if (USE_SUPABASE) {
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password
    // });
    // if (error) return { success: false, error: error.message };
    // return { success: true, user: data.user };
    return { success: false, error: 'Supabase not configured' };
  }
  
  return loginUser(email, password);
}

// Signup function
// SUPABASE SWAP: const { data, error } = await supabase.auth.signUp({ email, password })
// Then insert profile into profiles table
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
  if (USE_SUPABASE) {
    // const { data, error } = await supabase.auth.signUp({
    //   email,
    //   password
    // });
    // if (error) return { success: false, error: error.message };
    // 
    // // Insert profile
    // const { error: profileError } = await supabase
    //   .from('profiles')
    //   .insert([{
    //     id: data.user.id,
    //     name: profileData.name,
    //     email,
    //     phone: profileData.phone,
    //     department: profileData.department,
    //     role: profileData.role,
    //     status: profileData.role === 'seller' ? 'pending' : 'verified',
    //     category: profileData.category
    //   }]);
    // 
    // if (profileError) return { success: false, error: profileError.message };
    // return { success: true, user: data.user };
    return { success: false, error: 'Supabase not configured' };
  }
  
  // Check if email exists
  const existing = await findUserByEmail(email);
  if (existing) {
    return { success: false, error: 'An account with this email already exists' };
  }
  
  // Create user
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
// SUPABASE SWAP: await supabase.auth.signOut()
export async function logout(): Promise<void> {
  if (USE_SUPABASE) {
    // await supabase.auth.signOut();
    return;
  }
  
  await logoutUser();
}

// Get current session
// SUPABASE SWAP: const { data: { session } } = await supabase.auth.getSession()
export async function getCurrentSession(): Promise<any> {
  if (USE_SUPABASE) {
    // const { data: { session } } = await supabase.auth.getSession();
    // return session?.user || null;
    return null;
  }
  
  return getSession();
}

// Password reset request
// SUPABASE SWAP: await supabase.auth.resetPasswordForEmail(email, { redirectTo: '...' })
export async function requestPasswordReset(email: string): Promise<AuthResult> {
  if (USE_SUPABASE) {
    // const { error } = await supabase.auth.resetPasswordForEmail(email, {
    //   redirectTo: `${window.location.origin}/reset-password`
    // });
    // if (error) return { success: false, error: error.message };
    // return { success: true };
    return { success: false, error: 'Supabase not configured' };
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
