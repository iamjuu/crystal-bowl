"use client";

import { useState, useEffect } from "react";

type PastEvent = {
  _id: string;
  name: string;
  title: string;
  location: string;
  day: string;
  time: string;
  date: string;
  description: string;
  thumbnailImage: string;
  photos?: string[];
  videos?: string[];
  createdAt: string;
  updatedAt: string;
};

export default function PastEventsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    location: "",
    day: "",
    time: "",
    date: "",
    description: "",
    thumbnailImage: "" as string | File | null,
    photos: [] as string[],
    videos: [] as string[],
  });
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);
  const [pastEventsLoading, setPastEventsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch past events
  const fetchPastEvents = async () => {
    try {
      setPastEventsLoading(true);
      const response = await fetch("/api/admin/past-events");
      const data = await response.json();
      if (data.success && data.data) {
        setPastEvents(data.data);
      } else {
        setPastEvents([]);
      }
    } catch (error) {
      console.error("Failed to fetch past events:", error);
      setPastEvents([]);
    } finally {
      setPastEventsLoading(false);
    }
  };

  useEffect(() => {
    fetchPastEvents();
  }, []);

  // Normalize image URL for display
  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("data:image")) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `data:image/jpeg;base64,${url}`;
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this past event?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/past-events/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to delete past event");
      } else {
        setPastEvents(pastEvents.filter((e) => e._id !== id));
      }
    } catch {
      alert("Failed to delete past event");
    } finally {
      setDeletingId(null);
    }
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

  const handleThumbnailUpload = async (file: File | null) => {
    if (!file) {
      setFormData({ ...formData, thumbnailImage: "" });
      setThumbnailPreview("");
      return;
    }

    try {
      const base64String = await compressImageToBase64(file);
      setFormData({ ...formData, thumbnailImage: base64String });
      setThumbnailPreview(base64String);
    } catch (error) {
      console.error("Error compressing image:", error);
      setError("Failed to process thumbnail image");
    }
  };

  const handlePhotoUpload = async (file: File | null, index?: number) => {
    if (!file) return;

    if (formData.photos.length >= 6) {
      setError("Maximum 6 photos allowed");
      return;
    }

    try {
      const base64String = await compressImageToBase64(file);
      const newPhotos = index !== undefined && formData.photos[index]
        ? formData.photos.map((p, i) => i === index ? base64String : p)
        : [...formData.photos, base64String];
      
      setFormData({ ...formData, photos: newPhotos });
      setPhotoPreviews(newPhotos);
    } catch (error) {
      console.error("Error compressing photo:", error);
      setError("Failed to process photo");
    }
  };

  const handlePhotoRemove = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: newPhotos });
    setPhotoPreviews(newPhotos);
  };

  const handleVideoAdd = (url: string) => {
    if (formData.videos.length >= 2) {
      setError("Maximum 2 videos allowed");
      return;
    }
    if (!url.trim()) return;
    
    const newVideos = [...formData.videos, url.trim()];
    setFormData({ ...formData, videos: newVideos });
    setVideoPreviews(newVideos);
  };

  const handleVideoRemove = (index: number) => {
    const newVideos = formData.videos.filter((_, i) => i !== index);
    setFormData({ ...formData, videos: newVideos });
    setVideoPreviews(newVideos);
  };

  // Handle edit button click
  const handleEdit = (pastEvent: PastEvent) => {
    setEditingId(pastEvent._id);
    setShowAddForm(true);
    setFormData({
      name: pastEvent.name || "",
      title: pastEvent.title || "",
      location: pastEvent.location || "",
      day: pastEvent.day || "",
      time: pastEvent.time || "",
      date: pastEvent.date || "",
      description: pastEvent.description || "",
      thumbnailImage: pastEvent.thumbnailImage || "",
      photos: pastEvent.photos || [],
      videos: pastEvent.videos || [],
    });
    
    setThumbnailPreview(pastEvent.thumbnailImage ? getImageUrl(pastEvent.thumbnailImage) : "");
    setPhotoPreviews(pastEvent.photos?.map(p => getImageUrl(p)) || []);
    setVideoPreviews(pastEvent.videos || []);
    
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    if (!formData.title.trim()) {
      setError("Title is required");
      setLoading(false);
      return;
    }

    if (!formData.location.trim()) {
      setError("Location is required");
      setLoading(false);
      return;
    }

    if (!formData.day.trim()) {
      setError("Day is required");
      setLoading(false);
      return;
    }

    if (!formData.time.trim()) {
      setError("Time is required");
      setLoading(false);
      return;
    }

    if (!formData.date.trim()) {
      setError("Date is required");
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      setLoading(false);
      return;
    }

    if (!formData.thumbnailImage) {
      setError("Thumbnail image is required");
      setLoading(false);
      return;
    }

    try {
      const isEdit = !!editingId;
      const url = isEdit 
        ? `/api/admin/past-events/${editingId}`
        : `/api/admin/past-events`;
      
      // Prepare request body
      const requestBody: {
        name: string;
        title: string;
        location: string;
        day: string;
        time: string;
        date: string;
        description: string;
        thumbnailImage: string;
        photos: string[];
        videos: string[];
      } = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        location: formData.location.trim(),
        day: formData.day.trim(),
        time: formData.time.trim(),
        date: formData.date.trim(),
        description: formData.description.trim(),
        thumbnailImage: typeof formData.thumbnailImage === "string" ? formData.thumbnailImage : "",
        photos: formData.photos,
        videos: formData.videos,
      };

      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || `Failed to ${isEdit ? "update" : "create"} past event`);
      }

      setSuccess(`Past event ${isEdit ? "updated" : "created"} successfully!`);
      setFormData({ name: "", title: "", location: "", day: "", time: "", date: "", description: "", thumbnailImage: "", photos: [], videos: [] });
      setThumbnailPreview("");
      setPhotoPreviews([]);
      setVideoPreviews([]);
      setEditingId(null);
      
      // Refresh past events list
      await fetchPastEvents();
      
      setTimeout(() => {
        setShowAddForm(false);
        setSuccess(null);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setFormData({ name: "", title: "", location: "", day: "", time: "", date: "", description: "", thumbnailImage: "", photos: [], videos: [] });
    setThumbnailPreview("");
    setPhotoPreviews([]);
    setVideoPreviews([]);
    setEditingId(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-6 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-white mb-6">Past Events Management</h1>

        {/* Add Button */}
        {!showAddForm && (
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Add Past Event
            </button>
            {pastEvents.length > 0 && (
              <div className="text-sm text-zinc-400">
                Total Past Events: {pastEvents.length}
              </div>
            )}
          </div>
        )}

        {/* Past Events List */}
        {!showAddForm && (
          <div className="mt-6">
            {pastEventsLoading ? (
              <div className="text-zinc-400 text-center py-8">Loading past events...</div>
            ) : pastEvents.length === 0 ? (
              <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-10 text-center">
                <p className="text-zinc-400 mb-2">No past events found</p>
                <p className="text-zinc-500 text-sm mt-2">
                  Create your first past event using the Add button above.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-zinc-700 bg-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-sm">
                    <thead>
                      <tr className="border-b border-zinc-700 bg-zinc-900 text-left text-xs uppercase tracking-wide text-zinc-400">
                        <th className="px-6 py-3 font-medium">Thumbnail</th>
                        <th className="px-6 py-3 font-medium">Name</th>
                        <th className="px-6 py-3 font-medium">Title</th>
                        <th className="px-6 py-3 font-medium">Location</th>
                        <th className="px-6 py-3 font-medium">Date</th>
                        <th className="px-6 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pastEvents.map((pastEvent) => (
                        <tr key={pastEvent._id} className="border-b border-zinc-700 last:border-0 hover:bg-zinc-900/50 transition-colors">
                          <td className="px-6 py-4">
                            {pastEvent.thumbnailImage ? (
                              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-zinc-700 bg-zinc-900">
                                <img
                                  src={getImageUrl(pastEvent.thumbnailImage)}
                                  alt={pastEvent.title || "Past Event"}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="h-16 w-16 shrink-0 rounded-md border border-zinc-700 bg-zinc-900 flex items-center justify-center">
                                <span className="text-zinc-500 text-xs">No Image</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-white">{pastEvent.name || "N/A"}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-white">{pastEvent.title || "Untitled"}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-zinc-300">{pastEvent.location || "N/A"}</p>
                          </td>
                          <td className="px-6 py-4 text-zinc-400">
                            {pastEvent.date || "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(pastEvent)}
                                className="rounded-md border border-zinc-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-zinc-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(pastEvent._id)}
                                disabled={deletingId === pastEvent._id}
                                className="rounded-md border border-red-600 px-3 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-900/20 disabled:opacity-50"
                              >
                                {deletingId === pastEvent._id ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-zinc-700 bg-zinc-800 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {editingId ? "Edit" : "Add"} Past Event
              </h2>
              <button
                type="button"
                onClick={handleCancel}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

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
                <label htmlFor="past-event-name" className="text-sm font-medium text-white">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="past-event-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                  placeholder="Enter event name"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="past-event-title" className="text-sm font-medium text-white">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="past-event-title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                  placeholder="Enter event title"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="past-event-location" className="text-sm font-medium text-white">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="past-event-location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                  placeholder="Enter event location"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="past-event-date" className="text-sm font-medium text-white">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="past-event-date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="past-event-day" className="text-sm font-medium text-white">
                  Day <span className="text-red-500">*</span>
                </label>
                <input
                  id="past-event-day"
                  type="text"
                  required
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                  placeholder="e.g., Friday"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="past-event-time" className="text-sm font-medium text-white">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  id="past-event-time"
                  type="text"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                  placeholder="e.g., 07:00PM - 10:00PM"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="past-event-description" className="text-sm font-medium text-white">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="past-event-description"
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                placeholder="Enter event description"
              />
            </div>

            {/* Thumbnail Image (Required) */}
            <div className="space-y-1">
              <label htmlFor="past-event-thumbnail" className="text-sm font-medium text-white">
                Thumbnail Image <span className="text-red-500">*</span> (Required)
              </label>
              <input
                id="past-event-thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => handleThumbnailUpload(e.target.files?.[0] || null)}
                className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
              />
              {thumbnailPreview && (
                <div className="relative w-full h-48 max-w-md rounded-md border border-zinc-600 overflow-hidden bg-zinc-900 mt-2">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Photos (Optional, Max 6) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Photos (Optional, Maximum 6)
              </label>
              {formData.photos.length < 6 && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e.target.files?.[0] || null)}
                  className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                />
              )}
              {formData.photos.length >= 6 && (
                <p className="text-xs text-zinc-400">Maximum 6 photos reached</p>
              )}
              {photoPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <div className="relative w-full h-32 rounded-md border border-zinc-600 overflow-hidden bg-zinc-900">
                        <img
                          src={preview}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePhotoRemove(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Videos (Optional, Max 2) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Videos (Optional, Maximum 2) - Enter video URLs
              </label>
              {formData.videos.length < 2 && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter video URL"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleVideoAdd(e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                    className="flex-1 rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      if (input?.value) {
                        handleVideoAdd(input.value);
                        input.value = "";
                      }
                    }}
                    className="rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                  >
                    Add
                  </button>
                </div>
              )}
              {formData.videos.length >= 2 && (
                <p className="text-xs text-zinc-400">Maximum 2 videos reached</p>
              )}
              {videoPreviews.length > 0 && (
                <div className="space-y-2 mt-2">
                  {videoPreviews.map((video, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded-md border border-zinc-600 bg-zinc-900">
                      <span className="flex-1 text-sm text-white truncate">{video}</span>
                      <button
                        type="button"
                        onClick={() => handleVideoRemove(index)}
                        className="bg-red-600 text-white rounded px-2 py-1 text-xs hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (editingId ? "Updating..." : "Creating...") : (editingId ? "Update Past Event" : "Create Past Event")}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center justify-center rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

