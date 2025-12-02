import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Booking from "@/models/Booking";
import User from "@/models/User";
import Product from "@/models/Product";

export type DashboardStats = {
  revenue: {
    orders: number;
    bookings: number;
    total: number;
  };
  orders: {
    total: number;
    pending: number;
    paid: number;
    cancelled: number;
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  };
  users: {
    total: number;
    verified: number;
  };
  products: {
    total: number;
  };
  recentOrders: any[];
  recentBookings: any[];
  revenueData: { date: string; revenue: number; orders: number; bookings: number }[];
  orderStatusData: { name: string; value: number; color: string }[];
  bookingStatusData: { name: string; value: number; color: string }[];
};

export async function getDashboardStats(): Promise<DashboardStats> {
  await connectDB();

  const [orders, bookings, totalUsers, verifiedUsers, totalProducts] = await Promise.all([
    Order.find().lean(),
    Booking.find().lean(),
    User.countDocuments(),
    User.countDocuments({ emailVerified: true }),
    Product.countDocuments(),
  ]);

  const totalRevenue = orders.filter((o) => o.status === "paid").reduce((sum, o) => sum + o.amount, 0);
  const bookingRevenue = bookings.filter((b) => b.status === "confirmed").reduce((sum, b) => sum + b.amount, 0);

  const [recentOrders, recentBookings] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).limit(10).lean(),
    Booking.find().sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  // Generate revenue data for last 30 days
  const revenueData: { date: string; revenue: number; orders: number; bookings: number }[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    
    const dayOrders = orders.filter((o: any) => {
      const orderDate = new Date(o.createdAt).toISOString().split("T")[0];
      return orderDate === dateStr && o.status === "paid";
    });
    const dayBookings = bookings.filter((b: any) => {
      const bookingDate = new Date(b.createdAt).toISOString().split("T")[0];
      return bookingDate === dateStr && b.status === "confirmed";
    });
    
    const dayOrderRevenue = dayOrders.reduce((sum: number, o: any) => sum + o.amount, 0);
    const dayBookingRevenue = dayBookings.reduce((sum: number, b: any) => sum + b.amount, 0);
    
    revenueData.push({
      date: dateStr,
      revenue: dayOrderRevenue + dayBookingRevenue,
      orders: dayOrders.length,
      bookings: dayBookings.length,
    });
  }

  // Order status data for pie chart
  const orderStatusData = [
    { name: "Paid", value: orders.filter((o) => o.status === "paid").length, color: "#10b981" },
    { name: "Pending", value: orders.filter((o) => o.status === "pending").length, color: "#f59e0b" },
    { name: "Cancelled", value: orders.filter((o) => o.status === "cancelled").length, color: "#ef4444" },
  ].filter((item) => item.value > 0);

  // Booking status data for pie chart
  const bookingStatusData = [
    { name: "Confirmed", value: bookings.filter((b) => b.status === "confirmed").length, color: "#10b981" },
    { name: "Pending", value: bookings.filter((b) => b.status === "pending").length, color: "#f59e0b" },
    { name: "Cancelled", value: bookings.filter((b) => b.status === "cancelled").length, color: "#ef4444" },
  ].filter((item) => item.value > 0);

  return {
    revenue: {
      orders: totalRevenue,
      bookings: bookingRevenue,
      total: totalRevenue + bookingRevenue,
    },
    orders: {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      paid: orders.filter((o) => o.status === "paid").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    },
    bookings: {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    },
    users: {
      total: totalUsers,
      verified: verifiedUsers,
    },
    products: {
      total: totalProducts,
    },
    recentOrders,
    recentBookings,
    revenueData,
    orderStatusData,
    bookingStatusData,
  };
}



