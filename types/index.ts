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
}

export interface Product extends WithTimestamps {
  _id: string;
  name: string;
  description: string;
  price: number; // smallest currency unit
  imageUrl: string[]; // Array of base64 image strings
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "refunded";

export interface Order extends WithTimestamps {
  _id: string;
  userId: string;
  items: OrderItem[];
  amount: number;
  currency: string;
  status: OrderStatus;
  paymentProvider?: "razorpay" | "stripe";
  paymentRef?: string;
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

