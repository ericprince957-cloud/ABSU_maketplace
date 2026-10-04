// Seed data for ABSU Marketplace
// This data is IDENTICAL in both apps (marketplace and admin dashboard)
// TODO SUPABASE: This file is only used in mock mode; Supabase seeds separately

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: "student" | "seller";
  status: "pending" | "verified" | "banned";
  category?: string;
  created_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  price: number;
  category: "Fashion" | "Food" | "Textbooks" | "Electronics" | "Services" | "Web Development" | "Beauty";
  description: string;
  images: string[];
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  seller_id: string;
}

export interface Order {
  id: string;
  buyer_name: string;
  items: OrderItem[];
  total: number;
  created_at: string;
}

// 6 users: 2 students, 4 verified sellers (real sellers)
export const seedUsers: User[] = [
  // Students (always verified)
  {
    id: "u_001",
    name: "Chinedu Okafor",
    email: "chinedu@student.absu.edu.ng",
    phone: "2348012345678",
    department: "Computer Science",
    role: "student",
    status: "verified",
    created_at: "2024-09-01T08:00:00.000Z"
  },
  {
    id: "u_002",
    name: "Amara Eze",
    email: "amara@student.absu.edu.ng",
    phone: "2348023456789",
    department: "Mass Communication",
    role: "student",
    status: "verified",
    created_at: "2024-09-02T09:00:00.000Z"
  },
  // Real Verified Sellers (4)
  {
    id: "u_003",
    name: "Vector Codes",
    email: "vectorcodes@gmail.com",
    phone: "2347084547988",
    department: "Computer Science",
    role: "seller",
    status: "verified",
    category: "Web Development",
    created_at: "2024-08-15T10:00:00.000Z"
  },
  {
    id: "u_004",
    name: "Egbeike Precious Chukwuebuka",
    email: "egbeikeprecious@gmail.com",
    phone: "2349047587912",
    department: "Engineering",
    role: "seller",
    status: "verified",
    category: "Fashion",
    created_at: "2024-08-16T11:00:00.000Z"
  },
  {
    id: "u_005",
    name: "Uchechukwu Divine Chidiamara",
    email: "uchechukwudvine@gmail.com",
    phone: "2347013519900",
    department: "Pharmacy",
    role: "seller",
    status: "verified",
    category: "Beauty",
    created_at: "2024-08-17T12:00:00.000Z"
  },
  {
    id: "u_006",
    name: "Udo Favour Chinoyeremu",
    email: "udofavour@gmail.com",
    phone: "2347064580909",
    department: "Public Health",
    role: "seller",
    status: "verified",
    category: "Fashion",
    created_at: "2024-08-18T13:00:00.000Z"
  }
];

// Products - Empty initially, sellers will add products themselves
export const seedProducts: Product[] = [];

// Orders - Empty initially
export const seedOrders: Order[] = [];
