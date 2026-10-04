// db.ts - THE ONLY file allowed to read/write localStorage for users, products, orders
// All functions are async (return Promises) so swapping to Supabase later requires
// changing ONLY the inside of these functions, never the code that calls them.
//
// TODO SUPABASE: Each function has a SUPABASE SWAP comment showing the exact call

import { USE_SUPABASE } from './supabase-config';
import { seedUsers, seedProducts, seedOrders, User, Product, Order } from './data';
import { notifyCartChanged } from './cartEvents';

// Re-export types for use in other files
export type { User, Product, Order } from './data';

// LocalStorage keys (exact names, shared with admin dashboard)
const KEYS = {
  users: 'absu_users',
  products: 'absu_products',
  orders: 'absu_orders',
  session: 'absu_session',
  cart: 'absu_cart',
  adminAuth: 'absu_admin_auth',
};

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

// SUPABASE SWAP: Supabase seeds are handled via SQL migrations or Supabase dashboard
export async function seedIfEmpty(): Promise<void> {
  if (USE_SUPABASE) {
    // const { data: users } = await supabase.from('profiles').select('id').limit(1);
    // if (data && data.length === 0) { await supabase.from('profiles').insert(seedUsers); }
    return;
  }
  const users = readKey<User>(KEYS.users);
  const products = readKey<Product>(KEYS.products);
  const orders = readKey<Order>(KEYS.orders);
  if (users.length === 0) writeKey(KEYS.users, seedUsers);
  if (products.length === 0) writeKey(KEYS.products, seedProducts);
  if (orders.length === 0) writeKey(KEYS.orders, seedOrders);
}

// ==================== PRODUCTS ====================

// SUPABASE SWAP: const { data } = await supabase
//   .from('products').select('*, seller:profiles!seller_id(status)')
//   .eq('status', 'approved')
//   .neq('seller.status', 'banned')
//   .ilike('name', `%${search}%`)
//   .eq('category', category)
export async function getApprovedProducts(opts?: { search?: string; category?: string }): Promise<Product[]> {
  if (USE_SUPABASE) {
    // See comment above
    return [];
  }
  const products = readKey<Product>(KEYS.products);
  const users = readKey<User>(KEYS.users);

  // Apply VISIBILITY RULE: product.status === "approved" AND seller.status !== "banned"
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

// SUPABASE SWAP: const { data } = await supabase
//   .from('products').select('*').eq('id', id).single()
export async function getProductById(id: string): Promise<Product | null> {
  if (USE_SUPABASE) {
    return null;
  }
  const products = readKey<Product>(KEYS.products);
  return products.find(p => p.id === id) || null;
}

// SUPABASE SWAP: const { data } = await supabase
//   .from('products').select('*').eq('seller_id', sellerId)
export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
  if (USE_SUPABASE) {
    return [];
  }
  const products = readKey<Product>(KEYS.products);
  return products.filter(p => p.seller_id === sellerId);
}

// SUPABASE SWAP: const { data } = await supabase
//   .from('products').insert([{ ...product, status: 'pending' }]).select().single()
export async function addProduct(product: Omit<Product, 'id' | 'created_at' | 'status'>): Promise<Product> {
  if (USE_SUPABASE) {
    return {} as Product;
  }
  const products = readKey<Product>(KEYS.products);
  const newProduct: Product = {
    ...product,
    id: `p_${String(products.length + 1).padStart(3, '0')}_${Date.now()}`,
    status: 'pending',
    created_at: new Date().toISOString(),
  };
  products.push(newProduct);
  writeKey(KEYS.products, products);
  return newProduct;
}

// SUPABASE SWAP: const { data } = await supabase
//   .from('products').update(changes).eq('id', id).select().single()
export async function updateProduct(id: string, changes: Partial<Product>): Promise<Product | null> {
  if (USE_SUPABASE) {
    return null;
  }
  const products = readKey<Product>(KEYS.products);
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...changes };
  writeKey(KEYS.products, products);
  return products[idx];
}

// SUPABASE SWAP: await supabase.from('products').delete().eq('id', id)
export async function deleteProduct(id: string): Promise<boolean> {
  if (USE_SUPABASE) {
    return false;
  }
  const products = readKey<Product>(KEYS.products);
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  writeKey(KEYS.products, filtered);
  return true;
}

// ==================== USERS ====================

// SUPABASE SWAP: const { data } = await supabase
//   .from('profiles').select('*').eq('id', id).single()
export async function getUserById(id: string): Promise<User | null> {
  if (USE_SUPABASE) {
    return null;
  }
  const users = readKey<User>(KEYS.users);
  return users.find(u => u.id === id) || null;
}

// SUPABASE SWAP: const { data } = await supabase
//   .from('profiles').select('*').eq('email', email).single()
export async function findUserByEmail(email: string): Promise<User | null> {
  if (USE_SUPABASE) {
    return null;
  }
  const users = readKey<User>(KEYS.users);
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

// SUPABASE SWAP: const { data } = await supabase
//   .from('profiles').insert([user]).select().single()
export async function createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
  if (USE_SUPABASE) {
    return {} as User;
  }
  const users = readKey<User>(KEYS.users);
  const newUser: User = {
    ...user,
    id: `u_${String(users.length + 1).padStart(3, '0')}_${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  users.push(newUser);
  writeKey(KEYS.users, users);
  return newUser;
}

// ==================== ORDERS ====================

// SUPABASE SWAP: const { data } = await supabase
//   .from('orders').insert([order]).select().single()
export async function createOrder(order: Omit<Order, 'id' | 'created_at'>): Promise<Order> {
  if (USE_SUPABASE) {
    return {} as Order;
  }
  const orders = readKey<Order>(KEYS.orders);
  const newOrder: Order = {
    ...order,
    id: `o_${String(orders.length + 1).padStart(3, '0')}_${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  orders.push(newOrder);
  writeKey(KEYS.orders, orders);
  return newOrder;
}

// ==================== AUTH / SESSION ====================

// SUPABASE SWAP: const { data } = await supabase.auth.signInWithPassword({ email, password })
// For mock mode: ANY password works, but email must exist. Banned users cannot log in.
export async function loginUser(email: string, _password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  if (USE_SUPABASE) {
    return { success: false, error: 'Supabase not configured' };
  }

  // Shortcut: "seller1" logs in as first verified seller
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

// SUPABASE SWAP: await supabase.auth.signOut()
export async function logoutUser(): Promise<void> {
  if (USE_SUPABASE) {
    return;
  }
  localStorage.removeItem(KEYS.session);
}

// SUPABASE SWAP: const { data: { user } } = await supabase.auth.getUser()
export async function getSession(): Promise<User | null> {
  if (USE_SUPABASE) {
    return null;
  }
  try {
    const raw = localStorage.getItem(KEYS.session);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ==================== CART ====================

// SUPABASE SWAP: Cart will be managed client-side even with Supabase (or use a cart table)
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
