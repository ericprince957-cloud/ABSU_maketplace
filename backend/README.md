# ABSU Marketplace — Backend

The backend for [ABSU Marketplace](https://absu-maketplace.vercel.app/) — a trusted peer-to-peer marketplace for Abia State University students. The frontend is a React + Vite app; the backend is a **Supabase (PostgreSQL)** project providing auth, the database, and Row Level Security.

> The app ships with a mock mode (localStorage) for development. The real backend is enabled by flipping one flag (see [Launching](#launching-the-real-backend)).

---

## Architecture

```
Frontend (Vercel)
  └── src/db.ts        ← the ONLY data-access layer
  └── src/auth.ts      ← the ONLY auth layer
        │
        ▼
Supabase (PostgreSQL + Auth + RLS)
  ├── profiles  (users / sellers)
  ├── products  (listings, admin-approved)
  └── orders    (WhatsApp-checkout orders)
```

- **No custom server.** All backend logic lives in the database: constraints, defaults, and RLS policies.
- **One swap point.** Every data function in `src/db.ts` / `src/auth.ts` checks `USE_SUPABASE`: `false` = localStorage mock, `true` = Supabase calls. Pages and components never change.
- **The cart stays client-side** (localStorage) in both modes — checkout sends the order to WhatsApp and saves it to the `orders` table.

---

## Database Schema

### `profiles`
Maps 1:1 to frontend `User`. For signed-up users, `id` equals the `auth.users.id`.

| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | matches `auth.users.id` |
| name | TEXT NOT NULL | |
| email | TEXT UNIQUE NOT NULL | |
| phone | TEXT NOT NULL | WhatsApp number |
| department | TEXT NOT NULL | e.g. Computer Science |
| role | TEXT | `student` / `seller` |
| status | TEXT | `pending` / `verified` / `banned` (default `verified` for students) |
| category | TEXT | seller category (Web Development, Fashion, Beauty, …) |
| created_at | TIMESTAMPTZ | default NOW() |

### `products`
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | uuid by default |
| seller_id | TEXT FK → profiles | ON DELETE CASCADE |
| name | TEXT NOT NULL | |
| price | NUMERIC | CHECK price > 0 |
| category | TEXT | one of 7 categories |
| description | TEXT NOT NULL | |
| images | TEXT[] | at least one URL recommended |
| status | TEXT | `pending` / `approved` / `rejected` — default `pending` |
| created_at | TIMESTAMPTZ | default NOW() |

### `orders`
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | uuid by default |
| buyer_name | TEXT NOT NULL | |
| items | JSONB | `[{ product_id, name, price, qty, seller_id }]` |
| total | NUMERIC | CHECK total >= 0 |
| created_at | TIMESTAMPTZ | default NOW() |

Full DDL: [`backend/schema.sql`](./schema.sql) · Seed data: [`backend/seed.sql`](./seed.sql)

---

## Visibility Rule

The core product rule, enforced **in the database** (not just the UI):

> A product is publicly visible if and only if `status = 'approved'` **AND** its seller's `status != 'banned'`.

The RLS policy `Public read approved products` implements this with a subquery, so even a misbehaving client cannot leak rejected products or banned sellers' listings.

---

## Row Level Security

| Table | Policy | Rule |
|---|---|---|
| profiles | Public read profiles | anyone can SELECT (seller directory) |
| profiles | Users update own profile | `id = auth.uid()` |
| products | Public read approved products | approved + seller not banned |
| products | Sellers read own products | `seller_id = auth.uid()` (any status — dashboard needs pending too) |
| products | Sellers insert own products | own row, **forced to `status='pending'`** |
| products | Sellers update own products | own row only |
| products | Sellers delete own products | own row only |
| orders | Anyone create orders | INSERT allowed for anonymous checkout |
| orders | Owner read orders | `auth.uid()::text = id` |

Note: sellers **cannot** set their own product to `approved` — approval is admin-only and happens through the [admin panel](https://github.com/ericprince957-cloud/ABSU_admin_panel) using the service-role key (server-side only).

---

## Auth Flow

1. **Sign-up** → `supabase.auth.signUp(email, password)` creates the auth user.
2. A `profiles` row is inserted with the auth user's `id`. Students start `verified`; sellers start `pending` until admin verification.
3. **Login** → `signInWithPassword`. Banned users are signed out immediately with an error.
4. **Session** → `supabase.auth.getUser()` + profile lookup.
5. **Password reset** → `resetPasswordForEmail` with redirect to `/#/reset-password`.

The mock mode keeps a demo shortcut: typing `seller1` as the email logs in as the first verified seller. This shortcut does not exist in Supabase mode.

---

## Launching the Real Backend

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run:
   - `backend/schema.sql` (tables, indexes, RLS policies)
   - `backend/seed.sql` (the 4 real verified sellers + 2 demo students)
3. Copy the project **URL** and **anon key** (Settings → API).
4. Add them to the frontend (Vercel → Environment Variables, or paste into `src/supabase-config.ts`):
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
5. Flip the flag in `src/supabase-config.ts`: `export const USE_SUPABASE = true;`
6. Redeploy the frontend.

> ⚠️ **Never** put the `service_role` key in the frontend. It bypasses RLS and is for the admin panel / server-side scripts only.

### Creating the real seller accounts

`seed.sql` inserts profile rows, but those sellers also need auth accounts to log in. For each seller, either:
- enable email sign-ups and have them use 'Forgot password', or
- create the user in Supabase Dashboard → Authentication → Add user with the same email, then update `profiles.id` to match `auth.users.id`.

---

## API Surface (`src/db.ts`)

| Function | Supabase call |
|---|---|
| `getApprovedProducts(search?, category?)` | select with `status='approved'` + seller join, banned filtered |
| `getProductById(id)` | `.from('products').select().eq('id', id)` |
| `getProductsBySeller(id)` | `.from('products').select().eq('seller_id', id)` |
| `addProduct(p)` | insert with `status='pending'`, seller from session |
| `updateProduct(id, changes)` | update (status/seller_id stripped client-side) |
| `deleteProduct(id)` | delete own row |
| `getUserById / findUserByEmail` | profiles lookups |
| `createUser(user)` | insert profile |
| `createOrder(order)` | insert order |
| `loginUser / logoutUser / getSession` | `supabase.auth.*` + profile fetch |

---

## Local Development

```
npm install
npm run dev      # mock mode (localStorage) — no backend needed
```

To develop against a real backend: run `npx supabase start` (local Supabase CLI), apply the SQL files from `backend/`, set the env vars, and flip `USE_SUPABASE`.

## Admin

Product approval, seller verification, and bans are managed in the separate [ABSU_admin_panel](https://github.com/ericprince957-cloud/ABSU_admin_panel), which uses the service-role key and therefore bypasses RLS.

## License

Built for ABSU students. © 2026 ABSU Marketplace.