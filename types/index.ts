export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export type WithTimestamps = {
  createdAt: Date;
  updatedAt: Date;
};

export type UserRole = "user" | "admin";

export interface IUser extends WithTimestamps {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  emailVerified: boolean;
  registered: boolean; // true when user completed initial signup process
  verificationToken?: string | null;
  phone?: string;
  imageUrl?: string;
  addresses?: Array<{
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }>;
  // Keep address for backward compatibility
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export interface IAdministrator extends WithTimestamps {
  _id: string;
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
}

export interface Product extends WithTimestamps {
  _id: string;
  name: string;
  shortDescription?: string; // Brief description
  description: string; // Long description
  category?: string | Category; // Category reference (can be ObjectId string or populated Category object)
  price: number; // Price in rupees/dollars (not cents/paise)
  imageUrl: string[]; // Array of base64 image strings
  videoUrl?: string | string[]; // Base64 video string(s) or URL(s) - supports up to 2 videos
}

export interface Category extends WithTimestamps {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "refunded";

export interface ShippingAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface Order extends WithTimestamps {
  _id: string;
  userId: string;
  items: OrderItem[];
  amount: number;
  currency: string;
  status: OrderStatus;
  paymentProvider?: "razorpay" | "stripe";
  paymentRef?: string;
  shippingAddress?: ShippingAddress;
  customerEmail?: string;
  customerName?: string;
}

export interface CorporateSession extends WithTimestamps {
  _id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  employeeCount: number;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
  sessionName?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  format?: string;
  benefits?: string[];
  status?: string;
}

export interface YogaSession extends WithTimestamps {
  _id: string;
  instructor: string;
  date: string; // ISO date
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  totalSeats: number;
  bookedSeats: number;
  price: number; // smallest unit
  sessionType?: "regular" | "corporate" | "private";
  sessionName?: string;
  duration?: number; // in minutes
  title?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  format?: string;
  benefits?: string[];
}

export interface DiscoverySession extends WithTimestamps {
  _id: string;
  instructorName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  totalSeats: number; // Always 1
  bookedSeats: number; // 0 or 1
  price: number; // Always 0
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  format?: string;
  benefits?: string[];
  slotId?: string;
}

export interface PrivateSession extends WithTimestamps {
  _id: string;
  instructorName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  totalSeats: number; // Always 1
  bookedSeats: number; // 0 or 1
  price: number; // Payment required
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  format?: string;
  benefits?: string[];
  slotId?: string;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking extends WithTimestamps {
  _id: string;
  userId: string;
  sessionId: string;
  seats: number;
  amount: number;
  status: BookingStatus;
  phone?: string;
  comment?: string;
  paymentProvider?: "stripe" | "paypal" | "bank_transfer";
  paymentRef?: string;
  paymentStatus?: "pending" | "paid" | "failed";
  sessionType?: "discovery" | "private" | "corporate";
  slotId?: string;
}

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
};



