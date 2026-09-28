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
  category: "Fashion" | "Food" | "Textbooks" | "Electronics" | "Services";
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

// 12 users: 2 students, 10 sellers (4 verified, 4 pending, 2 banned)
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
  // Verified Sellers (4)
  {
    id: "u_003",
    name: "Emeka Nwosu",
    email: "emeka.nwosu@gmail.com",
    phone: "2348034567890",
    department: "Engineering",
    role: "seller",
    status: "verified",
    category: "Electronics",
    created_at: "2024-08-15T10:00:00.000Z"
  },
  {
    id: "u_004",
    name: "Fatima Bello",
    email: "fatima.bello@gmail.com",
    phone: "2348045678901",
    department: "Business Administration",
    role: "seller",
    status: "verified",
    category: "Fashion",
    created_at: "2024-08-16T11:00:00.000Z"
  },
  {
    id: "u_005",
    name: "Tunde Adeyemi",
    email: "tunde.adeyemi@gmail.com",
    phone: "2348056789012",
    department: "Food Science",
    role: "seller",
    status: "verified",
    category: "Food",
    created_at: "2024-08-17T12:00:00.000Z"
  },
  {
    id: "u_006",
    name: "Ngozi Igwe",
    email: "ngozi.igwe@gmail.com",
    phone: "2348067890123",
    department: "Education",
    role: "seller",
    status: "verified",
    category: "Textbooks",
    created_at: "2024-08-18T13:00:00.000Z"
  },
  // Pending Sellers (4)
  {
    id: "u_007",
    name: "Ibrahim Musa",
    email: "ibrahim.musa@gmail.com",
    phone: "2348078901234",
    department: "Computer Science",
    role: "seller",
    status: "pending",
    category: "Electronics",
    created_at: "2024-09-20T14:00:00.000Z"
  },
  {
    id: "u_008",
    name: "Blessing Ogunleye",
    email: "blessing.ogunleye@gmail.com",
    phone: "2348089012345",
    department: "Mass Communication",
    role: "seller",
    status: "pending",
    category: "Fashion",
    created_at: "2024-09-21T15:00:00.000Z"
  },
  {
    id: "u_009",
    name: "David Okonkwo",
    email: "david.okonkwo@gmail.com",
    phone: "2348090123456",
    department: "Accounting",
    role: "seller",
    status: "pending",
    category: "Services",
    created_at: "2024-09-22T16:00:00.000Z"
  },
  {
    id: "u_010",
    name: "Chioma Nwankpa",
    email: "chioma.nwankpa@gmail.com",
    phone: "2348101234567",
    department: "Pharmacy",
    role: "seller",
    status: "pending",
    category: "Food",
    created_at: "2024-09-23T17:00:00.000Z"
  },
  // Banned Sellers (2)
  {
    id: "u_011",
    name: "Kenneth Udo",
    email: "kenneth.udo@gmail.com",
    phone: "2348112345678",
    department: "Political Science",
    role: "seller",
    status: "banned",
    category: "Electronics",
    created_at: "2024-07-10T08:00:00.000Z"
  },
  {
    id: "u_012",
    name: "Grace Akpan",
    email: "grace.akpan@gmail.com",
    phone: "2348123456789",
    department: "Sociology",
    role: "seller",
    status: "banned",
    category: "Fashion",
    created_at: "2024-07-12T09:00:00.000Z"
  }
];

// 30 products across 5 categories (~18 approved, ~8 pending, ~4 rejected)
export const seedProducts: Product[] = [
  // FASHION (6 products)
  { id: "p_001", seller_id: "u_004", name: "Ankara Print Jumpsuit", price: 15000, category: "Fashion", description: "Beautiful Ankara print jumpsuit, perfect for casual outings. Made with high-quality African wax print fabric. Available in sizes S-XL. Machine washable.", images: ["https://picsum.photos/seed/ankara1/600/600"], status: "approved", created_at: "2024-08-20T10:00:00.000Z" },
  { id: "p_002", seller_id: "u_004", name: "Custom ABSU Hoodie", price: 12500, category: "Fashion", description: "Premium quality hoodie with ABSU logo embroidered on the chest. 100% cotton, comfortable fit. Available in black, navy, and maroon.", images: ["https://picsum.photos/seed/hoodie1/600/600"], status: "approved", created_at: "2024-08-21T11:00:00.000Z" },
  { id: "p_003", seller_id: "u_008", name: "Handmade Beaded Necklace", price: 5500, category: "Fashion", description: "Elegant handcrafted beaded necklace with traditional Igbo patterns. Perfect accessory for traditional events or casual wear.", images: ["https://picsum.photos/seed/beads1/600/600"], status: "pending", created_at: "2024-09-25T12:00:00.000Z" },
  { id: "p_004", seller_id: "u_012", name: "Vintage Denim Jacket", price: 18000, category: "Fashion", description: "Classic vintage denim jacket in excellent condition. Unisex fit, perfect for the rainy season.", images: ["https://picsum.photos/seed/denim1/600/600"], status: "rejected", created_at: "2024-07-15T13:00:00.000Z" },
  { id: "p_005", seller_id: "u_004", name: "Leather Sandals - Unisex", price: 8000, category: "Fashion", description: "Handcrafted leather sandals, comfortable for daily wear. Durable sole, adjustable straps. Sizes 38-45.", images: ["https://picsum.photos/seed/sandals1/600/600"], status: "approved", created_at: "2024-08-22T14:00:00.000Z" },
  { id: "p_006", seller_id: "u_008", name: "Tie-Dye T-Shirt", price: 4500, category: "Fashion", description: "Unique tie-dye t-shirt, each piece is one-of-a-kind. 100% cotton, pre-shrunk. Sizes M-XXL.", images: ["https://picsum.photos/seed/tiedye1/600/600"], status: "pending", created_at: "2024-09-26T15:00:00.000Z" },

  // FOOD (6 products)
  { id: "p_007", seller_id: "u_005", name: "Homemade Jollof Rice (Family Pack)", price: 5000, category: "Food", description: "Delicious homemade Jollof rice, serves 4-6 people. Made with fresh tomatoes, peppers, and premium rice. Available for campus delivery.", images: ["https://picsum.photos/seed/jollof1/600/600"], status: "approved", created_at: "2024-08-23T10:00:00.000Z" },
  { id: "p_008", seller_id: "u_005", name: "Fresh Fruit Salad Bowl", price: 3000, category: "Food", description: "Fresh seasonal fruits cut and packed in a convenient bowl. Includes watermelon, pineapple, mango, and grapes. Perfect study snack!", images: ["https://picsum.photos/seed/fruitsalad1/600/600"], status: "approved", created_at: "2024-08-24T11:00:00.000Z" },
  { id: "p_009", seller_id: "u_010", name: "Chin Chin (500g Pack)", price: 2500, category: "Food", description: "Crunchy, sweet chin chin made fresh daily. Perfect for snacking while studying. Sealed pack keeps fresh for 2 weeks.", images: ["https://picsum.photos/seed/chinchin1/600/600"], status: "pending", created_at: "2024-09-27T12:00:00.000Z" },
  { id: "p_010", seller_id: "u_005", name: "Grilled Suya Stick (10 pieces)", price: 4000, category: "Food", description: "Spicy grilled suya made with premium beef. Seasoned with our special yaji spice blend. Order by 4pm for same-day delivery.", images: ["https://picsum.photos/seed/suya1/600/600"], status: "approved", created_at: "2024-08-25T13:00:00.000Z" },
  { id: "p_011", seller_id: "u_010", name: "Smoothie Pack (5 packs)", price: 3500, category: "Food", description: "Pre-portioned smoothie ingredients. Just blend with yogurt or milk. Flavors: strawberry-banana, mango-ginger, green detox.", images: ["https://picsum.photos/seed/smoothie1/600/600"], status: "pending", created_at: "2024-09-28T14:00:00.000Z" },
  { id: "p_012", seller_id: "u_005", name: "Puff Puff (20 pieces)", price: 2000, category: "Food", description: "Soft, fluffy puff puff made fresh to order. Perfect for sharing with roommates. Available with chocolate or vanilla dip.", images: ["https://picsum.photos/seed/puffpuff1/600/600"], status: "approved", created_at: "2024-08-26T15:00:00.000Z" },

  // TEXTBOOKS (6 products)
  { id: "p_013", seller_id: "u_006", name: "CSC 201: Intro to Programming (2nd Hand)", price: 3500, category: "Textbooks", description: "Used textbook for CSC 201. Good condition, minimal highlighting. Covers Python, Java basics, and data structures.", images: ["https://picsum.photos/seed/cscbook1/600/600"], status: "approved", created_at: "2024-08-27T10:00:00.000Z" },
  { id: "p_014", seller_id: "u_006", name: "MTH 111: Calculus I (Latest Edition)", price: 4500, category: "Textbooks", description: "Brand new calculus textbook. Latest edition with practice problems and solutions. Essential for 100-level science students.", images: ["https://picsum.photos/seed/calculus1/600/600"], status: "approved", created_at: "2024-08-28T11:00:00.000Z" },
  { id: "p_015", seller_id: "u_006", name: "ENG 101: Use of English", price: 2500, category: "Textbooks", description: "Comprehensive guide to English usage for university students. Covers grammar, comprehension, and essay writing techniques.", images: ["https://picsum.photos/seed/engbook1/600/600"], status: "approved", created_at: "2024-08-29T12:00:00.000Z" },
  { id: "p_016", seller_id: "u_009", name: "ACC 201: Financial Accounting", price: 5000, category: "Textbooks", description: "Complete financial accounting textbook with worked examples. Covers journal entries, ledgers, trial balance, and financial statements.", images: ["https://picsum.photos/seed/accbook1/600/600"], status: "pending", created_at: "2024-09-29T13:00:00.000Z" },
  { id: "p_017", seller_id: "u_006", name: "BIO 101: General Biology", price: 3000, category: "Textbooks", description: "Introduction to biology covering cell structure, genetics, ecology, and evolution. Required for all science faculty students.", images: ["https://picsum.photos/seed/biobook1/600/600"], status: "approved", created_at: "2024-08-30T14:00:00.000Z" },
  { id: "p_018", seller_id: "u_009", name: "ECO 301: Microeconomics", price: 4000, category: "Textbooks", description: "Advanced microeconomics text. Covers market structures, game theory, and welfare economics. Good condition with some notes.", images: ["https://picsum.photos/seed/ecobook1/600/600"], status: "rejected", created_at: "2024-09-30T15:00:00.000Z" },

  // ELECTRONICS (6 products)
  { id: "p_019", seller_id: "u_003", name: "Wireless Earbuds (Bluetooth 5.0)", price: 8500, category: "Electronics", description: "High-quality wireless earbuds with noise cancellation. 24-hour battery life with charging case. Compatible with all devices.", images: ["https://picsum.photos/seed/earbuds1/600/600"], status: "approved", created_at: "2024-08-19T10:00:00.000Z" },
  { id: "p_020", seller_id: "u_003", name: "Power Bank 20000mAh", price: 12000, category: "Electronics", description: "Fast-charging power bank with dual USB output. LED indicator, compact design. Charges phone 4-5 times on full charge.", images: ["https://picsum.photos/seed/powerbank1/600/600"], status: "approved", created_at: "2024-08-20T11:00:00.000Z" },
  { id: "p_021", seller_id: "u_007", name: "USB-C Hub (7-in-1)", price: 9500, category: "Electronics", description: "Multi-port USB-C hub with HDMI, USB 3.0, SD card reader, and ethernet. Perfect for laptop users. Plug and play.", images: ["https://picsum.photos/seed/usbhub1/600/600"], status: "pending", created_at: "2024-10-01T12:00:00.000Z" },
  { id: "p_022", seller_id: "u_011", name: "Phone Screen Protector (Pack of 3)", price: 2000, category: "Electronics", description: "Tempered glass screen protectors. 9H hardness, anti-fingerprint coating. Fits most Android phones.", images: ["https://picsum.photos/seed/screenprot1/600/600"], status: "rejected", created_at: "2024-07-20T13:00:00.000Z" },
  { id: "p_023", seller_id: "u_003", name: "Laptop Stand (Adjustable)", price: 7500, category: "Electronics", description: "Ergonomic laptop stand with adjustable height and angle. Aluminum construction, foldable for portability. Fits 11-17 inch laptops.", images: ["https://picsum.photos/seed/laptopstand1/600/600"], status: "approved", created_at: "2024-08-21T14:00:00.000Z" },
  { id: "p_024", seller_id: "u_007", name: "LED Desk Lamp with USB Port", price: 6500, category: "Electronics", description: "Study lamp with adjustable brightness, color temperature control, and built-in USB charging port. Perfect for late-night study sessions.", images: ["https://picsum.photos/seed/desklamp1/600/600"], status: "pending", created_at: "2024-10-02T15:00:00.000Z" },

  // SERVICES (6 products)
  { id: "p_025", seller_id: "u_009", name: "CV/Resume Writing Service", price: 5000, category: "Services", description: "Professional CV writing service. ATS-friendly format, tailored to your industry. Delivery within 48 hours. Includes one round of revisions.", images: ["https://picsum.photos/seed/cvservice1/600/600"], status: "approved", created_at: "2024-09-01T10:00:00.000Z" },
  { id: "p_026", seller_id: "u_009", name: "Tutorial: Data Structures & Algorithms", price: 8000, category: "Services", description: "One-on-one tutoring in DSA. 5 sessions of 1 hour each. Covers arrays, trees, graphs, sorting, and dynamic programming.", images: ["https://picsum.photos/seed/tutoring1/600/600"], status: "approved", created_at: "2024-09-02T11:00:00.000Z" },
  { id: "p_027", seller_id: "u_009", name: "Graphic Design (Flyer/Poster)", price: 3500, category: "Services", description: "Custom flyer or poster design for your event, business, or project. 2 concepts, unlimited revisions. Delivered in print-ready format.", images: ["https://picsum.photos/seed/graphics1/600/600"], status: "approved", created_at: "2024-09-03T12:00:00.000Z" },
  { id: "p_028", seller_id: "u_009", name: "Phone Repair (Screen Replacement)", price: 15000, category: "Services", description: "Professional phone screen replacement. All major brands supported. 30-day warranty on parts and labor. Same-day service available.", images: ["https://picsum.photos/seed/phonerepair1/600/600"], status: "rejected", created_at: "2024-10-03T13:00:00.000Z" },
  { id: "p_029", seller_id: "u_003", name: "Website Development (Basic)", price: 25000, category: "Services", description: "Basic website development for small businesses or personal portfolios. Responsive design, up to 5 pages. Hosting guidance included.", images: ["https://picsum.photos/seed/webdev1/600/600"], status: "approved", created_at: "2024-09-04T14:00:00.000Z" },
  { id: "p_030", seller_id: "u_007", name: "Photography (Event Coverage)", price: 20000, category: "Services", description: "Professional event photography. Up to 4 hours coverage, 100+ edited photos delivered within 5 days. Equipment provided.", images: ["https://picsum.photos/seed/photography1/600/600"], status: "rejected", created_at: "2024-10-04T15:00:00.000Z" },
];

// 8 orders
export const seedOrders: Order[] = [
  {
    id: "o_001",
    buyer_name: "Chinedu Okafor",
    items: [
      { product_id: "p_001", name: "Ankara Print Jumpsuit", price: 15000, qty: 1, seller_id: "u_004" },
      { product_id: "p_007", name: "Homemade Jollof Rice (Family Pack)", price: 5000, qty: 2, seller_id: "u_005" }
    ],
    total: 25000,
    created_at: "2024-09-05T10:00:00.000Z"
  },
  {
    id: "o_002",
    buyer_name: "Amara Eze",
    items: [
      { product_id: "p_013", name: "CSC 201: Intro to Programming (2nd Hand)", price: 3500, qty: 1, seller_id: "u_006" }
    ],
    total: 3500,
    created_at: "2024-09-06T11:00:00.000Z"
  },
  {
    id: "o_003",
    buyer_name: "Chinedu Okafor",
    items: [
      { product_id: "p_019", name: "Wireless Earbuds (Bluetooth 5.0)", price: 8500, qty: 1, seller_id: "u_003" },
      { product_id: "p_020", name: "Power Bank 20000mAh", price: 12000, qty: 1, seller_id: "u_003" }
    ],
    total: 20500,
    created_at: "2024-09-07T12:00:00.000Z"
  },
  {
    id: "o_004",
    buyer_name: "Amara Eze",
    items: [
      { product_id: "p_002", name: "Custom ABSU Hoodie", price: 12500, qty: 1, seller_id: "u_004" },
      { product_id: "p_005", name: "Leather Sandals - Unisex", price: 8000, qty: 1, seller_id: "u_004" }
    ],
    total: 20500,
    created_at: "2024-09-08T13:00:00.000Z"
  },
  {
    id: "o_005",
    buyer_name: "Chinedu Okafor",
    items: [
      { product_id: "p_025", name: "CV/Resume Writing Service", price: 5000, qty: 1, seller_id: "u_009" }
    ],
    total: 5000,
    created_at: "2024-09-09T14:00:00.000Z"
  },
  {
    id: "o_006",
    buyer_name: "Amara Eze",
    items: [
      { product_id: "p_008", name: "Fresh Fruit Salad Bowl", price: 3000, qty: 3, seller_id: "u_005" },
      { product_id: "p_012", name: "Puff Puff (20 pieces)", price: 2000, qty: 2, seller_id: "u_005" }
    ],
    total: 13000,
    created_at: "2024-09-10T15:00:00.000Z"
  },
  {
    id: "o_007",
    buyer_name: "Chinedu Okafor",
    items: [
      { product_id: "p_014", name: "MTH 111: Calculus I (Latest Edition)", price: 4500, qty: 1, seller_id: "u_006" },
      { product_id: "p_015", name: "ENG 101: Use of English", price: 2500, qty: 1, seller_id: "u_006" }
    ],
    total: 7000,
    created_at: "2024-09-11T16:00:00.000Z"
  },
  {
    id: "o_008",
    buyer_name: "Amara Eze",
    items: [
      { product_id: "p_023", name: "Laptop Stand (Adjustable)", price: 7500, qty: 1, seller_id: "u_003" },
      { product_id: "p_026", name: "Tutorial: Data Structures & Algorithms", price: 8000, qty: 1, seller_id: "u_009" }
    ],
    total: 15500,
    created_at: "2024-09-12T17:00:00.000Z"
  }
];
