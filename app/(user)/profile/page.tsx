"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import toast from "react-hot-toast";
import { User, Mail, Phone, MapPin, Camera, LogOut, Save, Package, Calendar } from "lucide-react";
import Image from "next/image";
import ProtectedRoute from "@/components/user/ProtectedRoute";
import { CheckCircle, Clock, XCircle, Truck } from "lucide-react";

type UserProfile = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  imageUrl?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
};

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  paymentProvider?: string;
};

type Booking = {
  _id: string;
  sessionId: string;
  sessionType: "discovery" | "private" | "corporate";
  seats: number;
  amount: number;
  status: string;
  phone?: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
};

type TabType = "profile" | "orders" | "bookings";

function ProfilePageContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      fetchUserData(token);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "orders" && orders.length === 0 && !ordersLoading) {
      fetchOrders();
    }
    if (activeTab === "bookings" && bookings.length === 0 && !bookingsLoading) {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchUserData = async (token: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("userToken");
          toast.error("Session expired. Please login again.");
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch user data");
      }
      
      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data);
        setFormData({
          name: data.data.name || "",
          phone: data.data.phone || "",
          street: data.data.address?.street || "",
          city: data.data.address?.city || "",
          state: data.data.address?.state || "",
          zipCode: data.data.address?.zipCode || "",
          country: data.data.address?.country || "",
        });
        if (data.data.imageUrl) {
          setPreviewUrl(getImageUrl(data.data.imageUrl));
        }
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      setOrdersLoading(true);
      const response = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
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
      setOrdersLoading(false);
    }
  };

  const fetchBookings = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      setBookingsLoading(true);
      const response = await fetch("/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setBookings(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Something went wrong");
    } finally {
      setBookingsLoading(false);
    }
  };

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("data:image")) return imageUrl;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
    return `data:image/jpeg;base64,${imageUrl}`;
  };

  const compressImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxWidth = 800;
          const maxHeight = 800;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.8);
          resolve(compressed);
        };
        img.onerror = reject;
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) {
      setImageFile(null);
      setPreviewUrl("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      const compressed = await compressImageToBase64(file);
      setPreviewUrl(compressed);
      setImageFile(file);
    } catch (err) {
      toast.error("Failed to process image");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    if (!token) {
      router.push("/login");
      return;
    }

    setSaving(true);
    try {
      const updateData: any = {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      };

      if (previewUrl && imageFile) {
        updateData.imageUrl = previewUrl;
      }

      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      if (data.data) {
        setUser(data.data);
        if (data.data.imageUrl) {
          setPreviewUrl(getImageUrl(data.data.imageUrl));
        }
      }
      setImageFile(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/user/logout", { 
        method: "POST", 
        credentials: "include" 
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("logout"));
      toast.success("Logged out successfully");
      router.push("/");
      setTimeout(() => {
        router.refresh();
      }, 100);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "delivered":
      case "confirmed":
        return <CheckCircle className="text-green-600" size={20} />;
      case "shipped":
        return <Truck className="text-blue-600" size={20} />;
      case "pending":
        return <Clock className="text-yellow-600" size={20} />;
      case "cancelled":
      case "refunded":
        return <XCircle className="text-red-600" size={20} />;
      default:
        return <Package className="text-gray-600" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "delivered":
      case "confirmed":
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDECE2] via-[#FEC1A2] to-[#D5B584] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDECE2] via-[#FEC1A2] to-[#D5B584] flex items-center justify-center">
        <p className="text-white text-lg">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDECE2] via-[#FEC1A2] to-[#D5B584]">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#D5B584] to-[#FEC1A2] px-6 sm:px-8 lg:px-12 py-8 sm:py-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Profile Image */}
              <div className="relative group">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {previewUrl || user.imageUrl ? (
                    <Image
                      src={previewUrl || getImageUrl(user.imageUrl || "")}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#D5B584] to-[#FEC1A2] flex items-center justify-center text-white text-4xl sm:text-5xl font-bold">
                      {getInitials(user.name)}
                    </div>
                  )}
                </div>
                {activeTab === "profile" && (
                  <label className="absolute bottom-0 right-0 bg-[#D5B584] text-white p-3 rounded-full cursor-pointer hover:bg-[#C4A574] transition-colors shadow-lg group-hover:scale-110 transform">
                    <Camera size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                    />
                  </label>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{user.name}</h1>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <Mail size={18} />
                    <span className="text-sm sm:text-base">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={18} />
                      <span className="text-sm sm:text-base">{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
              >
                <LogOut size={18} />
                <span className="text-sm sm:text-base">Logout</span>
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 bg-white">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("profile")}
                className={`
                  flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 transition-colors
                  ${activeTab === "profile"
                    ? "border-[#D5B584] text-[#D5B584] bg-[#FEF9F5]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <User size={20} className="inline-block mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`
                  flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 transition-colors
                  ${activeTab === "orders"
                    ? "border-[#D5B584] text-[#D5B584] bg-[#FEF9F5]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <Package size={20} className="inline-block mr-2" />
                Orders
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`
                  flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 transition-colors
                  ${activeTab === "bookings"
                    ? "border-[#D5B584] text-[#D5B584] bg-[#FEF9F5]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <Calendar size={20} className="inline-block mr-2" />
                Booked Yoga Sessions
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8 lg:p-12">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <form onSubmit={handleSave} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h2 className="text-2xl font-bold text-[#1C3163] mb-6 flex items-center gap-2">
                    <User size={24} />
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#D5B584] focus:ring-2 focus:ring-[#D5B584]/20 outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#D5B584] focus:ring-2 focus:ring-[#D5B584]/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h2 className="text-2xl font-bold text-[#1C3163] mb-6 flex items-center gap-2">
                    <MapPin size={24} />
                    Address Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#D5B584] focus:ring-2 focus:ring-[#D5B584]/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#D5B584] focus:ring-2 focus:ring-[#D5B584]/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#D5B584] focus:ring-2 focus:ring-[#D5B584]/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#D5B584] focus:ring-2 focus:ring-[#D5B584]/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#D5B584] focus:ring-2 focus:ring-[#D5B584]/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#D5B584] to-[#FEC1A2] text-white px-8 py-3 rounded-lg font-semibold hover:from-[#C4A574] hover:to-[#E8B192] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={20} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-bold text-[#1C3163] mb-6 flex items-center gap-2">
                  <Package size={24} />
                  My Orders
                </h2>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-[#D5B584]/30 border-t-[#D5B584] rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-12 text-center">
                    <Package size={64} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-[#1C3163] text-xl font-medium mb-2">No Orders Yet</h3>
                    <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order._id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                        <div className="bg-white px-6 py-4 border-b border-gray-200">
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
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4 mb-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="text-[#1C3163] font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                                <p className="text-[#1C3163] font-medium">
                                  ${item.price.toLocaleString("en-US")}
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-gray-200 pt-4 mt-4">
                            <div className="flex justify-between items-center">
                              <p className="text-[#1C3163] font-semibold text-lg">Total Amount</p>
                              <p className="text-[#1C3163] font-semibold text-xl">
                                ${order.amount.toLocaleString("en-US")}
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
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div>
                <h2 className="text-2xl font-bold text-[#1C3163] mb-6 flex items-center gap-2">
                  <Calendar size={24} />
                  Booked Yoga Sessions
                </h2>
                {bookingsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-[#D5B584]/30 border-t-[#D5B584] rounded-full animate-spin" />
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-12 text-center">
                    <Calendar size={64} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-[#1C3163] text-xl font-medium mb-2">No Bookings Yet</h3>
                    <p className="text-gray-600 mb-6">You haven&apos;t booked any yoga sessions yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                        <div className="bg-white px-6 py-4 border-b border-gray-200">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-4">
                              {getStatusIcon(booking.status)}
                              <div>
                                <p className="text-sm text-gray-600">Booking ID</p>
                                <p className="text-[#1C3163] font-medium">
                                  #{booking._id.slice(-8).toUpperCase()}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col md:items-end gap-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                              <p className="text-sm text-gray-600">
                                {new Date(booking.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Session Type:</span>
                              <span className="text-[#1C3163] font-medium capitalize">{booking.sessionType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Seats:</span>
                              <span className="text-[#1C3163] font-medium">{booking.seats}</span>
                            </div>
                            {booking.amount > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Amount:</span>
                                <span className="text-[#1C3163] font-medium">${booking.amount.toFixed(2)}</span>
                              </div>
                            )}
                            {booking.comment && (
                              <div className="pt-3 border-t border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">Details:</p>
                                <p className="text-[#1C3163]">{booking.comment}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}
