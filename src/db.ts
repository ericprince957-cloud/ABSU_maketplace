// db.ts - THE ONLY file allowed to read/write data for users, products, orders
// Mock mode uses localStorage; Supabase mode uses the real backend.
// All functions are async so callers never change when the backend flips.

import { USE_SUPABASE, SUPABASE_READY } from './supabase-config';
import { supabase } from './supabase';
import { seedUsers, seedProducts, seedOrders, User, Product, Order } from './data';
import { notifyCartChanged } from './cartEvents';

// Re-export types for use in other files
export type { User, Product, Order } from './data';

const USE_DB = USE_SUPABASE && SUPABASE_READY;

// LocalStorage keys (exact names, shared with admin dashboard)
const KEYS = {
  users: 'absu_users',
  products: 'absu_products',
  orders: 'absu_orders',
  session: 'absu_session',
  cart: 'absu_cart',
  adminAuth: 'absu_admin_auth',
  version: 'absu_data_version',
};

// Data version - increment this to force reset localStorage data
const DATA_VERSION = '2.0';

// Helper: read JSON from localStorage
function readKey<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Helper: write JSON to localStorage
function writeKey<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Cart item shape
export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  seller_id: string;
  image: string;
}

// ==================== SEED ====================

// Supabase seeds are handled by backend/seed.sql — nothing to do here.
export async function seedIfEmpty(): Promise<void> {
  if (USE_DB) return;

  // Check data version - if changed, reset all data
  const currentVersion = localStorage.getItem(KEYS.version);
  if (currentVersion !== DATA_VERSION) {
    localStorage.removeItem(KEYS.users);
    localStorage.removeItem(KEYS.products);
    localStorage.removeItem(KEYS.orders);
    localStorage.setItem(KEYS.version, DATA_VERSION);
  }

  const users = readKey<User>(KEYS.users);
  const products = readKey<Product>(KEYS.products);
  const orders = readKey<Order>(KEYS.orders);
  if (users.length === 0) writeKey(KEYS.users, seedUsers);
  if (products.length === 0) writeKey(KEYS.products, seedProducts);
  if (orders.length === 0) writeKey(KEYS.orders, seedOrders);
}

// ==================== PRODUCTS ====================

// Visible products: status === 'approved' AND seller not banned.
// Enforced by RLS on the backend; also filtered client-side as a safety net.
export async function getApprovedProducts(opts?: { search?: string; category?: string }): Promise<Product[]> {
  if (USE_DB) {
    let query = supabase
      .from('products')
      .select('*, seller:profiles!products_seller_id_fkey(status)')
      .eq('status', 'approved');
    if (opts?.search) query = query.ilike('name', '%' + opts.search + '%');
    if (opts?.category) query = query.eq('category', opts.category);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || [])
      .filter((row: any) => (row.seller as any)?.status !== 'banned')
      .map(({ seller, ...product }: any) => product as Product);
  }

  const products = readKey<Product>(KEYS.products);
  const users = readKey<User>(KEYS.users);

  // Apply VISIBILITY RULE: product.status === 'approved' AND seller.status !== 'banned'
  let filtered = products.filter(p => {
    if (p.status !== 'approved') return false;
    const seller = users.find(u => u.id === p.seller_id);
    if (!seller || seller.status === 'banned') return false;
    return true;
  });

  if (opts?.search) {
    const q = opts.search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
  }
  if (opts?.category) {
    filtered = filtered.filter(p => p.category === opts.category);
  }

  return filtered;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (USE_DB) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (data as Product) || null;
  }
  const products = readKey<Product>(KEYS.products);
  return products.find(p => p.id === id) || null;
}

export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
  if (USE_DB) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as Product[];
  }
  const products = readKey<Product>(KEYS.products);
  return products.filter(p => p.seller_id === sellerId);
}

export async function addProduct(product: Omit<Product, 'id' | 'created_at' | 'status'>): Promise<Product> {
  if (USE_DB) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('You must be logged in to add a product');
    const { data, error } = await supabase
      .from('products')
      .insert([{ ...product, seller_id: userData.user.id, status: 'pending' }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Product;
  }
  const products = readKey<Product>(KEYS.products);
  const newProduct: Product = {
    ...product,
    id: 'p_' + String(products.length + 1).padStart(3, '0') + '_' + Date.now(),
    status: 'pending',
    created_at: new Date().toISOString(),
  };
  products.push(newProduct);
  writeKey(KEYS.products, products);
  return newProduct;
}

export async function updateProduct(id: string, changes: Partial<Product>): Promise<Product | null> {
  if (USE_DB) {
    // Sellers may not change their own approval status via the public client.
    const { seller_id, status, ...editable } = changes as any;
    const { data, error } = await supabase
      .from('products')
      .update(editable)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (data as Product) || null;
  }
  const products = readKey<Product>(KEYS.products);
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...changes };
  writeKey(KEYS.products, products);
  return products[idx];
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (USE_DB) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  }
  const products = readKey<Product>(KEYS.products);
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  writeKey(KEYS.products, filtered);
  return true;
}

// ==================== USERS ====================

export async function getUserById(id: string): Promise<User | null> {
  if (USE_DB) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (data as User) || null;
  }
  const users = readKey<User>(KEYS.users);
  return users.find(u => u.id === id) || null;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  if (USE_DB) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (data as User) || null;
  }
  const users = readKey<User>(KEYS.users);
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
  if (USE_DB) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ ...user, email: user.email.toLowerCase() }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as User;
  }
  const users = readKey<User>(KEYS.users);
  const newUser: User = {
    ...user,
    id: 'u_' + String(users.length + 1).padStart(3, '0') + '_' + Date.now(),
    created_at: new Date().toISOString(),
  };
  users.push(newUser);
  writeKey(KEYS.users, users);
  return newUser;
}

// ==================== ORDERS ====================

export async function createOrder(order: Omit<Order, 'id' | 'created_at'>): Promise<Order> {
  if (USE_DB) {
    const { data, error } = await supabase
      .from('orders')
      .insert([{ ...order }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Order;
  }
  const orders = readKey<Order>(KEYS.orders);
  const newOrder: Order = {
    ...order,
    id: 'o_' + String(orders.length + 1).padStart(3, '0') + '_' + Date.now(),
    created_at: new Date().toISOString(),
  };
  orders.push(newOrder);
  writeKey(KEYS.orders, orders);
  return newOrder;
}

// ==================== AUTH / SESSION ====================

export async function loginUser(email: string, _password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  if (USE_DB) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: _password,
    });
    if (error || !data.user) {
      return { success: false, error: error?.message || 'Login failed' };
    }
    const profile = await getUserById(data.user.id);
    if (!profile) return { success: false, error: 'Profile not found. Please contact admin.' };
    if (profile.status === 'banned') {
      await supabase.auth.signOut();
      return { success: false, error: 'Your account has been banned. Contact admin for assistance.' };
    }
    return { success: true, user: profile };
  }

  // Shortcut: 'seller1' logs in as first verified seller
  let targetEmail = email;
  if (email.toLowerCase() === 'seller1') {
    const users = readKey<User>(KEYS.users);
    const firstVerified = users.find(u => u.role === 'seller' && u.status === 'verified');
    if (firstVerified) {
      targetEmail = firstVerified.email;
    }
  }

  const user = await findUserByEmail(targetEmail);
  if (!user) {
    return { success: false, error: 'Account not found. Please sign up first.' };
  }
  if (user.status === 'banned') {
    return { success: false, error: 'Your account has been banned. Contact admin for assistance.' };
  }

  // Save session
  localStorage.setItem(KEYS.session, JSON.stringify(user));
  return { success: true, user };
}

export async function logoutUser(): Promise<void> {
  if (USE_DB) {
    await supabase.auth.signOut();
    return;
  }
  localStorage.removeItem(KEYS.session);
}

export async function getSession(): Promise<User | null> {
  if (USE_DB) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return getUserById(user.id);
  }
  try {
    const raw = localStorage.getItem(KEYS.session);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ==================== CART ====================
// Cart stays client-side in both modes (localStorage).

export async function getCart(): Promise<CartItem[]> {
  return readKey<CartItem>(KEYS.cart);
}

export async function addToCart(item: CartItem): Promise<CartItem[]> {
  const cart = readKey<CartItem>(KEYS.cart);
  const existing = cart.find(c => c.product_id === item.product_id);
  if (existing) {
    existing.qty += item.qty;
  } else {
    cart.push({ ...item });
  }
  writeKey(KEYS.cart, cart);
  notifyCartChanged();
  return cart;
}

export async function updateCartQty(productId: string, qty: number): Promise<CartItem[]> {
  const cart = readKey<CartItem>(KEYS.cart);
  const item = cart.find(c => c.product_id === productId);
  if (item) {
    item.qty = Math.max(1, qty);
  }
  writeKey(KEYS.cart, cart);
  notifyCartChanged();
  return cart;
}

export async function removeFromCart(productId: string): Promise<CartItem[]> {
  const cart = readKey<CartItem>(KEYS.cart).filter(c => c.product_id !== productId);
  writeKey(KEYS.cart, cart);
  notifyCartChanged();
  return cart;
}

export async function clearCart(): Promise<void> {
  writeKey(KEYS.cart, []);
  notifyCartChanged();
}

export async function getCartCount(): Promise<number> {
  const cart = readKey<CartItem>(KEYS.cart);
  return cart.reduce((sum, item) => sum + item.qty, 0);
}
