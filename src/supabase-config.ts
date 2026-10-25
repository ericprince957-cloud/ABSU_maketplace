// SUPABASE CONFIG
// Values can come from Vercel/Netlify env vars (recommended) or be pasted here.
// Flip USE_SUPABASE to true to switch from localStorage mock to Supabase.

export const SUPABASE_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL || "PASTE_YOUR_SUPABASE_URL_HERE";
export const SUPABASE_ANON_KEY =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "PASTE_YOUR_ANON_KEY_HERE";
export const USE_SUPABASE = false; // flip to true at launch

// Sanity check: don't try to use Supabase with placeholder credentials
export const SUPABASE_READY =
  USE_SUPABASE &&
  SUPABASE_URL.startsWith("https://") &&
  SUPABASE_ANON_KEY.length > 20;

// NEVER place a service_role key in any front-end file
