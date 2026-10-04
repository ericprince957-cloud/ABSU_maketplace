# Authentication Pages - Complete & Supabase-Ready

## ✅ What Was Built

### 1. **Login Page** (`/login`)
- Clean, professional design with split layout
- Email + password fields with icons
- Show/hide password toggle
- "Forgot password?" link (placeholder for Supabase)
- Demo mode hint (type "seller1" to login as demo seller)
- Real-time validation
- Loading states with spinner
- Error handling with toast notifications
- Redirects sellers to dashboard, students to home

### 2. **Signup Page** (`/signup`)
- Role selector: "Buy Products" (Student) or "Sell Products" (Seller)
- Full name, email, phone, department fields
- Category selector (sellers only)
- Password field with strength indicator (Weak → Very Strong)
- Confirm password with match indicator
- Terms & conditions checkbox
- Real-time validation for all fields
- Password visibility toggle
- Loading states
- Auto-login after signup
- Sellers see pending verification message

### 3. **Shared Auth Layout** (`AuthLayout.tsx`)
- Consistent branding across login/signup
- Left panel with trust indicators (desktop only)
- Mobile-responsive design
- Back to marketplace link
- Professional gradient background

### 4. **Auth Utilities** (`auth.ts`)
- `loginWithEmail()` - Login with email/password
- `signupWithEmail()` - Create account with profile data
- `logout()` - Sign out
- `getCurrentSession()` - Get current user
- `requestPasswordReset()` - Password reset (placeholder)
- Validation helpers: `validateEmail()`, `validatePassword()`, `validatePhone()`
- `getPasswordStrength()` - Password strength calculator
- All functions have `SUPABASE SWAP` comments

## 🎨 Design Features

### Login Page
- Split-screen layout (trust indicators on left, form on right)
- Icon-enhanced input fields
- Smooth transitions and hover states
- Accessible labels and focus states
- Demo mode helper box

### Signup Page
- Visual role selector (Student vs Seller)
- Password strength meter (5 levels)
- Green checkmark when passwords match
- Conditional category field (sellers only)
- Terms checkbox with links
- Helpful hints for seller verification

### Auth Layout
- Gradient background
- Trust indicators: Verified Sellers, Admin-Approved, Campus Community
- Responsive (stacks on mobile)
- Consistent branding

## 🔌 Supabase Integration Guide

### Step 1: Update Config
```typescript
// src/supabase-config.ts
export const SUPABASE_URL = "https://your-project.supabase.co";
export const SUPABASE_ANON_KEY = "your-anon-key";
export const USE_SUPABASE = true; // ← Flip to true
```

### Step 2: Auth Functions Are Ready
All auth functions in `src/auth.ts` have commented Supabase code. Just uncomment:

#### Login
```typescript
// In loginWithEmail():
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});
if (error) return { success: false, error: error.message };
return { success: true, user: data.user };
```

#### Signup
```typescript
// In signupWithEmail():
const { data, error } = await supabase.auth.signUp({
  email,
  password
});
if (error) return { success: false, error: error.message };

// Insert profile
const { error: profileError } = await supabase
  .from('profiles')
  .insert([{
    id: data.user.id,
    name: profileData.name,
    email,
    phone: profileData.phone,
    department: profileData.department,
    role: profileData.role,
    status: profileData.role === 'seller' ? 'pending' : 'verified',
    category: profileData.category
  }]);

if (profileError) return { success: false, error: profileError.message };
return { success: true, user: data.user };
```

#### Logout
```typescript
// In logout():
await supabase.auth.signOut();
```

#### Get Session
```typescript
// In getCurrentSession():
const { data: { session } } = await supabase.auth.getSession();
return session?.user || null;
```

#### Password Reset
```typescript
// In requestPasswordReset():
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`
});
if (error) return { success: false, error: error.message };
return { success: true };
```

### Step 3: Database Schema
Already documented in README.md. Key tables:
- `profiles` - User profiles (maps to auth.users)
- `products` - Product listings
- `orders` - Order history

### Step 4: RLS Policies
Already documented in README.md. Key policies:
- Anyone can read approved products
- Sellers can CRUD their own products
- Anyone can create orders

## 📁 File Structure

```
src/
├── auth.ts                    # Auth utilities (Supabase-ready)
├── components/
│   └── AuthLayout.tsx         # Shared auth page layout
└── pages/
    ├── Login.tsx              # Login page
    └── Signup.tsx             # Signup page
```

## 🧪 Testing Checklist

### Login Page
- [ ] Email validation works
- [ ] Password field shows/hides correctly
- [ ] "Forgot password?" shows info toast
- [ ] Demo mode hint is visible
- [ ] Login with "seller1" works
- [ ] Login with existing email works (any password)
- [ ] Invalid email shows error
- [ ] Empty password shows error
- [ ] Loading state shows spinner
- [ ] Sellers redirect to dashboard
- [ ] Students redirect to home
- [ ] "Create Account" link works

### Signup Page
- [ ] Role selector works (Student/Seller)
- [ ] All fields validate correctly
- [ ] Email validation works
- [ ] Phone validation (10-15 digits)
- [ ] Department dropdown works
- [ ] Category shows for sellers only
- [ ] Password strength indicator updates
- [ ] Password match check works (green checkmark)
- [ ] Terms checkbox required
- [ ] Loading state shows spinner
- [ ] Duplicate email shows error
- [ ] Auto-login after signup
- [ ] Sellers see pending message
- [ ] "Sign In" link works

### Auth Layout
- [ ] Trust indicators show on desktop
- [ ] Layout stacks on mobile
- [ ] Back to marketplace link works
- [ ] Branding is consistent

## 🎯 Current Features

### Mock Mode (Current)
- ✅ Login with any existing email (any password)
- ✅ "seller1" shortcut for demo seller
- ✅ Signup creates user in localStorage
- ✅ Auto-login after signup
- ✅ Session persists across page reloads
- ✅ Logout clears session

### Supabase Mode (Future)
- ⏳ Email/password authentication
- ⏳ Email verification (optional)
- ⏳ Password reset via email
- ⏳ OAuth providers (Google, etc.)
- ⏳ Session management
- ⏳ Row-level security

## 🚀 Next Steps

1. **Test the auth flow** - Try login and signup
2. **Connect to Supabase** - Follow the integration guide above
3. **Add email verification** - Uncomment Supabase auth code
4. **Add password reset** - Create `/reset-password` page
5. **Add OAuth** - Google, GitHub, etc. (optional)

## 📝 Notes

- All auth functions are in `src/auth.ts` for easy Supabase swap
- Validation is client-side (Supabase also validates server-side)
- Password strength is visual only (Supabase enforces rules)
- Session is stored in localStorage (Supabase uses cookies)
- "seller1" shortcut only works in mock mode
- Terms links are placeholders (create actual pages)

## 🔒 Security Notes

- Never expose service_role key in frontend
- Use RLS policies in Supabase
- Validate on both client and server
- Hash passwords (Supabase does this automatically)
- Use HTTPS in production
- Implement rate limiting (Supabase does this)
