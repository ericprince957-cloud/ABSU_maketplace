# ABSU Marketplace - Project Summary & Admin Panel Handoff

## 📋 Project Overview

**ABSU Marketplace** is a peer-to-peer marketplace for Abia State University (ABSU) students. It consists of two separate applications that share the same data source:

1. **Marketplace App** (✅ Complete) - For students to browse products and sellers
2. **Admin Dashboard** (🔨 To Be Built) - For platform admins to manage sellers, products, and orders

Both apps run side-by-side on the same origin and share localStorage keys during the mock stage. They will connect to a single Supabase database at launch.

---

## 🛠️ Tech Stack

### Marketplace App (Current)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router (HashRouter)
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics
- **State Management**: localStorage (mock mode) → Supabase (production)

### Admin Dashboard (To Be Built)
- Should use the same tech stack for consistency
- Must share the same data contract (see below)

---

## 📁 File Structure

```
absu-platform/
├── absu-marketplace-pro/          ← ✅ Complete
│   ├── src/
│   │   ├── App.tsx                # Main app with routing
│   │   ├── main.tsx               # React entry point
│   │   ├── index.css              # Tailwind + custom styles
│   │   ├── config.ts              # Site settings (WhatsApp, categories)
│   │   ├── supabase-config.ts     # Supabase connection (flip USE_SUPABASE here)
│   │   ├── data.ts                # Seed data (6 users, 0 products, 0 orders)
│   │   ├── db.ts                  # DATA ACCESS LAYER (only file touching localStorage)
│   │   ├── auth.ts                # Auth utilities (Supabase-ready)
│   │   ├── cartEvents.ts          # Cart change event system
│   │   ├── components/
│   │   │   ├── Header.tsx         # Sticky header with search, cart counter, auth
│   │   │   ├── Footer.tsx         # Site footer
│   │   │   ├── ProductModal.tsx   # Product detail modal
│   │   │   ├── Directory.tsx      # Verified sellers directory
│   │   │   ├── AuthLayout.tsx     # Shared auth page layout
│   │   │   └── Toast.tsx          # Toast notification system
│   │   └── pages/
│   │       ├── Home.tsx           # Marketplace home
│   │       ├── Cart.tsx           # Shopping cart with WhatsApp checkout
│   │       ├── Login.tsx          # Login page
│   │       ├── Signup.tsx         # Signup page
│   │       ├── SellerDashboard.tsx # Seller product management
│   │       └── NotFound.tsx       # 404 page
│   └── README.md
│
└── absu-admin-dashboard/          ← 🔨 To Be Built
    ├── src/
    │   ├── App.tsx
    │   ├── config.ts              # Same as marketplace
    │   ├── supabase-config.ts     # Same as marketplace
    │   ├── data.ts                # Same seed data as marketplace
    │   ├── db.ts                  # Same data access layer as marketplace
    │   ├── auth.ts                # Admin auth utilities
    │   └── pages/
    │       ├── Dashboard.tsx      # Overview stats
    │       ├── Sellers.tsx        # Manage sellers (verify, ban, etc.)
    │       ├── Products.tsx       # Manage products (approve, reject, delete)
    │       ├── Orders.tsx         # View order history
    │       └── Login.tsx          # Admin login
    └── README.md
```

---

## 🔑 SHARED DATA CONTRACT (CRITICAL FOR ADMIN PANEL)

### LocalStorage Keys (Exact Names - Both Apps Must Use These)

```javascript
absu_users        // Array of user objects
absu_products     // Array of product objects
absu_orders       // Array of order objects
absu_session      // Currently logged-in user (marketplace only)
absu_cart         // Cart items (marketplace only)
absu_admin_auth   // "true" when admin is logged in (admin only)
absu_data_version // Data version for reset tracking (current: "2.0")
```

### Data Shapes (Must Match Exactly in Both Apps)

#### Users (Supabase table: `profiles`)
```typescript
interface User {
  id: string;              // e.g., "u_001"
  name: string;            // Full name
  email: string;           // Email address
  phone: string;           // Digits only, international format: "2348012345678"
  department: string;      // ABSU department
  role: "student" | "seller";
  status: "pending" | "verified" | "banned";
  category?: string;       // Seller's main category (sellers only)
  created_at: string;      // ISO date string
}
```

#### Products (Supabase table: `products`)
```typescript
interface Product {
  id: string;              // e.g., "p_001"
  seller_id: string;       // References users.id
  name: string;            // Product name
  price: number;           // Price in Naira
  category: "Fashion" | "Food" | "Textbooks" | "Electronics" | "Services" | "Web Development" | "Beauty";
  description: string;     // Full description
  images: string[];        // Array of image URLs (1-4 images)
  status: "pending" | "approved" | "rejected";
  created_at: string;      // ISO date string
}
```

#### Orders (Supabase table: `orders`)
```typescript
interface Order {
  id: string;              // e.g., "o_001"
  buyer_name: string;      // Customer name
  items: OrderItem[];      // Array of ordered items
  total: number;           // Grand total in Naira
  created_at: string;      // ISO date string
}

interface OrderItem {
  product_id: string;      // References products.id
  name: string;            // Product name (snapshot at order time)
  price: number;           // Price at order time
  qty: number;             // Quantity ordered
  seller_id: string;       // References users.id (seller)
}
```

---

## 👁️ VISIBILITY RULE (CRITICAL - Both Apps Must Respect)

The marketplace shows a product **ONLY IF**:
```javascript
product.status === "approved"  AND  seller.status !== "banned"
```

**Key Points:**
- New products created by sellers ALWAYS start as `status: "pending"`
- Admin must approve products before they appear in marketplace
- Banning a seller NEVER deletes them; it sets `status: "banned"`
- Banned sellers' products are hidden from marketplace
- Verified badge shows ONLY if `seller.status === "verified"`

---

## 🔐 Authentication Flow

### Marketplace App
- Students: `status: "verified"` immediately after signup
- Sellers: `status: "pending"` after signup, admin must verify
- Login: Email + password (mock: any password works, email must exist)
- Demo shortcut: Type `seller1` to login as first verified seller
- Session stored in `absu_session` localStorage key

### Admin Dashboard (To Be Built)
- Separate admin login (not in `absu_users`)
- Admin credentials stored in `absu_admin_auth` localStorage key
- Should have hardcoded admin emails or separate admin table in Supabase

---

## 📊 Current Seed Data

### Users (6 total)
- **2 Students**: Always verified
  - Chinedu Okafor (Computer Science)
  - Amara Eze (Mass Communication)

- **4 Verified Sellers** (Real sellers with WhatsApp):
  1. **Vector Codes** - Web Development - WhatsApp: 2347084547988
  2. **Egbeike Precious Chukwuebuka** - Fashion - WhatsApp: 2349047587912
  3. **Uchechukwu Divine Chidiamara** - Beauty - WhatsApp: 2347013519900
  4. **Udo Favour Chinoyeremu** - Fashion - WhatsApp: 2347064580909

### Products
- **Currently Empty** - Sellers add products through their dashboard
- Products start as "pending" and need admin approval

### Orders
- **Currently Empty** - Orders created when customers checkout via WhatsApp

---

## 🎯 Admin Panel Requirements

### Core Features Needed

#### 1. **Dashboard Overview**
- Total users (students, sellers)
- Seller status breakdown (pending, verified, banned)
- Product status breakdown (pending, approved, rejected)
- Total orders and revenue
- Recent activity feed

#### 2. **Seller Management**
- View all sellers with status badges
- **Verify** pending sellers (changes status from "pending" to "verified")
- **Ban** sellers (changes status to "banned", hides their products)
- **Unban** sellers (changes status back to "verified")
- View seller's products
- View seller's order history
- Edit seller details (name, email, phone, category)
- Delete seller (with confirmation)

#### 3. **Product Management**
- View all products with filters (by status, category, seller)
- **Approve** pending products (changes status to "approved", makes visible)
- **Reject** pending products (changes status to "rejected", with reason)
- **Unapprove** products (change back to "pending" for re-review)
- View product details (images, description, seller info)
- Delete products (with confirmation)
- Bulk approve/reject (optional)

#### 4. **Order Management**
- View all orders with filters (by date, seller, buyer)
- View order details (items, buyer info, total)
- Mark orders as completed/cancelled (optional)
- Export orders to CSV (optional)

#### 5. **Analytics** (Optional)
- Sales by category
- Top sellers
- Order trends
- Revenue charts

### Admin Panel Pages Structure

```
Admin Dashboard
├── /login                    # Admin login
├── /dashboard                # Overview stats
├── /sellers                  # Manage sellers
│   ├── /sellers/:id          # Seller details
│   └── /sellers/:id/products # Seller's products
├── /products                 # Manage products
│   ├── /products/pending     # Pending approval
│   ├── /products/approved    # Live products
│   └── /products/rejected    # Rejected products
└── /orders                   # View orders
```

### Admin Panel Data Access Layer

**Must have these functions** (same as marketplace `db.ts`):
```typescript
// Users
getUserById(id: string): Promise<User | null>
getAllUsers(): Promise<User[]>
getUsersByRole(role: 'student' | 'seller'): Promise<User[]>
updateUser(id: string, changes: Partial<User>): Promise<User | null>
deleteUser(id: string): Promise<boolean>

// Products
getProductById(id: string): Promise<Product | null>
getAllProducts(): Promise<Product[]>
getProductsByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Product[]>
getProductsBySeller(sellerId: string): Promise<Product[]>
updateProduct(id: string, changes: Partial<Product>): Promise<Product | null>
deleteProduct(id: string): Promise<boolean>

// Orders
getOrderById(id: string): Promise<Order | null>
getAllOrders(): Promise<Order[]>
getOrdersBySeller(sellerId: string): Promise<Order[]>
getOrdersByBuyer(buyerName: string): Promise<Order[]>

// Stats
getStats(): Promise<{
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  pendingSellers: number;
  pendingProducts: number;
  totalRevenue: number;
}>
```

---

## 🔌 Supabase Migration Guide

### Step 1: Update Config (Both Apps)
```typescript
// src/supabase-config.ts
export const SUPABASE_URL = "https://your-project.supabase.co";
export const SUPABASE_ANON_KEY = "your-anon-key";
export const USE_SUPABASE = true; // ← Flip to true
```

### Step 2: Database Schema
```sql
-- Profiles (users)
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

-- Products
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  seller_id TEXT REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price > 0),
  category TEXT CHECK (category IN ('Fashion','Food','Textbooks','Electronics','Services','Web Development','Beauty')) NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] NOT NULL,
  status TEXT CHECK (status IN ('pending','approved','rejected')) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  buyer_name TEXT NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Step 3: RLS Policies
```sql
-- Public read approved products
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

-- Anyone can read profiles
CREATE POLICY "Public read profiles" ON profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid()::text);

-- Anyone can create orders
CREATE POLICY "Anyone create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Admin can do everything (use service_role key in admin backend)
```

### Step 4: Update db.ts Functions
Each function in `db.ts` has a `// SUPABASE SWAP:` comment with the exact Supabase call. Just uncomment and replace the mock code.

---

## 🎨 Design System

### Colors
- **Primary**: `#F68B1E` (Orange)
- **Secondary**: `#1E3A8A` (Blue)
- **Success**: `#16a34a` (Green)
- **Danger**: `#dc2626` (Red)
- **Background**: `#F5F5F5` (Light Gray)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, 700-800 weight
- **Body**: Regular, 400 weight

### Components
- **Buttons**: Rounded-xl, py-3, font-semibold
- **Cards**: Rounded-xl, shadow-sm, border border-gray-100
- **Inputs**: Rounded-xl, py-3, border-gray-200, focus:ring-2 focus:ring-primary/20
- **Badges**: Rounded-full, px-2 py-0.5, text-xs font-medium

---

## 📱 Responsive Design

- **Mobile-first**: Designed for 360px phones
- **Breakpoints**: 
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Touch targets**: Minimum 44px
- **Grid**: Responsive (1-2 columns mobile, 3-4 columns desktop)

---

## 🔒 Security Notes

1. **Never expose service_role key** in frontend
2. **Use RLS policies** in Supabase
3. **Validate on both client and server**
4. **Hash passwords** (Supabase does this automatically)
5. **Use HTTPS** in production
6. **Implement rate limiting** (Supabase does this)
7. **Admin panel should use service_role** in a backend API, not in frontend

---

## 🚀 Deployment

### Marketplace App
```bash
npm install
npm run build
# Deploy dist/ folder to Vercel, Netlify, or any static host
```

### Admin Dashboard
```bash
npm install
npm run build
# Deploy dist/ folder to same domain or subdomain
```

### Environment Variables (Supabase)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📞 Contact & Support

### Real Sellers (WhatsApp)
1. **Vector Codes** (Web Development) - 2347084547988
2. **Egbeike Precious** (Fashion) - 2349047587912
3. **Uchechukwu Divine** (Beauty) - 2347013519900
4. **Udo Favour** (Fashion) - 2347064580909

### Platform Owner WhatsApp
Update in `src/config.ts`:
```typescript
export const WHATSAPP_NUMBER = "234XXXXXXXXXX"; // ← Your number
```

---

## ✅ Checklist for Admin Panel Developer

- [ ] Read this entire document
- [ ] Review marketplace app code structure
- [ ] Understand the shared data contract
- [ ] Set up admin dashboard project with same tech stack
- [ ] Copy `data.ts`, `db.ts`, `config.ts`, `supabase-config.ts` from marketplace
- [ ] Build admin login page
- [ ] Build dashboard overview page
- [ ] Build seller management page (verify, ban, unban)
- [ ] Build product management page (approve, reject, delete)
- [ ] Build order management page
- [ ] Test with marketplace app (both apps share localStorage)
- [ ] Connect to Supabase when ready
- [ ] Deploy both apps

---

## 📝 Important Notes

1. **Both apps must use the exact same localStorage keys and data shapes**
2. **Visibility rule is critical**: Only approved products from non-banned sellers show
3. **New products start as "pending"** - admin must approve
4. **New sellers start as "pending"** - admin must verify
5. **Banning a seller hides their products** but doesn't delete them
6. **Products and orders are currently empty** - sellers add products through their dashboard
7. **Auth is mocked** - will switch to Supabase auth at launch
8. **Data version tracking** - increment `DATA_VERSION` in `db.ts` to force reset

---

## 🎯 Next Steps

1. **Hand this document to the admin panel developer**
2. **They should build the admin dashboard following the requirements above**
3. **Test both apps together** (marketplace + admin) to ensure data syncs correctly
4. **Connect to Supabase** when both apps are ready
5. **Deploy to production**

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Marketplace Status**: ✅ Complete  
**Admin Dashboard Status**: 🔨 To Be Built
