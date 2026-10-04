# ABSU Marketplace Pro

A trusted peer-to-peer marketplace for Abia State University (ABSU) students. Buy and sell safely within your campus community — every seller is verified.

## Features

- 🛍️ **Browse Products** — 7 categories: Fashion, Food, Textbooks, Electronics, Services, Web Development, Beauty
- 🔍 **Search & Filter** — Real-time search by name, filter by category
- ✅ **Verified Sellers** — Green badge for admin-approved sellers
- 📇 **Seller Directory** — Browse real verified sellers with direct WhatsApp contact
- 🛒 **Shopping Cart** — Add items, adjust quantities, view totals
- 💬 **WhatsApp Checkout** — Orders sent directly via WhatsApp
- 🏪 **Seller Dashboard** — Add, edit, delete products; track approval status
- 🔐 **Authentication** — Student & Seller login/signup (mocked for now)
- 📱 **Fully Responsive** — Mobile-first design (360px → desktop)

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS v4
- React Router (HashRouter for static hosting)
- Lucide React (icons)
- Vercel Analytics

## Data Architecture

All data is stored in localStorage with these exact keys (shared with admin dashboard):
- `absu_users` — User profiles
- `absu_products` — Product listings
- `absu_orders` — Order history
- `absu_session` — Current logged-in user
- `absu_cart` — Cart items
- `absu_admin_auth` — Admin login state

### Visibility Rule
Products are shown ONLY if:
1. `product.status === "approved"` AND
2. The seller's `status !== "banned"`

## HOW TO RUN & TEST

### Running Locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

### Testing Checklist

#### Home Page
- [ ] Hero section displays with search bar
- [ ] Trust banner shows below hero
- [ ] "How It Works" section displays 3 steps
- [ ] Category filter buttons work (click to filter, click again to clear)
- [ ] Product grid shows only approved products from non-banned sellers
- [ ] Search filters products in real-time by name
- [ ] Empty state shows when no products match
- [ ] Product cards show seller name with verified badge (green check)
- [ ] Clicking a product card opens the detail modal
- [ ] Modal has image gallery, quantity selector, add to cart
- [ ] Modal closes with X button, backdrop click, or Escape key
- [ ] Cart counter in header updates instantly after adding items
- [ ] Back-to-top button appears after scrolling down

#### Cart Page
- [ ] Cart lists items with image, name, seller, price
- [ ] Quantity controls (+/−) work (minimum 1)
- [ ] Remove button removes item
- [ ] Line totals and grand total calculate correctly
- [ ] Empty cart shows "Continue Shopping" button
- [ ] Checkout asks for buyer name (pre-filled if logged in)
- [ ] "Place Order" opens WhatsApp with pre-filled message
- [ ] Order is saved to localStorage
- [ ] Cart is cleared after successful checkout

#### Login Page
- [ ] Student/Seller tabs switch correctly
- [ ] Login/Signup toggle works
- [ ] Signup creates user (students → verified, sellers → pending)
- [ ] Login with existing email works (any password in demo)
- [ ] Typing "seller1" logs in as first verified seller
- [ ] Banned users see error message
- [ ] Sellers redirect to dashboard, students to home

#### Seller Dashboard
- [ ] Non-sellers are redirected to login
- [ ] Pending sellers see yellow verification banner
- [ ] Stats show total, approved, pending, rejected counts
- [ ] Products listed with status badges
- [ ] "Add Product" form validates all fields
- [ ] New products start as "pending"
- [ ] Edit pre-fills form with product data
- [ ] Delete shows confirmation dialog
- [ ] Seller can only edit/delete their own products
- [ ] Logout button works

## SUPABASE LAUNCH CHECKLIST

### Files to Modify

1. **`src/supabase-config.ts`**
   - [ ] Set `SUPABASE_URL` to your Supabase project URL
   - [ ] Set `SUPABASE_ANON_KEY` to your anon/public key
   - [ ] Set `USE_SUPABASE = true`
   - [ ] ⚠️ NEVER put service_role key in frontend

2. **`src/config.ts`**
   - [ ] Set `WHATSAPP_NUMBER` to the platform owner's real WhatsApp number

3. **`src/db.ts`** — Each function has a `// SUPABASE SWAP:` comment showing the exact Supabase call. Uncomment/replace the mock code with the Supabase equivalent:
   - [ ] `seedIfEmpty()` → Supabase seeds via SQL migrations
   - [ ] `getApprovedProducts()` → Join products + profiles, filter by status
   - [ ] `getProductById()` → `.from('products').select('*').eq('id', id)`
   - [ ] `getProductsBySeller()` → `.from('products').select('*').eq('seller_id', id)`
   - [ ] `addProduct()` → `.from('products').insert({...}).select()`
   - [ ] `updateProduct()` → `.from('products').update(changes).eq('id', id)`
   - [ ] `deleteProduct()` → `.from('products').delete().eq('id', id)`
   - [ ] `getUserById()` → `.from('profiles').select('*').eq('id', id)`
   - [ ] `findUserByEmail()` → `.from('profiles').select('*').eq('email', email)`
   - [ ] `createUser()` → `.from('profiles').insert([user])`
   - [ ] `createOrder()` → `.from('orders').insert([order])`
   - [ ] `loginUser()` → `supabase.auth.signInWithPassword()`
   - [ ] `logoutUser()` → `supabase.auth.signOut()`
   - [ ] `getSession()` → `supabase.auth.getUser()`

### Supabase Tables to Create

```sql
-- profiles (maps to users)
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  department TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'seller')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'verified', 'banned')) NOT NULL DEFAULT 'verified',
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- products
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  seller_id TEXT REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price > 0),
  category TEXT CHECK (category IN ('Fashion','Food','Textbooks','Electronics','Services')) NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] NOT NULL,
  status TEXT CHECK (status IN ('pending','approved','rejected')) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- orders
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  buyer_name TEXT NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS Policies (Row Level Security)

```sql
-- Anyone can read approved products
CREATE POLICY "Public read approved products" ON products
  FOR SELECT USING (status = 'approved');

-- Sellers can read their own products
CREATE POLICY "Sellers read own products" ON products
  FOR SELECT USING (seller_id = auth.uid()::text);

-- Sellers can insert their own products
CREATE POLICY "Sellers insert own products" ON products
  FOR INSERT WITH CHECK (seller_id = auth.uid()::text);

-- Sellers can update their own products
CREATE POLICY "Sellers update own products" ON products
  FOR UPDATE USING (seller_id = auth.uid()::text);

-- Sellers can delete their own products
CREATE POLICY "Sellers delete own products" ON products
  FOR DELETE USING (seller_id = auth.uid()::text);

-- Anyone can read verified profiles
CREATE POLICY "Public read profiles" ON profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid()::text);

-- Anyone can create orders
CREATE POLICY "Anyone create orders" ON orders
  FOR INSERT WITH CHECK (true);
```

## File Structure

```
src/
├── App.tsx              # Main app with routing + Vercel Analytics
├── main.tsx             # React entry point
├── index.css            # Tailwind + custom styles
├── config.ts            # Site settings (WhatsApp number, categories)
├── supabase-config.ts   # Supabase connection (flip USE_SUPABASE here)
├── data.ts              # Seed data (12 users, 30 products, 8 orders)
├── db.ts                # DATA ACCESS LAYER (only file touching localStorage)
├── cartEvents.ts        # Cart change event system
├── components/
│   ├── Header.tsx       # Sticky header with search, cart counter, auth
│   ├── Footer.tsx       # Site footer with links and trust info
│   ├── ProductModal.tsx # Product detail modal with image gallery
│   ├── Directory.tsx    # Verified sellers directory with WhatsApp contact
│   └── Toast.tsx        # Toast notification system
└── pages/
    ├── Home.tsx         # Marketplace home with hero, categories, grid
    ├── Cart.tsx         # Shopping cart with WhatsApp checkout
    ├── Login.tsx        # Auth page (student/seller, login/signup)
    ├── SellerDashboard.tsx # Protected seller product management
    └── NotFound.tsx     # 404 page
```

## Real Verified Sellers

The marketplace features 4 real verified sellers:

1. **Vector Codes** (Web Development)
   - WhatsApp: 2347084547988
   - Services: Standard websites, landing pages

2. **Egbeike Precious Chukwuebuka** (Fashion)
   - WhatsApp: 2349047587912
   - Products: Kaftans, Scrubs, Shirts, Trousers

3. **Uchechukwu Divine Chidiamara** (Beauty)
   - WhatsApp: 2347013519900
   - Products: Oil perfumes, nail tech services

4. **Udo Favour Chinoyeremu** (Fashion)
   - WhatsApp: 2347064580909
   - Products: Women's wear, shoes, bags, men's wear, jewelry

The **Directory Section** on the home page showcases these sellers with direct WhatsApp contact buttons.

## Demo Accounts

- **Student**: Sign up with any email, or use `chinedu@student.absu.edu.ng`
- **Seller (verified)**: Type `seller1` as username on login page (logs in as Vector Codes)
- **Other sellers**: Use their emails from the seller list above

## License

Built for ABSU students. © 2024 ABSU Marketplace.
