import { getDashboardStats } from "@/lib/admin/stats";
import Link from "next/link";

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

  return (
    <div className="min-h-screen bg-zinc-900 p-6 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-400">Welcome back! Here's what's happening with your business.</p>
          </div>
          <div className="rounded-lg bg-zinc-800/50 px-4 py-2 text-sm text-zinc-300 border border-zinc-700/50">
            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </div>
        </div>

        {/* Stat Cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.revenue.total)}
            icon="💰"
            iconColor="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <StatCard
            title="Total Orders"
            value={formatNumber(stats.orders.total)}
            icon="📦"
            iconColor="bg-gradient-to-br from-blue-500 to-indigo-600"
          />
          <StatCard
            title="Total Bookings"
            value={formatNumber(stats.bookings.total)}
            icon="🧘"
            iconColor="bg-gradient-to-br from-purple-500 to-pink-600"
          />
          <StatCard
            title="Total Users"
            value={formatNumber(stats.users.total)}
            icon="👥"
            iconColor="bg-gradient-to-br from-orange-500 to-red-600"
          />
          <StatCard
            title="Products"
            value={stats.products.total.toString()}
            icon="📊"
            iconColor="bg-gradient-to-br from-cyan-500 to-blue-600"
          />
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
                {stats.recentOrders.slice(0, 5).map((order: any) => (
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
                {stats.recentBookings.slice(0, 5).map((booking: any) => (
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

