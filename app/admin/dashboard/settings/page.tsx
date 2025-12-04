"use client";

import { useState, useEffect } from "react";

type AdminProfile = {
  _id: string;
  name: string;
  email: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "" as string | File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Fetch admin profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/profile");
      const data = await response.json();
      
      if (data.success && data.data) {
        setProfile(data.data);
        setFormData({
          name: data.data.name || "",
          email: data.data.email || "",
          password: "",
          confirmPassword: "",
          image: data.data.imageUrl || "",
        });
        if (data.data.imageUrl) {
          setPreviewUrl(getImageUrl(data.data.imageUrl));
        }
      } else {
        setError(data.message || "Failed to fetch profile");
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Failed to fetch profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Normalize image URL for display
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
        const img = new Image();
        img.onload = () => {
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to create blob"));
                return;
              }

              const reader2 = new FileReader();
              reader2.onloadend = () => {
                const base64String = reader2.result as string;
                resolve(base64String);
              };
              reader2.onerror = () => reject(new Error("Failed to read blob"));
              reader2.readAsDataURL(blob);
            },
            "image/webp",
            0.8
          );
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) {
      setFormData({ ...formData, image: "" });
      setPreviewUrl("");
      return;
    }

    try {
      const base64String = await compressImageToBase64(file);
      setFormData({ ...formData, image: base64String });
      setPreviewUrl(base64String);
    } catch (error) {
      console.error("Error compressing image:", error);
      setError("Failed to process image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Name is required");
      setSaving(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      setSaving(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid email address");
      setSaving(false);
      return;
    }

    // Password validation (only if password is provided)
    if (formData.password) {
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setSaving(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setSaving(false);
        return;
      }
    }

    try {
      const requestBody: {
        name: string;
        email: string;
        password?: string;
        imageUrl?: string;
      } = {
        name: formData.name.trim(),
        email: formData.email.trim(),
      };

      if (formData.password) {
        requestBody.password = formData.password;
      }

      if (formData.image) {
        requestBody.imageUrl = typeof formData.image === "string" ? formData.image : undefined;
      }

      const response = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      
      // Update profile state
      if (data.data) {
        setProfile(data.data);
        setFormData({
          ...formData,
          password: "",
          confirmPassword: "",
        });
      }

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 p-6 sm:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-zinc-400 text-center py-8">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-6 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>

        {/* Administration Details Section */}
        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Administration Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Name:</span>
              <span className="text-white font-medium">{profile?.name || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Email:</span>
              <span className="text-white font-medium">{profile?.email || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Account Created:</span>
              <span className="text-white font-medium">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Last Updated:</span>
              <span className="text-white font-medium">
                {profile?.updatedAt
                  ? new Date(profile.updatedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Update Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-zinc-700 bg-zinc-800 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-white mb-4">Update Profile</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Fill in the fields below to update your administration profile. Leave password fields empty if you don't want to change your password.
          </p>

          {error && (
            <div className="rounded-md bg-red-500/20 border border-red-500/30 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-md bg-emerald-500/20 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-400">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="profile-name" className="text-sm font-medium text-white">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="profile-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="profile-email" className="text-sm font-medium text-white">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="profile-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="profile-password" className="text-sm font-medium text-white">
                New Password
              </label>
              <input
                id="profile-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                placeholder="Leave empty to keep current password"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="profile-confirm-password" className="text-sm font-medium text-white">
                Confirm New Password
              </label>
              <input
                id="profile-confirm-password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="profile-image" className="text-sm font-medium text-white">
              Profile Image
            </label>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
              className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
            />
            {previewUrl && (
              <div className="relative w-full h-48 max-w-md rounded-md border border-zinc-600 overflow-hidden bg-zinc-900 mt-2">
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            {profile?.imageUrl && !previewUrl && (
              <div className="relative w-full h-48 max-w-md rounded-md border border-zinc-600 overflow-hidden bg-zinc-900 mt-2">
                <img
                  src={getImageUrl(profile.imageUrl)}
                  alt="Current profile"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

