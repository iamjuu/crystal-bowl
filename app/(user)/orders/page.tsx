"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  paymentProvider?: string;
}

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("userToken");
      
      if (!token) {
        toast.error("Please login to view your orders");
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setOrders(data.data || []);
        } else {
          toast.error(data.message || "Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "delivered":
        return <CheckCircle className="text-green-600" size={24} />;
      case "shipped":
        return <Truck className="text-blue-600" size={24} />;
      case "pending":
        return <Clock className="text-yellow-600" size={24} />;
      case "cancelled":
      case "refunded":
        return <XCircle className="text-red-600" size={24} />;
      default:
        return <Package className="text-gray-600" size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "delivered":
        return "text-green-600 bg-green-50";
      case "shipped":
        return "text-blue-600 bg-blue-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "cancelled":
      case "refunded":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1C3163] mx-auto mb-4"></div>
            <p className="text-[#1C3163] text-lg">Loading your orders...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#FDECE2] to-[#FEC1A2] min-h-screen">
      <Navbar />

      <section className="w-full py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[#1C3163] text-3xl md:text-4xl font-medium mb-2">
              My Orders
            </h1>
            <p className="text-[#2C3E50]">
              View and track your order history
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Package size={64} className="text-gray-400 mx-auto mb-4" />
              <h2 className="text-[#1C3163] text-2xl font-medium mb-4">
                No Orders Yet
              </h2>
              <p className="text-[#2C3E50] mb-6">
                You haven&apos;t placed any orders yet. Start shopping to see your orders here.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-[#2C3E50] hover:bg-[#1C3163] text-white px-8 py-3 rounded-lg transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="text-sm text-gray-600">Order ID</p>
                          <p className="text-[#1C3163] font-medium">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4 mb-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-start"
                        >
                          <div className="flex-1">
                            <p className="text-[#1C3163] font-medium">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="text-[#1C3163] font-medium">
                            ₹{(item.price / 100).toLocaleString("en-IN")}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Order Total */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <p className="text-[#1C3163] font-semibold text-lg">
                          Total Amount
                        </p>
                        <p className="text-[#1C3163] font-semibold text-xl">
                          ₹{(order.amount / 100).toLocaleString("en-IN")}
                        </p>
                      </div>
                      {order.paymentProvider && (
                        <p className="text-sm text-gray-600 mt-2">
                          Paid via {order.paymentProvider.charAt(0).toUpperCase() + order.paymentProvider.slice(1)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OrdersPage;

