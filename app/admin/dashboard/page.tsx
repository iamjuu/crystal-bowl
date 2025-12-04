import { getDashboardStats } from "@/lib/admin/stats";
import Link from "next/link";
import { SimplePieChart } from "@/components/admin/SimpleChart";
import DashboardCharts from "@/components/admin/DashboardCharts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const formatCurrency = (amount: number) => {
  const value = amount / 100;
  if (value >= 1000000) {
    return `₹${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value.toFixed(2)}`;
};

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const StatCard = ({
  title,
  value,
  icon,
  iconColor,
}: {
  title: string;
  value: string;
  icon: string;
  iconColor: string;
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-zinc-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-800/70 hover:shadow-xl border border-zinc-700/50">
      <div className="relative">
        <div className="mb-4 flex items-start justify-between">
          <div className={`rounded-xl ${iconColor} p-3 text-2xl shadow-lg`}>
            {icon}
          </div>
        </div>
        <h3 className="mb-2 text-sm font-medium text-zinc-400 uppercase tracking-wide">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  // Prepare chart data
  const productSalesChartData = stats.productSalesData.slice(0, 8).map((item) => ({
    label: item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name,
    value: item.sales,
    color: "#8b5cf6",
  }));

  const blogChartData = stats.blogData.slice(-14).map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: item.count,
  }));

  const eventChartData = stats.eventData.slice(-14).map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: item.count,
    participants: item.participants,
  }));

  const yogaSessionChartData = stats.yogaSessionData.slice(-14).map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: item.sessions,
    bookings: item.bookings,
  }));

  const revenueChartData = stats.revenueData.slice(-14).map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: item.revenue / 100, // Convert to currency units
  }));

  return (
    <div className="min-h-screen bg-zinc-900 p-6 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-400">Welcome back! Here&apos;s what&apos;s happening with your business.</p>
          </div>
          <div className="rounded-lg bg-zinc-800/50 px-4 py-2 text-sm text-zinc-300 border border-zinc-700/50">
            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </div>
        </div>

        {/* Charts Section - 4 Main Charts */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Chart 1: E-commerce Revenue */}
          <div className="rounded-2xl bg-zinc-800/50 p-6 backdrop-blur-sm border border-zinc-700/50">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">E-commerce Revenue</h2>
              <p className="mt-1 text-sm text-zinc-400">Revenue trend over last 14 days</p>
            </div>
            <DashboardCharts
              type="line"
              data={revenueChartData}
              title="Revenue (₹)"
              color="#10b981"
            />
          </div>

          {/* Chart 2: Product Sales */}
          <div className="rounded-2xl bg-zinc-800/50 p-6 backdrop-blur-sm border border-zinc-700/50">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">Product Sales</h2>
              <p className="mt-1 text-sm text-zinc-400">Top selling products</p>
            </div>
            <DashboardCharts
              type="bar"
              data={productSalesChartData}
              title="Sales Quantity"
            />
          </div>

          {/* Chart 3: Blog Reach */}
          <div className="rounded-2xl bg-zinc-800/50 p-6 backdrop-blur-sm border border-zinc-700/50">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">Blog Reach</h2>
              <p className="mt-1 text-sm text-zinc-400">Blog posts created over time</p>
            </div>
            <DashboardCharts
              type="line"
              data={blogChartData}
              title="Blog Posts"
              color="#3b82f6"
            />
          </div>

          {/* Chart 4: Event Schedule & Participants */}
          <div className="rounded-2xl bg-zinc-800/50 p-6 backdrop-blur-sm border border-zinc-700/50">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">Event Schedule</h2>
              <p className="mt-1 text-sm text-zinc-400">Events scheduled over time</p>
              <div className="mt-2 flex gap-4 text-sm">
                <span className="text-zinc-400">
                  Upcoming: <span className="text-white font-semibold">{stats.events.upcoming}</span>
                </span>
                <span className="text-zinc-400">
                  Past: <span className="text-white font-semibold">{stats.events.past}</span>
                </span>
              </div>
            </div>
            <DashboardCharts
              type="bar"
              data={eventChartData.map((item) => ({
                label: item.date,
                value: item.value,
                color: "#8b5cf6",
              }))}
              title="Events"
            />
          </div>
        </section>

        {/* Additional Charts Section */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* User Statistics */}
          <div className="rounded-2xl bg-zinc-800/50 p-6 backdrop-blur-sm border border-zinc-700/50">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">User Statistics</h2>
              <p className="mt-1 text-sm text-zinc-400">User distribution</p>
            </div>
            <SimplePieChart
              data={[
                { name: "Total Users", value: stats.users.total, color: "#10b981" },
                { name: "Verified Users", value: stats.users.verified, color: "#3b82f6" },
              ]}
              title=""
            />
          </div>

          {/* Yoga Sessions */}
          <div className="rounded-2xl bg-zinc-800/50 p-6 backdrop-blur-sm border border-zinc-700/50">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">Yoga Sessions</h2>
              <p className="mt-1 text-sm text-zinc-400">Sessions and bookings trend</p>
              <div className="mt-2 text-sm text-zinc-400">
                <p>Total Seats: <span className="text-white font-semibold">{stats.yogaSessions.totalSeats}</span></p>
                <p>Booked Seats: <span className="text-white font-semibold">{stats.yogaSessions.bookedSeats}</span></p>
              </div>
            </div>
            <DashboardCharts
              type="line"
              data={yogaSessionChartData}
              title="Sessions"
              color="#a855f7"
            />
          </div>

          {/* Order Status */}
          <div className="rounded-2xl bg-zinc-800/50 p-6 backdrop-blur-sm border border-zinc-700/50">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">Order Status</h2>
              <p className="mt-1 text-sm text-zinc-400">Order distribution</p>
            </div>
            <SimplePieChart
              data={stats.orderStatusData}
              title=""
            />
          </div>
        </section>

        {/* Recent Orders & Bookings */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <div className="rounded-2xl bg-zinc-800/50 p-6 backdrop-blur-sm border border-zinc-700/50">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
                <p className="mt-1 text-sm text-zinc-400">Latest customer orders</p>
              </div>
              <Link href="/admin/dashboard/orders" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                View All →
              </Link>
            </div>
            {stats.recentOrders.length === 0 ? (
              <div className="py-8 text-center text-zinc-500">No orders yet</div>
            ) : (
              <div className="space-y-3">
                {stats.recentOrders.slice(0, 5).map((order: { _id: string; amount: number; status: string; createdAt: string }) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between rounded-lg bg-zinc-900/50 p-4 border border-zinc-700/30 hover:bg-zinc-900/70 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-mono text-xs text-zinc-400">#{String(order._id).slice(-8)}</p>
                      <p className="mt-1 text-sm font-semibold text-white">{formatCurrency(order.amount)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          order.status === "paid"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : order.status === "pending"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="rounded-2xl bg-zinc-800/50 p-6 backdrop-blur-sm border border-zinc-700/50">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Recent Bookings</h2>
                <p className="mt-1 text-sm text-zinc-400">Latest yoga session bookings</p>
              </div>
              <Link href="/admin/dashboard/sessions" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                View All →
              </Link>
            </div>
            {stats.recentBookings.length === 0 ? (
              <div className="py-8 text-center text-zinc-500">No bookings yet</div>
            ) : (
              <div className="space-y-3">
                {stats.recentBookings.slice(0, 5).map((booking: { _id: string; seats: number; amount: number; status: string; createdAt: string }) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between rounded-lg bg-zinc-900/50 p-4 border border-zinc-700/30 hover:bg-zinc-900/70 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-mono text-xs text-zinc-400">#{String(booking._id).slice(-8)}</p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {booking.seats} seat{booking.seats !== 1 ? "s" : ""} • {formatCurrency(booking.amount)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          booking.status === "confirmed"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : booking.status === "pending"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {booking.status}
                      </span>
                      <span className="text-xs text-zinc-500">{new Date(booking.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
