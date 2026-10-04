// Site configuration
// TODO SUPABASE: These settings remain client-side, no changes needed at launch

export const WHATSAPP_NUMBER = "234XXXXXXXXXX"; // <-- CHANGE: the platform owner's WhatsApp number
export const SITE_NAME = "ABSU Marketplace";

export const CATEGORIES = ["Fashion", "Food", "Textbooks", "Electronics", "Services", "Web Development", "Beauty"] as const;
export type Category = typeof CATEGORIES[number];

export const DEPARTMENTS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Economics",
  "Political Science",
  "Accounting",
  "Business Administration",
  "Mass Communication",
  "Law",
  "Medicine",
  "Pharmacy",
  "Engineering",
  "Agriculture",
  "Education",
  "Sociology",
  "History",
  "Geography",
  "Public Health"
] as const;
