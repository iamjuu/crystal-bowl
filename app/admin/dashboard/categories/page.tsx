"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Package, Image as ImageIcon, Star } from "lucide-react";
import toast from "react-hot-toast";

type Category = {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    image: "" as string | File | null,
    isFeatured: false 
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [featuredCount, setFeaturedCount] = useState(0);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      console.log("Categories API response:", data); // Debug log
      if (data.success) {
        console.log("Categories data:", data.data); // Debug log
        setCategories(data.data);
        // Count featured categories
        const featured = data.data.filter((cat: Category) => cat.isFeatured === true).length;
        console.log("Featured count:", featured); // Debug log
        setFeaturedCount(featured);
      } else {
        toast.error(data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Debug: Log formData changes
  useEffect(() => {
    if (showAddForm) {
      console.log("Form data state:", formData);
      console.log("Preview URL:", previewUrl);
      console.log("Editing category:", editingCategory);
    }
  }, [formData, previewUrl, editingCategory, showAddForm]);

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("data:image")) return imageUrl;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
    // If it's a base64 string without data: prefix, add it
    if (imageUrl.length > 100 && !imageUrl.includes("://")) {
      return `data:image/jpeg;base64,${imageUrl}`;
    }
    return imageUrl;
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
      toast.error("Failed to process image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    // Check featured limit
    if (formData.isFeatured) {
      const currentFeaturedCount = editingCategory && editingCategory.isFeatured 
        ? featuredCount // If editing and already featured, count stays same
        : featuredCount + 1; // If adding new featured or changing to featured, add 1
      
      if (currentFeaturedCount > 4) {
        toast.error("Maximum 4 featured categories allowed. Please unfeature another category first.");
        return;
      }
    }

    setSubmitting(true);

    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory._id}`
        : "/api/admin/categories";
      
      const method = editingCategory ? "PUT" : "POST";

      // ALWAYS explicitly send all fields
      const requestBody: any = {
        name: formData.name,
        isFeatured: formData.isFeatured === true, // Explicitly set boolean (true or false)
        imageUrl: "", // Default to empty string
      };

      // Handle image URL - ALWAYS set it
      if (formData.image && typeof formData.image === "string" && formData.image.length > 0) {
        // New image uploaded or existing image preserved
        requestBody.imageUrl = formData.image;
      } else if (editingCategory && editingCategory.imageUrl && !formData.image) {
        // When editing, preserve existing image if no new one uploaded
        requestBody.imageUrl = editingCategory.imageUrl;
      }
      // Otherwise imageUrl stays as empty string (which will be saved in DB)
      
      console.log("Sending request body:", JSON.stringify({
        ...requestBody,
        imageUrl: requestBody.imageUrl ? `${requestBody.imageUrl.substring(0, 50)}...` : "empty"
      }, null, 2)); // Debug log (truncate image for readability)
      console.log("isFeatured being sent:", requestBody.isFeatured, "Type:", typeof requestBody.isFeatured); // Debug log

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || `Category ${editingCategory ? 'updated' : 'created'} successfully`);
        setFormData({ name: "", image: "", isFeatured: false });
        setPreviewUrl("");
        setShowAddForm(false);
        setEditingCategory(null);
        fetchCategories();
      } else {
        toast.error(data.message || `Failed to ${editingCategory ? 'update' : 'create'} category`);
      }
    } catch (error) {
      console.error("Error submitting category:", error);
      toast.error(`Failed to ${editingCategory ? 'update' : 'create'} category`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    console.log("Editing category:", category); // Debug log
    console.log("Category isFeatured:", category.isFeatured, "Type:", typeof category.isFeatured); // Debug log
    console.log("Category imageUrl:", category.imageUrl); // Debug log
    
    setEditingCategory(category);
    
    // Preserve existing image if available
    const existingImageUrl = category.imageUrl ? getImageUrl(category.imageUrl) : "";
    console.log("Existing image URL:", existingImageUrl); // Debug log
    
    // Handle isFeatured - it's already a boolean, just check if it's true
    const isFeaturedValue = category.isFeatured === true;
    console.log("Setting isFeatured to:", isFeaturedValue); // Debug log
    
    // Reset form data completely
    const newFormData = { 
      name: category.name || "", 
      image: category.imageUrl || "", // Preserve existing image URL
      isFeatured: Boolean(isFeaturedValue) // Force to boolean
    };
    
    console.log("Setting form data to:", newFormData); // Debug log
    
    setFormData(newFormData);
    setPreviewUrl(existingImageUrl);
    setShowAddForm(true);
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Category deleted successfully");
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingCategory(null);
    setFormData({ name: "", image: "", isFeatured: false });
    setPreviewUrl("");
  };

  const handleFeaturedChange = (checked: boolean) => {
    if (checked) {
      // Check if we can add another featured category
      const willExceedLimit = editingCategory && editingCategory.isFeatured
        ? featuredCount > 4 // Already featured, won't change count
        : featuredCount >= 4; // Adding new featured, check if at limit
      
      if (willExceedLimit) {
        toast.error("Maximum 4 featured categories allowed. Please unfeature another category first.");
        return;
      }
    }
    setFormData({ ...formData, isFeatured: checked });
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-6 sm:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Categories Management</h1>
            <p className="text-zinc-400 mt-1">
              Manage product categories {featuredCount > 0 && `(${featuredCount}/4 featured)`}
            </p>
          </div>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="mb-8 bg-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="e.g., Crystal Bowls, Healing Tools, Accessories"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white"
                />
                {previewUrl && (
                  <div className="mt-4 relative w-full h-48 max-w-md rounded-md border border-zinc-600 overflow-hidden bg-zinc-900">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Image load error:", previewUrl);
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    {editingCategory && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, image: "" });
                          setPreviewUrl("");
                        }}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
                {editingCategory && editingCategory.imageUrl && !previewUrl && (
                  <div className="mt-2 text-sm text-zinc-400">
                    Current image will be preserved. Upload a new image to replace it.
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured === true}
                  onChange={(e) => {
                    console.log("Checkbox changed to:", e.target.checked); // Debug log
                    handleFeaturedChange(e.target.checked);
                  }}
                  className="w-4 h-4 text-[#D5B584] bg-zinc-700 border-zinc-600 rounded focus:ring-[#D5B584] focus:ring-2"
                />
                <label htmlFor="isFeatured" className="flex items-center gap-2 text-sm font-medium text-zinc-300 cursor-pointer">
                  <Star className={`w-4 h-4 ${formData.isFeatured ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400'}`} />
                  Featured Category {featuredCount >= 4 && !formData.isFeatured && "(Maximum 4 reached)"}
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-white text-zinc-900 rounded-md font-medium hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-zinc-700 text-white rounded-md font-medium hover:bg-zinc-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        {loading ? (
          <div className="text-zinc-400 text-center py-12">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 bg-zinc-800 rounded-lg">
            <Package className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg mb-2">No categories yet</p>
            <p className="text-zinc-500 text-sm">Create your first category to organize products</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-zinc-800 rounded-lg overflow-hidden hover:bg-zinc-750 transition-colors"
              >
                {/* Category Image */}
                {category.imageUrl && (
                  <div className="relative w-full h-48 bg-zinc-900">
                    <img
                      src={getImageUrl(category.imageUrl)}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Category image load error:", category.imageUrl);
                        e.currentTarget.style.display = "none";
                      }}
                      onLoad={() => {
                        console.log("Category image loaded successfully:", category.imageUrl);
                      }}
                    />
                  </div>
                )}
                {!category.imageUrl && (
                  <div className="relative w-full h-48 bg-zinc-900 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-zinc-600" />
                  </div>
                )}
                
                <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">
                      {category.name}
                    </h3>
                        {category.isFeatured && (
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        )}
                      </div>
                    <p className="text-xs text-zinc-500">
                      Slug: {category.slug}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                      title="Edit category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id, category.name)}
                      className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="text-xs text-zinc-500">
                  Created {new Date(category.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
