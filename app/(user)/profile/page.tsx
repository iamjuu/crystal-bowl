"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import toast from "react-hot-toast";
import { User, Mail, Phone, MapPin, Camera, LogOut, Save } from "lucide-react";
import Image from "next/image";

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

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
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
    const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    if (!token) {
      router.push("/login");
      return;
    }
    fetchUserData(token);
  }, [router]);

  const fetchUserData = async (token: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user data");
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
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
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
      // Call user-specific logout endpoint
      await fetch("/api/user/logout", { 
        method: "POST", 
        credentials: "include" 
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear all user auth data from localStorage
      localStorage.removeItem("userToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("user");
      
      // Dispatch logout event for Navbar
      window.dispatchEvent(new Event("logout"));
      
      toast.success("Logged out successfully");
      router.push("/");
      
      // Force a hard refresh to clear any cached state
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
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
                <label className="absolute bottom-0 right-0 bg-[#D5B584] text-white p-3 rounded-full cursor-pointer hover:bg-[#C4A574] transition-colors shadow-lg group-hover:scale-110 transform">
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                  />
                </label>
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

          {/* Form Section */}
          <form onSubmit={handleSave} className="p-6 sm:p-8 lg:p-12">
            <div className="space-y-6">
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
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

