"use client";

import React, { useEffect, useState } from "react";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle,
  DollarSign,
  User,
  MapPin,
  Calendar,
  Eye,
  Filter
} from "lucide-react";
import toast from "react-hot-toast";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "refunded";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type ShippingAddress = {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

type Order = {
  _id: string;
  userId: string;
  items: OrderItem[];
  amount: number;
  currency: string;
  status: OrderStatus;
  paymentProvider?: string;
  paymentRef?: string;
  shippingAddress?: ShippingAddress;
  customerEmail?: string;
  customerName?: string;
  createdAt: string;
  updatedAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setError(null);
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const url = statusFilter === "all" 
        ? "/api/admin/orders" 
        : `/api/admin/orders?status=${statusFilter}`;
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Handle HTTP error status codes
        let errorMessage = "Failed to load orders";
        if (response.status === 404) {
          errorMessage = "Orders API endpoint not found. Please check if the API route exists.";
          console.error("404 Error: Orders API endpoint not found -", url);
        } else if (response.status === 401 || response.status === 403) {
          errorMessage = "Unauthorized. Please log in again.";
          console.error("Auth Error: Unauthorized access");
        } else {
          errorMessage = `Failed to load orders (Error ${response.status})`;
          console.error(`HTTP Error: ${response.status}`);
        }
        setError(errorMessage);
        toast.error(errorMessage);
        setOrders([]);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        const ordersList = data.data?.orders || [];
        setOrders(ordersList);
        setError(null);
        
        // Calculate stats
        const stats = {
          total: ordersList.length,
          pending: ordersList.filter((o: Order) => o.status === "pending").length,
          paid: ordersList.filter((o: Order) => o.status === "paid").length,
          shipped: ordersList.filter((o: Order) => o.status === "shipped").length,
          delivered: ordersList.filter((o: Order) => o.status === "delivered").length,
          cancelled: ordersList.filter((o: Order) => o.status === "cancelled").length,
          totalRevenue: ordersList
            .filter((o: Order) => ["paid", "shipped", "delivered"].includes(o.status))
            .reduce((sum: number, o: Order) => sum + o.amount, 0),
        };
        setStats(stats);
      } else {
        // Handle API-level error (success: false)
        const errorMessage = data.message || "Failed to load orders";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("API Error:", data.message);
        setOrders([]);
      }
    } catch (error) {
      const errorMessage = "Failed to load orders. Please check your connection.";
      setError(errorMessage);
      console.error("Failed to fetch orders:", error);
      toast.error(errorMessage);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Order status updated");
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        toast.error(data.message || "Failed to update order");
      }
    } catch (error) {
      console.error("Failed to update order:", error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const badges = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
      paid: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
      shipped: { bg: "bg-blue-100", text: "text-blue-800", icon: Truck },
      delivered: { bg: "bg-purple-100", text: "text-purple-800", icon: Package },
      cancelled: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
      refunded: { bg: "bg-gray-100", text: "text-gray-800", icon: DollarSign },
    };

    const badge = badges[status];
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon size={14} />
        {status.toUpperCase()}
      </span>
    );
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    const amountInMainUnit = amount; // Already in dollars
    if (currency === "USD" || currency === "usd") {
      return `$${amountInMainUnit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${currency} ${amountInMainUnit.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 p-6 sm:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-6 sm:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Orders Management</h1>
          <p className="text-zinc-400">Manage customer orders and track payments</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <Package className="text-blue-400" size={24} />
              <span className="text-2xl font-bold text-white">{stats.total}</span>
            </div>
            <p className="text-zinc-400 text-sm">Total Orders</p>
          </div>

          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="text-green-400" size={24} />
              <span className="text-2xl font-bold text-white">{stats.paid}</span>
            </div>
            <p className="text-zinc-400 text-sm">Paid Orders</p>
          </div>

          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <Truck className="text-purple-400" size={24} />
              <span className="text-2xl font-bold text-white">{stats.shipped}</span>
            </div>
            <p className="text-zinc-400 text-sm">Shipped Orders</p>
          </div>

          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="text-yellow-400" size={24} />
              <span className="text-2xl font-bold text-white">
                {formatCurrency(stats.totalRevenue)}
              </span>
            </div>
            <p className="text-zinc-400 text-sm">Total Revenue</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-zinc-800 rounded-lg p-4 mb-6 border border-zinc-700">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="text-zinc-400" size={20} />
              <span className="text-white font-medium">Filter by Status:</span>
            </div>
            {["all", "pending", "paid", "shipped", "delivered", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-red-400 font-semibold mb-1">Error Loading Orders</h3>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
              <button
                onClick={fetchOrders}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900 border-b border-zinc-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {orders.length === 0 && !loading && !error ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-zinc-400">
                      <div className="flex flex-col items-center gap-2">
                        <Package size={48} className="text-zinc-600" />
                        <p className="text-lg font-medium">No orders found</p>
                        <p className="text-sm text-zinc-500">
                          {statusFilter === "all" 
                            ? "You don't have any orders yet." 
                            : `No orders with status "${statusFilter}" found.`}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : orders.length === 0 && error ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-zinc-400">
                      <p className="text-red-400">Unable to load orders. Please try again.</p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-zinc-750 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-blue-400">
                          {order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-white">
                            {order.customerName || "N/A"}
                          </div>
                          <div className="text-zinc-400 text-xs">
                            {order.customerEmail || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-zinc-300">
                          {order.items.length} item(s)
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-white">
                          {formatCurrency(order.amount, order.currency)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-zinc-300 capitalize">
                            {order.paymentProvider || "N/A"}
                          </div>
                          {order.paymentRef && (
                            <div className="text-zinc-500 text-xs font-mono">
                              {order.paymentRef.slice(0, 20)}...
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-zinc-400">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-zinc-900 p-6 border-b border-zinc-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Order Details</h2>
                  <p className="text-sm text-zinc-400">
                    Order ID: {selectedOrder._id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <User size={20} />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-400">Name:</span>
                    <p className="text-white font-medium">
                      {selectedOrder.customerName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400">Email:</span>
                    <p className="text-white font-medium">
                      {selectedOrder.customerEmail || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MapPin size={20} />
                    Shipping Address
                  </h3>
                  <div className="text-sm text-zinc-300 space-y-1">
                    {selectedOrder.shippingAddress.line1 && (
                      <p>{selectedOrder.shippingAddress.line1}</p>
                    )}
                    {selectedOrder.shippingAddress.line2 && (
                      <p>{selectedOrder.shippingAddress.line2}</p>
                    )}
                    <p>
                      {[
                        selectedOrder.shippingAddress.city,
                        selectedOrder.shippingAddress.state,
                        selectedOrder.shippingAddress.postalCode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {selectedOrder.shippingAddress.country && (
                      <p className="font-medium">{selectedOrder.shippingAddress.country}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Package size={20} />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-zinc-700 last:border-0"
                    >
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-sm text-zinc-400">
                          Quantity: {item.quantity} × {formatCurrency(item.price, selectedOrder.currency)}
                        </p>
                      </div>
                      <div className="text-white font-semibold">
                        {formatCurrency(item.price * item.quantity, selectedOrder.currency)}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 border-t-2 border-zinc-600">
                    <span className="text-lg font-semibold text-white">Total:</span>
                    <span className="text-xl font-bold text-white">
                      {formatCurrency(selectedOrder.amount, selectedOrder.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <DollarSign size={20} />
                  Payment Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Provider:</span>
                    <span className="text-white font-medium capitalize">
                      {selectedOrder.paymentProvider || "N/A"}
                    </span>
                  </div>
                  {selectedOrder.paymentRef && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Reference:</span>
                      <span className="text-white font-mono text-xs">
                        {selectedOrder.paymentRef}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Status:</span>
                    <div>{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                </div>
              </div>

              {/* Order Dates */}
              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar size={20} />
                  Timeline
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Created:</span>
                    <span className="text-white">{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Last Updated:</span>
                    <span className="text-white">{formatDate(selectedOrder.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Update Status */}
              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
                <h3 className="text-lg font-semibold text-white mb-4">Update Order Status</h3>
                <div className="flex flex-wrap gap-2">
                  {["pending", "paid", "shipped", "delivered", "cancelled", "refunded"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder._id, status as OrderStatus)}
                        disabled={selectedOrder.status === status}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedOrder.status === status
                            ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

