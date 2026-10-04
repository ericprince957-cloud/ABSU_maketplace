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

// Products from the real sellers
export const seedProducts: Product[] = [
  // Vector Codes - Web Development
  {
    id: "p_001",
    seller_id: "u_003",
    name: "Standard Website Development",
    price: 50000,
    category: "Web Development",
    description: "Professional website development for businesses, portfolios, and projects. Responsive design, modern UI, and fast delivery. Contact via WhatsApp for custom quotes.",
    images: ["https://picsum.photos/seed/webdev1/600/600"],
    status: "approved",
    created_at: "2024-08-20T10:00:00.000Z"
  },
  {
    id: "p_002",
    seller_id: "u_003",
    name: "Landing Page Design",
    price: 25000,
    category: "Web Development",
    description: "Beautiful, conversion-optimized landing pages for your business or product. Mobile-first design with modern aesthetics.",
    images: ["https://picsum.photos/seed/landing1/600/600"],
    status: "approved",
    created_at: "2024-08-21T11:00:00.000Z"
  },

  // Egbeike Precious - Fashion (Kaftans, Scrubs, Shirts, Trousers)
  {
    id: "p_003",
    seller_id: "u_004",
    name: "Premium Kaftan Set",
    price: 15000,
    category: "Fashion",
    description: "High-quality kaftan set perfect for ABSU students. Comfortable fabric, stylish design. Available in multiple colors and sizes. Custom tailoring available.",
    images: ["https://picsum.photos/seed/kaftan1/600/600"],
    status: "approved",
    created_at: "2024-08-22T10:00:00.000Z"
  },
  {
    id: "p_004",
    seller_id: "u_004",
    name: "Medical Scrubs Set",
    price: 12000,
    category: "Fashion",
    description: "Professional medical scrubs for nursing and medical students. Durable fabric, comfortable fit. Available in various colors. Campus delivery available.",
    images: ["https://picsum.photos/seed/scrubs1/600/600"],
    status: "approved",
    created_at: "2024-08-23T11:00:00.000Z"
  },
  {
    id: "p_005",
    seller_id: "u_004",
    name: "Classic Oxford Shirt",
    price: 8500,
    category: "Fashion",
    description: "Quality Oxford shirts perfect for lectures and presentations. Crisp fabric, tailored fit. Multiple colors available.",
    images: ["https://picsum.photos/seed/shirt1/600/600"],
    status: "approved",
    created_at: "2024-08-24T12:00:00.000Z"
  },
  {
    id: "p_006",
    seller_id: "u_004",
    name: "Formal Trousers",
    price: 10000,
    category: "Fashion",
    description: "Well-tailored formal trousers for students. Comfortable fit, quality material. Perfect for presentations and formal events.",
    images: ["https://picsum.photos/seed/trousers1/600/600"],
    status: "approved",
    created_at: "2024-08-25T13:00:00.000Z"
  },

  // Uchechukwu Divine - Beauty (Oil perfumes, nail tech)
  {
    id: "p_007",
    seller_id: "u_005",
    name: "Luxury Oil Perfume (10ml)",
    price: 5000,
    category: "Beauty",
    description: "Long-lasting oil perfumes inspired by designer fragrances. Smooth application, non-irritating. Multiple scents available. Smell amazing on campus!",
    images: ["https://picsum.photos/seed/perfume1/600/600"],
    status: "approved",
    created_at: "2024-08-26T10:00:00.000Z"
  },
  {
    id: "p_008",
    seller_id: "u_005",
    name: "Oil Perfume Bundle (3x10ml)",
    price: 12000,
    category: "Beauty",
    description: "Bundle of 3 luxury oil perfumes. Mix and match your favorite scents. Perfect gift for yourself or a friend.",
    images: ["https://picsum.photos/seed/perfumebundle1/600/600"],
    status: "approved",
    created_at: "2024-08-27T11:00:00.000Z"
  },
  {
    id: "p_009",
    seller_id: "u_005",
    name: "Professional Nail Tech Service",
    price: 8000,
    category: "Beauty",
    description: "Professional nail art and manicure service. Gel nails, acrylics, nail art designs. Book your appointment via WhatsApp. Campus visits available.",
    images: ["https://picsum.photos/seed/nails1/600/600"],
    status: "approved",
    created_at: "2024-08-28T12:00:00.000Z"
  },
  {
    id: "p_010",
    seller_id: "u_005",
    name: "Gel Nail Polish Set",
    price: 6500,
    category: "Beauty",
    description: "DIY gel nail polish set with UV lamp. Professional quality, long-lasting shine. Includes base coat, top coat, and 6 colors.",
    images: ["https://picsum.photos/seed/gelpolish1/600/600"],
    status: "approved",
    created_at: "2024-08-29T13:00:00.000Z"
  },

  // Udo Favour - Fashion (Women's wear, shoes, bags, men's wear, jewelry)
  {
    id: "p_011",
    seller_id: "u_006",
    name: "Ankara Dress",
    price: 12000,
    category: "Fashion",
    description: "Beautiful Ankara print dress, perfect for events and casual outings. High-quality African wax print fabric. Available in sizes S-XL.",
    images: ["https://picsum.photos/seed/ankara2/600/600"],
    status: "approved",
    created_at: "2024-08-30T10:00:00.000Z"
  },
  {
    id: "p_012",
    seller_id: "u_006",
    name: "Ladies Handbag",
    price: 15000,
    category: "Fashion",
    description: "Stylish ladies handbag with multiple compartments. Quality material, durable zipper. Perfect for campus and events.",
    images: ["https://picsum.photos/seed/handbag1/600/600"],
    status: "approved",
    created_at: "2024-09-01T11:00:00.000Z"
  },
  {
    id: "p_013",
    seller_id: "u_006",
    name: "Women's Heels",
    price: 18000,
    category: "Fashion",
    description: "Elegant women's heels, comfortable for all-day wear. Quality material, non-slip sole. Available in multiple colors and sizes 36-42.",
    images: ["https://picsum.photos/seed/heels1/600/600"],
    status: "approved",
    created_at: "2024-09-02T12:00:00.000Z"
  },
  {
    id: "p_014",
    seller_id: "u_006",
    name: "Men's Casual Shoes",
    price: 14000,
    category: "Fashion",
    description: "Comfortable men's casual shoes for everyday wear. Durable sole, breathable material. Sizes 40-45 available.",
    images: ["https://picsum.photos/seed/menshoes1/600/600"],
    status: "approved",
    created_at: "2024-09-03T13:00:00.000Z"
  },
  {
    id: "p_015",
    seller_id: "u_006",
    name: "Statement Jewelry Set",
    price: 8000,
    category: "Fashion",
    description: "Beautiful jewelry set including necklace, earrings, and bracelet. Perfect for events and special occasions. Hypoallergenic materials.",
    images: ["https://picsum.photos/seed/jewelry1/600/600"],
    status: "approved",
    created_at: "2024-09-04T14:00:00.000Z"
  },
  {
    id: "p_016",
    seller_id: "u_006",
    name: "Men's Polo Shirt",
    price: 7500,
    category: "Fashion",
    description: "Quality polo shirts for men. Comfortable cotton blend, classic fit. Multiple colors available. Sizes M-XXL.",
    images: ["https://picsum.photos/seed/polo1/600/600"],
    status: "approved",
    created_at: "2024-09-05T15:00:00.000Z"
  },
];

// 4 orders
export const seedOrders: Order[] = [
  {
    id: "o_001",
    buyer_name: "Chinedu Okafor",
    items: [
      { product_id: "p_003", name: "Premium Kaftan Set", price: 15000, qty: 1, seller_id: "u_004" },
      { product_id: "p_007", name: "Luxury Oil Perfume (10ml)", price: 5000, qty: 2, seller_id: "u_005" }
    ],
    total: 25000,
    created_at: "2024-09-05T10:00:00.000Z"
  },
  {
    id: "o_002",
    buyer_name: "Amara Eze",
    items: [
      { product_id: "p_011", name: "Ankara Dress", price: 12000, qty: 1, seller_id: "u_006" }
    ],
    total: 12000,
    created_at: "2024-09-06T11:00:00.000Z"
  },
  {
    id: "o_003",
    buyer_name: "Chinedu Okafor",
    items: [
      { product_id: "p_001", name: "Standard Website Development", price: 50000, qty: 1, seller_id: "u_003" }
    ],
    total: 50000,
    created_at: "2024-09-07T12:00:00.000Z"
  },
  {
    id: "o_004",
    buyer_name: "Amara Eze",
    items: [
      { product_id: "p_009", name: "Professional Nail Tech Service", price: 8000, qty: 1, seller_id: "u_005" },
      { product_id: "p_015", name: "Statement Jewelry Set", price: 8000, qty: 1, seller_id: "u_006" }
    ],
    total: 16000,
    created_at: "2024-09-08T13:00:00.000Z"
  }
];
