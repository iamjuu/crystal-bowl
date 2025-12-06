"use client";

import { useState, useEffect } from "react";

type Event = {
  _id: string;
  name: string;
  title: string;
  location: string;
  day: string;
  time: string;
  date: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export default function EventsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    location: "",
    day: "",
    time: "",
    date: "",
    description: "",
    image: "" as string | File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch events
  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      const response = await fetch("/api/admin/events");
      const data = await response.json();
      if (data.success && data.data) {
        setEvents(data.data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Normalize image URL for display
  const getImageUrl = (event: Event) => {
    const img = event.imageUrl;
    if (!img) return "";
    if (img.startsWith("data:image")) return img;
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `data:image/jpeg;base64,${img}`;
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to delete event");
      } else {
        setEvents(events.filter((e) => e._id !== id));
      }
    } catch {
      alert("Failed to delete event");
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

  // Handle edit button click
  const handleEdit = (event: Event) => {
    setEditingId(event._id);
    setShowAddForm(true);
    setFormData({
      name: event.name || "",
      title: event.title || "",
      location: event.location || "",
      day: event.day || "",
      time: event.time || "",
      date: event.date || "",
      description: event.description || "",
      image: event.imageUrl || "",
    });
    
    if (event.imageUrl) {
      setPreviewUrl(getImageUrl(event));
    } else {
      setPreviewUrl("");
    }
    
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

    try {
      const isEdit = !!editingId;
      const url = isEdit 
        ? `/api/admin/events/${editingId}`
        : `/api/admin/events`;
      
      const method = isEdit ? "PATCH" : "POST";

      // Prepare request body
      const requestBody: {
        name: string;
        title: string;
        location: string;
        day: string;
        time: string;
        date: string;
        description: string;
        imageUrl?: string;
      } = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        location: formData.location.trim(),
        day: formData.day.trim(),
        time: formData.time.trim(),
        date: formData.date.trim(),
        description: formData.description.trim(),
      };

      if (formData.image) {
        requestBody.imageUrl = typeof formData.image === "string" ? formData.image : undefined;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || `Failed to ${isEdit ? "update" : "create"} event`);
      }

      setSuccess(`Event ${isEdit ? "updated" : "created"} successfully!`);
      setFormData({ name: "", title: "", location: "", day: "", time: "", date: "", description: "", image: "" });
      setPreviewUrl("");
      setEditingId(null);
      
      // Refresh events list
      await fetchEvents();
      
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
    setFormData({ name: "", title: "", location: "", day: "", time: "", date: "", description: "", image: "" });
    setPreviewUrl("");
    setEditingId(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-6 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-white mb-6">Events Management</h1>

        {/* Add Button */}
        {!showAddForm && (
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Add Event
            </button>
            {events.length > 0 && (
              <div className="text-sm text-zinc-400">
                Total Events: {events.length}
              </div>
            )}
          </div>
        )}

        {/* Events List */}
        {!showAddForm && (
          <div className="mt-6">
            {eventsLoading ? (
              <div className="text-zinc-400 text-center py-8">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-10 text-center">
                <p className="text-zinc-400 mb-2">No events found</p>
                <p className="text-zinc-500 text-sm mt-2">
                  Create your first event using the Add button above.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-zinc-700 bg-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-sm">
                    <thead>
                      <tr className="border-b border-zinc-700 bg-zinc-900 text-left text-xs uppercase tracking-wide text-zinc-400">
                        <th className="px-6 py-3 font-medium">Image</th>
                        <th className="px-6 py-3 font-medium">Name</th>
                        <th className="px-6 py-3 font-medium">Title</th>
                        <th className="px-6 py-3 font-medium">Location</th>
                        <th className="px-6 py-3 font-medium">Date</th>
                        <th className="px-6 py-3 font-medium">Day</th>
                        <th className="px-6 py-3 font-medium">Time</th>
                        <th className="px-6 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr key={event._id} className="border-b border-zinc-700 last:border-0 hover:bg-zinc-900/50 transition-colors">
                          <td className="px-6 py-4">
                            {event.imageUrl ? (
                              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-zinc-700 bg-zinc-900">
                                <img
                                  src={getImageUrl(event)}
                                  alt={event.title || "Event"}
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
                            <p className="font-medium text-white">{event.name || "N/A"}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-white">{event.title || "Untitled"}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-zinc-300">{event.location || "N/A"}</p>
                          </td>
                          <td className="px-6 py-4 text-zinc-400">
                            {event.date || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-zinc-400">
                            {event.day || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-zinc-400">
                            {event.time || "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(event)}
                                className="rounded-md border border-zinc-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-zinc-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(event._id)}
                                disabled={deletingId === event._id}
                                className="rounded-md border border-red-600 px-3 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-900/20 disabled:opacity-50"
                              >
                                {deletingId === event._id ? "Deleting..." : "Delete"}
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
                {editingId ? "Edit" : "Add"} Event
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
                <label htmlFor="event-name" className="text-sm font-medium text-white">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="event-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                  placeholder="Enter event name"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="event-title" className="text-sm font-medium text-white">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="event-title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                  placeholder="Enter event title"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="event-location" className="text-sm font-medium text-white">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="event-location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                  placeholder="Enter event location"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="event-date" className="text-sm font-medium text-white">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="event-date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="event-day" className="text-sm font-medium text-white">
                  Day <span className="text-red-500">*</span>
                </label>
                <input
                  id="event-day"
                  type="text"
                  required
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                  placeholder="e.g., Friday"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="event-time" className="text-sm font-medium text-white">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  id="event-time"
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
              <label htmlFor="event-image" className="text-sm font-medium text-white">
                Image
              </label>
              <input
                id="event-image"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
              />
              {previewUrl && (
                <div className="relative w-full h-48 max-w-md rounded-md border border-zinc-600 overflow-hidden bg-zinc-900 mt-2">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="event-description" className="text-sm font-medium text-white">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="event-description"
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                placeholder="Enter event description"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (editingId ? "Updating..." : "Creating...") : (editingId ? "Update Event" : "Create Event")}
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

