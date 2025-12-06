import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Booking from "@/models/Booking";
import User from "@/models/User";
import Product from "@/models/Product";
import Blog from "@/models/Blog";
import Event from "@/models/Event";
import YogaSession from "@/models/YogaSession";

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
  blogs: {
    total: number;
  };
  events: {
    total: number;
    upcoming: number;
    past: number;
  };
  yogaSessions: {
    total: number;
    totalBookings: number;
    totalSeats: number;
    bookedSeats: number;
  };
  recentOrders: any[];
  recentBookings: any[];
  revenueData: { date: string; revenue: number; orders: number; bookings: number }[];
  orderStatusData: { name: string; value: number; color: string }[];
  bookingStatusData: { name: string; value: number; color: string }[];
  productSalesData: { name: string; sales: number; revenue: number }[];
  blogData: { date: string; count: number }[];
  eventData: { date: string; count: number; participants: number }[];
  yogaSessionData: { date: string; sessions: number; bookings: number }[];
};

export async function getDashboardStats(): Promise<DashboardStats> {
  await connectDB();

  const [orders, bookings, totalUsers, verifiedUsers, totalProducts, blogs, events, yogaSessions] = await Promise.all([
    Order.find().lean(),
    Booking.find().lean(),
    User.countDocuments(),
    User.countDocuments({ emailVerified: true }),
    Product.countDocuments(),
    Blog.find().lean(),
    Event.find().lean(),
    YogaSession.find().lean(),
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

  // Product sales data (top products by revenue)
  const productSalesMap = new Map<string, { sales: number; revenue: number }>();
  orders.filter((o: any) => o.status === "paid").forEach((order: any) => {
    order.items?.forEach((item: any) => {
      const existing = productSalesMap.get(item.name) || { sales: 0, revenue: 0 };
      productSalesMap.set(item.name, {
        sales: existing.sales + item.quantity,
        revenue: existing.revenue + item.price * item.quantity,
      });
    });
  });
  const productSalesData = Array.from(productSalesMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Blog data for last 30 days
  const blogData: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayBlogs = (blogs as any[]).filter((b: any) => {
      const blogDate = new Date(b.createdAt).toISOString().split("T")[0];
      return blogDate === dateStr;
    });
    blogData.push({ date: dateStr, count: dayBlogs.length });
  }

  // Event data for last 30 days
  const eventData: { date: string; count: number; participants: number }[] = [];
  const todayDate = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(todayDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayEvents = (events as any[]).filter((e: any) => e.date === dateStr);
    eventData.push({ 
      date: dateStr, 
      count: dayEvents.length,
      participants: dayEvents.length * 10 // Placeholder - you can add actual participant tracking later
    });
  }

  // Yoga session data for last 30 days
  const yogaSessionData: { date: string; sessions: number; bookings: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(todayDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const daySessions = (yogaSessions as any[]).filter((s: any) => s.date === dateStr);
    const dayBookings = (bookings as any[]).filter((b: any) => {
      const bookingDate = new Date(b.createdAt).toISOString().split("T")[0];
      return bookingDate === dateStr;
    });
    yogaSessionData.push({ 
      date: dateStr, 
      sessions: daySessions.length,
      bookings: dayBookings.length
    });
  }

  // Calculate upcoming and past events
  const now = new Date();
  const upcomingEvents = (events as any[]).filter((e: any) => new Date(e.date) >= now);
  const pastEvents = (events as any[]).filter((e: any) => new Date(e.date) < now);

  // Calculate yoga session stats
  const totalBookings = bookings.length;
  const totalSeats = (yogaSessions as any[]).reduce((sum, s: any) => sum + (s.totalSeats || 0), 0);
  const bookedSeats = (yogaSessions as any[]).reduce((sum, s: any) => sum + (s.bookedSeats || 0), 0);

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
    blogs: {
      total: blogs.length,
    },
    events: {
      total: events.length,
      upcoming: upcomingEvents.length,
      past: pastEvents.length,
    },
    yogaSessions: {
      total: yogaSessions.length,
      totalBookings: totalBookings,
      totalSeats: totalSeats,
      bookedSeats: bookedSeats,
    },
    recentOrders,
    recentBookings,
    revenueData,
    orderStatusData,
    bookingStatusData,
    productSalesData,
    blogData,
    eventData,
    yogaSessionData,
  };
}



