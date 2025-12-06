"use client";

import Image from "next/image";
import { useState } from "react";

type ProductFormProps = {
  productId?: string;
  initialData?: {
    name?: string;
    description?: string;
    price?: string;
    imageUrl?: string[];
    videoUrl?: string | string[];
  };
  onComplete?: () => void;
  onCancel?: () => void;
};

export default function ProductForm({ productId, initialData, onComplete, onCancel }: ProductFormProps) {
  const isEdit = !!productId;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    images: initialData?.imageUrl || [] as string[],
    videos: Array.isArray(initialData?.videoUrl) 
      ? initialData.videoUrl 
      : initialData?.videoUrl 
        ? [initialData.videoUrl] 
        : [] as string[],
  });

  // Helper to convert base64 string to data URL if needed
  const normalizeImageUrl = (url: string): string => {
    if (!url) return "";
    if (url.startsWith("data:image")) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `data:image/jpeg;base64,${url}`;
  };

  const [uploadedImages, setUploadedImages] = useState<string[]>(() => {
    const existing = initialData?.imageUrl || [];
    return existing.map(normalizeImageUrl);
  });

  // Track number of image fields to show (max 3)
  const MAX_IMAGES = 3;
  const [imageFieldCount, setImageFieldCount] = useState(() => {
    const existing = initialData?.imageUrl || [];
    return Math.max(1, Math.min(MAX_IMAGES, existing.length)); // At least 1 field, max 3
  });

  // Helper to normalize video URL
  const normalizeVideoUrl = (url: string): string => {
    if (!url) return "";
    if (url.startsWith("data:video")) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `data:video/mp4;base64,${url}`;
  };

  // Track number of video fields to show (max 2)
  const MAX_VIDEOS = 2;
  const [videoFieldCount, setVideoFieldCount] = useState(() => {
    const existing = Array.isArray(initialData?.videoUrl) 
      ? initialData.videoUrl 
      : initialData?.videoUrl 
        ? [initialData.videoUrl] 
        : [];
    return Math.max(0, Math.min(MAX_VIDEOS, existing.length)); // Max 2 videos
  });

  const [uploadedVideos, setUploadedVideos] = useState<string[]>(() => {
    const existing = Array.isArray(initialData?.videoUrl) 
      ? initialData.videoUrl 
      : initialData?.videoUrl 
        ? [initialData.videoUrl] 
        : [];
    return existing.map(normalizeVideoUrl);
  });

  // Helper function to compress and convert image to base64
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

  const handleImageUpload = async (index: number, file: File | null) => {
    if (!file) {
      const newImages = [...uploadedImages];
      const newFormImages = [...formData.images];
      newImages.splice(index, 1);
      newFormImages.splice(index, 1);
      setUploadedImages(newImages);
      setFormData({ ...formData, images: newFormImages });
      
      // If removing the last image and there are multiple fields, reduce field count
      if (index === imageFieldCount - 1 && imageFieldCount > 1) {
        setImageFieldCount(imageFieldCount - 1);
      }
      return;
    }

    try {
      const base64String = await compressImageToBase64(file);
      const newImages = [...uploadedImages];
      const newFormImages = [...formData.images];
      
      while (newImages.length <= index) {
        newImages.push("");
        newFormImages.push("");
      }
      
      newImages[index] = base64String;
      newFormImages[index] = base64String;
      
      setUploadedImages(newImages);
      setFormData({ ...formData, images: newFormImages });
    } catch (error) {
      console.error("Error compressing image:", error);
      alert("Failed to process image. Please try again.");
    }
  };

  const handleAddImageField = () => {
    if (imageFieldCount < MAX_IMAGES) {
      setImageFieldCount(imageFieldCount + 1);
    } else {
      alert(`Maximum ${MAX_IMAGES} images allowed`);
    }
  };

  const handleVideoUpload = (index: number, file: File | null) => {
    if (!file) {
      const newVideos = [...uploadedVideos];
      const newFormVideos = [...formData.videos];
      newVideos.splice(index, 1);
      newFormVideos.splice(index, 1);
      setUploadedVideos(newVideos);
      setFormData({ ...formData, videos: newFormVideos });
      
      // If removing the last video and there are multiple fields, reduce field count
      if (index === videoFieldCount - 1 && videoFieldCount > 0) {
        setVideoFieldCount(videoFieldCount - 1);
      }
      return;
    }

    // Check file size (limit to 50MB for base64 encoding)
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_SIZE) {
      alert("Video file is too large. Maximum size is 50MB. Consider using a video URL instead.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newVideos = [...uploadedVideos];
      const newFormVideos = [...formData.videos];
      
      while (newVideos.length <= index) {
        newVideos.push("");
        newFormVideos.push("");
      }
      
      newVideos[index] = base64String;
      newFormVideos[index] = base64String;
      
      setUploadedVideos(newVideos);
      setFormData({ ...formData, videos: newFormVideos });
    };
    reader.onerror = () => {
      alert("Failed to read video file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleAddVideoField = () => {
    if (videoFieldCount < MAX_VIDEOS) {
      setVideoFieldCount(videoFieldCount + 1);
    } else {
      alert(`Maximum ${MAX_VIDEOS} videos allowed`);
    }
  };

  const handleVideoUrlChange = (index: number, url: string) => {
    const newVideos = [...uploadedVideos];
    const newFormVideos = [...formData.videos];
    
    while (newVideos.length <= index) {
      newVideos.push("");
      newFormVideos.push("");
    }
    
    newVideos[index] = url;
    newFormVideos[index] = url;
    
    setUploadedVideos(newVideos);
    setFormData({ ...formData, videos: newFormVideos });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Product name is required");
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      setLoading(false);
      return;
    }

    if (!formData.price || Number.parseFloat(formData.price) <= 0) {
      setError("Valid price is required");
      setLoading(false);
      return;
    }

    if (formData.images.length === 0) {
      setError("At least one image is required");
      setLoading(false);
      return;
    }

    if (formData.images.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed`);
      setLoading(false);
      return;
    }

    if (formData.videos.length > MAX_VIDEOS) {
      setError(`Maximum ${MAX_VIDEOS} videos allowed`);
      setLoading(false);
      return;
    }

    try {
      const url = isEdit 
        ? `/api/admin/products/${productId}`
        : `/api/admin/products`;
      
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: formData.price,
          imageUrl: formData.images,
          videoUrl: formData.videos.length > 0 ? formData.videos : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save product");
      }

      setSuccess(isEdit ? "Product updated successfully!" : "Product created successfully!");
      
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-zinc-700 bg-zinc-800 p-6 shadow-sm">
      <div className="space-y-1">
        <label htmlFor="product-name" className="text-sm font-medium text-white">
          Product name <span className="text-red-500">*</span>
        </label>
        <input
          id="product-name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
          placeholder="Crystal Healing Bowl"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="product-description" className="text-sm font-medium text-white">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="product-description"
          rows={3}
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
          placeholder="Short product summary..."
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="product-price" className="text-sm font-medium text-white">
          Price (₹) <span className="text-red-500">*</span>
        </label>
        <input
          id="product-price"
          type="number"
          step="0.01"
          min="0"
          required
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
          placeholder="2999.00"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-white">
          Product Images <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-zinc-400 mb-2">
          At least one image is required. Maximum {MAX_IMAGES} images allowed.
        </p>
        <div className="space-y-4">
          {Array.from({ length: imageFieldCount }).map((_, index) => (
            <div key={index} className="space-y-2">
              <label
                htmlFor={`product-image-file-${index}`}
                className="block text-xs text-zinc-400"
              >
                {index === 0 ? "Main Image" : `Image ${index + 1}`}
              </label>
              <input
                id={`product-image-file-${index}`}
                type="file"
                accept="image/*"
                className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleImageUpload(index, file);
                }}
              />
              {uploadedImages[index] && (
                <div className="relative  w-full h-32 max-w-[200px] rounded-md border border-zinc-600 overflow-hidden  bg-zinc-900">
                  <Image
                    src={normalizeImageUrl(uploadedImages[index])}
                    alt={index === 0 ? "Main Preview" : `Preview ${index + 1}`}
                    width={200}
                    height={128}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleImageUpload(index, null)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ))}
          {imageFieldCount < MAX_IMAGES && (
            <button
              type="button"
              onClick={handleAddImageField}
              className="inline-flex items-center justify-center rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              + Add Image ({imageFieldCount}/{MAX_IMAGES})
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-white">
          Product Videos (Optional)
        </label>
        <p className="text-xs text-zinc-400 mb-2">
          Upload video files (max 50MB each) or enter video URLs (YouTube, Vimeo, etc.). Maximum {MAX_VIDEOS} videos allowed.
        </p>
        <div className="space-y-4">
          {Array.from({ length: videoFieldCount }).map((_, index) => (
            <div key={index} className="space-y-2">
              <label
                htmlFor={`product-video-file-${index}`}
                className="block text-xs text-zinc-400"
              >
                Video {index + 1}
              </label>
              <input
                id={`product-video-file-${index}`}
                type="file"
                accept="video/*"
                className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleVideoUpload(index, file);
                }}
              />
              <input
                id={`product-video-url-${index}`}
                type="text"
                value={uploadedVideos[index] && !uploadedVideos[index].startsWith("data:") ? uploadedVideos[index] : ""}
                onChange={(e) => {
                  handleVideoUrlChange(index, e.target.value);
                }}
                className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                placeholder="Or enter video URL (e.g., https://youtube.com/watch?v=...)"
              />
              {uploadedVideos[index] && (
                <div className="relative w-full rounded-md border border-zinc-600 overflow-hidden bg-zinc-900">
                  {uploadedVideos[index].startsWith("data:video") ? (
                    <video
                      src={normalizeVideoUrl(uploadedVideos[index])}
                      controls
                      className="w-full max-h-64 object-contain"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : uploadedVideos[index].startsWith("http://") || uploadedVideos[index].startsWith("https://") ? (
                    <div className="p-4 text-sm text-zinc-400">
                      Video URL: <span className="text-white break-all">{uploadedVideos[index]}</span>
                    </div>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleVideoUpload(index, null)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                    title="Remove video"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ))}
          {videoFieldCount < MAX_VIDEOS && (
            <button
              type="button"
              onClick={handleAddVideoField}
              className="inline-flex items-center justify-center rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              + Add Video ({videoFieldCount}/{MAX_VIDEOS})
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-900/50 border border-red-500 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-900/50 border border-green-500 px-3 py-2 text-sm text-green-200">
          {success}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update Product" : "Create Product"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

