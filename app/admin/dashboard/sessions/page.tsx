"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Calendar, Clock } from "lucide-react";

type TabType = "discovery" | "private" | "corporate";
type MediaType = "image" | "video" | null;

type Session = {
  _id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  sessionType?: "regular" | "corporate" | "private" | "discovery";
  format?: string;
  benefits?: string[];
  createdAt: string;
  updatedAt: string;
  // Discovery and Private session fields
  instructorName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  price?: number;
};

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("discovery");
  const [showAddForm, setShowAddForm] = useState(false);
  const [mediaType, setMediaType] = useState<MediaType>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "" as string | File | null,
    video: "" as string | File | null,
    format: "",
    benefits: [""],
    instructorName: "",
    duration: "",
    price: "",
    date: "",
    startTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedHour, setSelectedHour] = useState<number>(9);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [selectedAmPm, setSelectedAmPm] = useState<"AM" | "PM">("AM");

  // Helper function to convert 12-hour to 24-hour format
  const convertTo24Hour = (hour: number, minute: number, amPm: "AM" | "PM"): string => {
    let h24 = hour;
    if (amPm === "PM" && hour !== 12) h24 = hour + 12;
    if (amPm === "AM" && hour === 12) h24 = 0;
    return `${String(h24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  // Helper function to convert 24-hour to 12-hour format
  const convertTo12Hour = (time24: string): { hour: number; minute: number; amPm: "AM" | "PM" } => {
    if (!time24) return { hour: 9, minute: 0, amPm: "AM" };
    const [h, m] = time24.split(':').map(Number);
    let hour = h;
    let amPm: "AM" | "PM" = "AM";
    if (h === 0) {
      hour = 12;
    } else if (h === 12) {
      amPm = "PM";
    } else if (h > 12) {
      hour = h - 12;
      amPm = "PM";
    }
    return { hour, minute: m, amPm };
  };

  // Get Singapore time
  const getSingaporeDate = () => {
    const now = new Date();
    const singaporeTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Singapore" }));
    return singaporeTime;
  };

  // Calendar days generation
  const getCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0

    const days: Array<{ day: number; isCurrentMonth: boolean }> = [];
    
    // Previous month days
    const prevMonth = new Date(currentYear, currentMonth, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, isCurrentMonth: true });
    }

    // Next month days to fill the grid (6 weeks * 7 days = 42)
    const totalCells = 42;
    const remainingDays = totalCells - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ day, isCurrentMonth: false });
    }

    return days;
  };

  // Handle date selection
  const handleDateSelect = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    const selectedDate = new Date(currentYear, currentMonth, day);
    const dateStr = selectedDate.toISOString().split('T')[0];
    setFormData({ ...formData, date: dateStr });
    setShowCalendar(false);
  };

  // Handle time selection
  const handleTimeSelect = () => {
    const time24 = convertTo24Hour(selectedHour, selectedMinute, selectedAmPm);
    setFormData({ ...formData, startTime: time24 });
    setShowTimePicker(false);
  };

  // Initialize time picker when startTime changes
  useEffect(() => {
    if (formData.startTime) {
      const { hour, minute, amPm } = convertTo12Hour(formData.startTime);
      setSelectedHour(hour);
      setSelectedMinute(minute);
      setSelectedAmPm(amPm);
    }
  }, [formData.startTime]);

  // Close calendar/time picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowTimePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tabs = [
    { id: "discovery" as TabType, label: "Discovery" },
    { id: "private" as TabType, label: "Private Session" },
    { id: "corporate" as TabType, label: "Corporate Sessions" },
  ];

  // Fetch sessions
  const fetchSessions = async () => {
    try {
      setSessionsLoading(true);
      const response = await fetch("/api/sessions");
      const data = await response.json();
      console.log("Sessions API response:", data); // Debug log
      if (data.success && data.data) {
        console.log("Sessions loaded:", data.data.length); // Debug log
        setSessions(data.data);
      } else {
        console.error("Failed to fetch sessions:", data.message || "Unknown error");
        setSessions([]);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Filter sessions by active tab
  const getFilteredSessions = () => {
    if (sessions.length === 0) return [];
    
    let filtered: Session[] = [];
    if (activeTab === "discovery") {
      // Show sessions with no sessionType, "regular", "discovery", or undefined sessionType
      filtered = sessions.filter((s) => {
        return !s.sessionType || 
               s.sessionType === "regular" || 
               s.sessionType === "discovery" ||
               s.sessionType === undefined;
      });
    } else if (activeTab === "private") {
      filtered = sessions.filter((s) => s.sessionType === "private");
    } else if (activeTab === "corporate") {
      filtered = sessions.filter((s) => s.sessionType === "corporate");
    }
    
    console.log(`Filtered sessions for ${activeTab}:`, filtered.length, "out of", sessions.length);
    console.log("All sessions:", sessions);
    console.log("Filtered sessions:", filtered);
    
    return filtered;
  };

  const filteredSessions = getFilteredSessions();

  // Normalize image URL for display
  const getImageUrl = (session: Session) => {
    const img = session.imageUrl;
    if (!img) return "";
    if (img.startsWith("data:image")) return img;
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `data:image/jpeg;base64,${img}`;
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/sessions/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to delete session");
      } else {
        setSessions(sessions.filter((s) => s._id !== id));
      }
    } catch {
      alert("Failed to delete session");
    } finally {
      setDeletingId(null);
    }
  };

  const handleMediaTypeChange = (type: MediaType) => {
    setMediaType(type);
    setFormData({ ...formData, image: "", video: "" });
    setPreviewUrl("");
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

  const handleVideoUpload = (file: File | null) => {
    if (!file) {
      setFormData({ ...formData, video: "" });
      setPreviewUrl("");
      return;
    }

    // Check file size (limit to 20MB for base64 encoding to avoid memory issues)
    const MAX_SIZE = 20 * 1024 * 1024; // 20MB
    if (file.size > MAX_SIZE) {
      setError(`Video file is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 20MB. Please use a video URL instead (YouTube, Vimeo, etc.).`);
      setFormData({ ...formData, video: "" });
      setPreviewUrl("");
      return;
    }

    setError(null);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const videoUrl = e.target?.result as string;
        if (videoUrl) {
          setFormData({ ...formData, video: videoUrl });
          setPreviewUrl(videoUrl);
        } else {
          setError("Failed to read video file. The file may be corrupted.");
        }
      } catch (error) {
        console.error("Error processing video:", error);
        setError("Failed to process video file. Please try a smaller file or use a video URL.");
      }
    };
    
    reader.onerror = () => {
      setError("Failed to read video file. The file may be too large or corrupted. Please use a video URL instead.");
      setFormData({ ...formData, video: "" });
      setPreviewUrl("");
    };
    
    reader.onabort = () => {
      setError("Video upload was cancelled.");
      setFormData({ ...formData, video: "" });
      setPreviewUrl("");
    };

    try {
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error reading video file:", error);
      setError("Failed to read video file. Please use a video URL instead for large files.");
      setFormData({ ...formData, video: "" });
      setPreviewUrl("");
    }
  };

  const handleVideoUrlChange = (url: string) => {
    setFormData({ ...formData, video: url });
    setPreviewUrl(url);
  };

  // Handle benefits array
  const handleAddBenefit = () => {
    setFormData({ ...formData, benefits: [...formData.benefits, ""] });
  };

  const handleRemoveBenefit = (index: number) => {
    const newBenefits = formData.benefits.filter((_, i) => i !== index);
    setFormData({ ...formData, benefits: newBenefits.length > 0 ? newBenefits : [""] });
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({ ...formData, benefits: newBenefits });
  };

  // Handle edit button click
  const handleEdit = (session: Session) => {
    setEditingId(session._id);
    setShowAddForm(true);
    setFormData({
      title: session.title || "",
      description: session.description || "",
      image: session.imageUrl || "",
      video: session.videoUrl || "",
      format: session.format || "",
      benefits: session.benefits && session.benefits.length > 0 ? session.benefits : [""],
      instructorName: (session as any).instructorName || "",
      duration: (session as any).duration?.toString() || "",
      price: (session as any).price?.toString() || "",
      date: (session as any).date || "",
      startTime: (session as any).startTime || "",
    });
    
    // Set media type based on what exists
    if (session.imageUrl) {
      setMediaType("image");
      setPreviewUrl(getImageUrl(session));
    } else if (session.videoUrl) {
      setMediaType("video");
      setPreviewUrl(session.videoUrl);
    } else {
      setMediaType(null);
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

    if (!formData.title.trim()) {
      setError("Title is required");
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      setLoading(false);
      return;
    }

    if (mediaType === "image" && !formData.image) {
      setError("Please upload an image");
      setLoading(false);
      return;
    }

    if (mediaType === "video" && !formData.video) {
      setError("Please upload a video or enter a video URL");
      setLoading(false);
      return;
    }

    if (!mediaType) {
      setError("Please choose either Image or Video");
      setLoading(false);
      return;
    }

    try {
      const isEdit = !!editingId;
      const url = isEdit 
        ? `/api/sessions/${editingId}`
        : `/api/admin/sessions`;
      
      const method = isEdit ? "PATCH" : "POST";

      // Prepare request body
      const requestBody: {
        title: string;
        description: string;
        sessionType: TabType;
        imageUrl?: string;
        videoUrl?: string;
        format?: string;
        benefits?: string[];
        instructorName?: string;
        duration?: number;
        price?: number;
        date?: string;
        startTime?: string;
      } = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        sessionType: activeTab,
        format: formData.format.trim() || undefined,
        benefits: formData.benefits.filter(b => b.trim().length > 0),
      };

      // Add new fields conditionally
      if (activeTab === "discovery" || activeTab === "private") {
        requestBody.instructorName = formData.instructorName.trim();
        requestBody.duration = Number(formData.duration);
        requestBody.date = formData.date;
        requestBody.startTime = formData.startTime;
      }

      if (activeTab === "private") {
        requestBody.price = Number(formData.price);
      }

      if (isEdit) {
        // When editing, preserve existing media if not changed, or update if new media is provided
        const currentSession = sessions.find(s => s._id === editingId);
        if (mediaType === "image") {
          requestBody.imageUrl = typeof formData.image === "string" ? formData.image : undefined;
          // Clear video if switching from video to image
          if (currentSession?.videoUrl) {
            requestBody.videoUrl = "";
          }
        } else if (mediaType === "video") {
          requestBody.videoUrl = typeof formData.video === "string" ? formData.video : undefined;
          // Clear image if switching from image to video
          if (currentSession?.imageUrl) {
            requestBody.imageUrl = "";
          }
        }
      } else {
        // When creating, only set the selected media type
        if (mediaType === "image") {
          requestBody.imageUrl = typeof formData.image === "string" ? formData.image : undefined;
        } else if (mediaType === "video") {
          requestBody.videoUrl = typeof formData.video === "string" ? formData.video : undefined;
        }
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
        throw new Error(data.message || `Failed to ${isEdit ? "update" : "create"} session`);
      }

      setSuccess(`Session ${isEdit ? "updated" : "created"} successfully!`);
      setFormData({ 
        title: "", 
        description: "", 
        image: "", 
        video: "", 
        format: "", 
        benefits: [""],
        instructorName: "",
        duration: "",
        price: "",
        date: "",
        startTime: "",
      });
      setMediaType(null);
      setPreviewUrl("");
      setEditingId(null);
      
      // Refresh sessions list
      await fetchSessions();
      
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
    setFormData({ 
      title: "", 
      description: "", 
      image: "", 
      video: "", 
      format: "", 
      benefits: [""],
      instructorName: "",
      duration: "",
      price: "",
      date: "",
      startTime: "",
    });
    setMediaType(null);
    setPreviewUrl("");
    setEditingId(null);
    setError(null);
    setSuccess(null);
  };


  return (
    <div className="min-h-screen bg-zinc-900 p-6 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-white mb-6">Yoga Sessions Management</h1>

        {/* Tabs */}
        <div className="border-b border-zinc-800 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowAddForm(false);
                  setFormData({ 
                    title: "", 
                    description: "", 
                    image: "", 
                    video: "", 
                    format: "", 
                    benefits: [""],
                    instructorName: "",
                    duration: "",
                    price: "",
                    date: "",
                    startTime: "",
                  });
                  setMediaType(null);
                  setPreviewUrl("");
                  setError(null);
                  setSuccess(null);
                }}
                className={`
                  whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors
                  ${
                    activeTab === tab.id
                      ? "border-emerald-500 text-emerald-400"
                      : "border-transparent text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <div className="text-xs text-zinc-500">
            Total Sessions: {sessions.length} | Showing: {filteredSessions.length} for {activeTab}
          </div>
        </div>


        {/* Add Button and Debug Info */}
        {!showAddForm && (
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Add {tabs.find(t => t.id === activeTab)?.label}
            </button>
            {sessions.length > 0 && (
              <div className="text-xs text-zinc-500">
                Total: {sessions.length} sessions | Showing: {filteredSessions.length} for {activeTab}
              </div>
            )}
          </div>
        )}

        {/* Sessions List */}
        {!showAddForm && (
          <div className="mt-6">
            {sessionsLoading ? (
              <div className="text-zinc-400 text-center py-8">Loading sessions...</div>
            ) : filteredSessions.length === 0 ? (
              <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-10 text-center">
                <p className="text-zinc-400 mb-2">No {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} sessions found</p>
                {sessions.length > 0 && (
                  <p className="text-zinc-500 text-sm mt-2">
                    Total sessions in database: {sessions.length} (showing filtered results for {activeTab})
                  </p>
                )}
                {sessions.length === 0 && (
                  <p className="text-zinc-500 text-sm mt-2">Create your first session using the Add button above.</p>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-zinc-700 bg-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="border-b border-zinc-700 bg-zinc-900 text-left text-xs uppercase tracking-wide text-zinc-400">
                        <th className="px-6 py-3 font-medium">Media</th>
                        <th className="px-6 py-3 font-medium">Title</th>
                        {(activeTab === "discovery" || activeTab === "private") ? (
                          <>
                            <th className="px-6 py-3 font-medium">Date & Time</th>
                            <th className="px-6 py-3 font-medium">Instructor</th>
                          </>
                        ) : (
                          <th className="px-6 py-3 font-medium">Description</th>
                        )}
                        <th className="px-6 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSessions.map((session) => (
                        <tr key={session._id} className="border-b border-zinc-700 last:border-0">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {session.imageUrl && (
                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-zinc-700 bg-zinc-900">
                                  <img
                                    src={getImageUrl(session)}
                                    alt={session.title || "Session"}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                </div>
                              )}
                              {session.videoUrl && !session.imageUrl && (
                                <div className="h-16 w-16 flex-shrink-0 rounded-md border border-zinc-700 bg-zinc-900 flex items-center justify-center">
                                  <span className="text-zinc-400 text-xs">🎥</span>
                                </div>
                              )}
                              {!session.imageUrl && !session.videoUrl && (
                                <div className="h-16 w-16 flex-shrink-0 rounded-md border border-zinc-700 bg-zinc-900 flex items-center justify-center">
                                  <span className="text-zinc-500 text-xs">No Media</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-white">{session.title || "Untitled Session"}</p>
                              {session.videoUrl && (
                                <span className="text-xs text-zinc-500" title="Has video">
                                  🎥
                                </span>
                              )}
                            </div>
                          </td>
                          {(activeTab === "discovery" || activeTab === "private") ? (
                            <>
                              <td className="px-6 py-4 text-zinc-400">
                                {session.date && session.startTime ? (
                                  <div className="text-xs">
                                    <div className="font-medium text-white">
                                      {new Date(session.date + 'T00:00:00').toLocaleDateString('en-US', {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        timeZone: 'Asia/Singapore'
                                      })}
                                    </div>
                                    <div className="text-zinc-500 mt-1">
                                      {(() => {
                                        const { hour, minute, amPm } = convertTo12Hour(session.startTime);
                                        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${amPm}`;
                                      })()}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-zinc-500 text-xs">Not set</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {session.instructorName ? (
                                  <p className="text-xs text-white font-medium">
                                    {session.instructorName}
                                  </p>
                                ) : (
                                  <span className="text-zinc-500 text-xs">Not set</span>
                                )}
                              </td>
                            </>
                          ) : (
                            <td className="px-6 py-4">
                              {session.description ? (
                                <p className="line-clamp-2 text-xs text-zinc-400 max-w-md">
                                  {session.description}
                                </p>
                              ) : (
                                <span className="text-zinc-500 text-xs">No description</span>
                              )}
                            </td>
                          )}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(session)}
                                className="rounded-md border border-zinc-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-zinc-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(session._id)}
                                disabled={deletingId === session._id}
                                className="rounded-md border border-red-600 px-3 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-900/20 disabled:opacity-50"
                              >
                                {deletingId === session._id ? "Deleting..." : "Delete"}
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
                {editingId ? "Edit" : "Add"} {tabs.find(t => t.id === activeTab)?.label}
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

            <div className="space-y-1">
              <label htmlFor="session-title" className="text-sm font-medium text-white">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="session-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                placeholder="Enter session title"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-white">
                Media Type <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleMediaTypeChange("image")}
                  className={`
                    flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors
                    ${
                      mediaType === "image"
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                        : "border-zinc-600 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                    }
                  `}
                >
                  Image
                </button>
                <button
                  type="button"
                  onClick={() => handleMediaTypeChange("video")}
                  className={`
                    flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors
                    ${
                      mediaType === "video"
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                        : "border-zinc-600 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                    }
                  `}
                >
                  Video
                </button>
              </div>
            </div>

            {mediaType === "image" && (
              <div className="space-y-1">
                <label htmlFor="session-image" className="text-sm font-medium text-white">
                  Image <span className="text-red-500">*</span>
                </label>
                <input
                  id="session-image"
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
            )}

            {mediaType === "video" && (
              <div className="space-y-1">
                <label htmlFor="session-video" className="text-sm font-medium text-white">
                  Video <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-zinc-400 mb-2">
                  Upload a video file (max 20MB) or enter a video URL (YouTube, Vimeo, etc.). For larger files, use a video URL.
                </p>
                <input
                  id="session-video-file"
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleVideoUpload(e.target.files?.[0] || null)}
                  className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none mb-2"
                />
                <input
                  id="session-video-url"
                  type="text"
                  value={typeof formData.video === "string" && !formData.video.startsWith("data:") ? formData.video : ""}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                  placeholder="Or enter video URL (e.g., https://youtube.com/watch?v=...)"
                />
                {previewUrl && (
                  <div className="relative w-full h-48 max-w-md rounded-md border border-zinc-600 overflow-hidden bg-zinc-900 mt-2">
                    {previewUrl.startsWith("data:") ? (
                      <video src={previewUrl} controls className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        Video URL: {previewUrl}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="session-description" className="text-sm font-medium text-white">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="session-description"
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                placeholder="Enter session description"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="session-format" className="text-sm font-medium text-white">
                Format
              </label>
              <input
                id="session-format"
                type="text"
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                placeholder="Enter session format (e.g., Online, In-person, Hybrid)"
              />
            </div>

            {/* Instructor Name - For Discovery and Private */}
            {(activeTab === "discovery" || activeTab === "private") && (
              <div className="space-y-1">
                <label htmlFor="instructor-name" className="text-sm font-medium text-white">
                  Instructor Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="instructor-name"
                  type="text"
                  required={activeTab === "discovery" || activeTab === "private"}
                  value={formData.instructorName}
                  onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                  className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                  placeholder="Enter instructor name"
                />
              </div>
            )}

            {/* Duration - For Discovery and Private */}
            {(activeTab === "discovery" || activeTab === "private") && (
              <div className="space-y-1">
                <label htmlFor="duration" className="text-sm font-medium text-white">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <select
                  id="duration"
                  required={activeTab === "discovery" || activeTab === "private"}
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                >
                  <option value="">Select Duration</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour (60 minutes)</option>
                  <option value="90">1.5 hours (90 minutes)</option>
                  <option value="120">2 hours (120 minutes)</option>
                </select>
              </div>
            )}

            {/* Price - For Private Only */}
            {activeTab === "private" && (
              <div className="space-y-1">
                <label htmlFor="price" className="text-sm font-medium text-white">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  type="number"
                  required={activeTab === "private"}
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                  placeholder="Enter price in dollars"
                />
              </div>
            )}

            {/* Date - For Discovery and Private */}
            {(activeTab === "discovery" || activeTab === "private") && (
              <div className="space-y-1 relative">
                <label htmlFor="date" className="text-sm font-medium text-white">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="date"
                    type="text"
                    required={activeTab === "discovery" || activeTab === "private"}
                    value={formData.date ? new Date(formData.date + 'T00:00:00').toLocaleDateString('en-US', { 
                      month: '2-digit', 
                      day: '2-digit', 
                      year: 'numeric',
                      timeZone: 'Asia/Singapore'
                    }) : ""}
                    readOnly
                    onClick={() => setShowCalendar(!showCalendar)}
                    placeholder="mm/dd/yyyy"
                    className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 pr-10 text-sm text-white focus:border-white focus:outline-none cursor-pointer"
                  />
                  <Calendar 
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" 
                  />
                </div>
                
                {/* Calendar Picker */}
                {showCalendar && (
                  <div 
                    ref={calendarRef}
                    className="absolute z-50 mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl p-4 w-80"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => {
                          if (currentMonth === 0) {
                            setCurrentMonth(11);
                            setCurrentYear(currentYear - 1);
                          } else {
                            setCurrentMonth(currentMonth - 1);
                          }
                        }}
                        className="p-1 hover:bg-zinc-700 rounded"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <h3 className="text-white font-semibold">
                        {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h3>
                      <button
                        onClick={() => {
                          if (currentMonth === 11) {
                            setCurrentMonth(0);
                            setCurrentYear(currentYear + 1);
                          } else {
                            setCurrentMonth(currentMonth + 1);
                          }
                        }}
                        className="p-1 hover:bg-zinc-700 rounded"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <div key={day} className="text-center text-xs text-zinc-400 font-medium py-1">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {getCalendarDays().map(({ day, isCurrentMonth }, idx) => {
                        const dateStr = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
                        const isSelected = formData.date === dateStr;
                        const today = new Date();
                        const isToday = day === today.getDate() && 
                                       currentMonth === today.getMonth() && 
                                       currentYear === today.getFullYear() &&
                                       isCurrentMonth;
                        const isPast = isCurrentMonth && new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                        return (
                          <button
                            key={idx}
                            onClick={() => !isPast && handleDateSelect(day, isCurrentMonth)}
                            disabled={isPast || !isCurrentMonth}
                            className={`
                              p-2 text-sm rounded
                              ${!isCurrentMonth ? 'text-zinc-600' : ''}
                              ${isPast ? 'text-zinc-600 cursor-not-allowed' : 'text-white hover:bg-zinc-700 cursor-pointer'}
                              ${isSelected ? 'bg-white text-zinc-900 font-semibold' : ''}
                              ${isToday && !isSelected ? 'ring-2 ring-zinc-500' : ''}
                            `}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Start Time - For Discovery and Private */}
            {(activeTab === "discovery" || activeTab === "private") && (
              <div className="space-y-1 relative">
                <label htmlFor="start-time" className="text-sm font-medium text-white">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="start-time"
                    type="text"
                    required={activeTab === "discovery" || activeTab === "private"}
                    value={formData.startTime ? (() => {
                      const { hour, minute, amPm } = convertTo12Hour(formData.startTime);
                      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${amPm}`;
                    })() : ""}
                    readOnly
                    onClick={() => setShowTimePicker(!showTimePicker)}
                    placeholder="--:-- --"
                    className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 pr-10 text-sm text-white focus:border-white focus:outline-none cursor-pointer"
                  />
                  <Clock 
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" 
                  />
                </div>

                {/* Time Picker */}
                {showTimePicker && (
                  <div 
                    ref={timePickerRef}
                    className="absolute z-50 mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl p-4 w-64"
                  >
                    <div className="flex items-center justify-center gap-4 mb-4">
                      {/* Hour */}
                      <div className="flex flex-col items-center">
                        <label className="text-xs text-zinc-400 mb-2">Hour</label>
                        <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                            <button
                              key={hour}
                              onClick={() => setSelectedHour(hour)}
                              className={`px-3 py-1 rounded text-sm ${
                                selectedHour === hour
                                  ? 'bg-white text-zinc-900 font-semibold'
                                  : 'text-white hover:bg-zinc-700'
                              }`}
                            >
                              {String(hour).padStart(2, '0')}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Minute */}
                      <div className="flex flex-col items-center">
                        <label className="text-xs text-zinc-400 mb-2">Minute</label>
                        <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                          {[0, 15, 30, 45].map(minute => (
                            <button
                              key={minute}
                              onClick={() => setSelectedMinute(minute)}
                              className={`px-3 py-1 rounded text-sm ${
                                selectedMinute === minute
                                  ? 'bg-white text-zinc-900 font-semibold'
                                  : 'text-white hover:bg-zinc-700'
                              }`}
                            >
                              {String(minute).padStart(2, '0')}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* AM/PM */}
                      <div className="flex flex-col items-center">
                        <label className="text-xs text-zinc-400 mb-2">Period</label>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => setSelectedAmPm("AM")}
                            className={`px-3 py-1 rounded text-sm ${
                              selectedAmPm === "AM"
                                ? 'bg-white text-zinc-900 font-semibold'
                                : 'text-white hover:bg-zinc-700'
                            }`}
                          >
                            AM
                          </button>
                          <button
                            onClick={() => setSelectedAmPm("PM")}
                            className={`px-3 py-1 rounded text-sm ${
                              selectedAmPm === "PM"
                                ? 'bg-white text-zinc-900 font-semibold'
                                : 'text-white hover:bg-zinc-700'
                            }`}
                          >
                            PM
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={handleTimeSelect}
                        className="flex-1 bg-white text-zinc-900 py-2 rounded font-medium hover:bg-zinc-100 transition"
                      >
                        Set Time
                      </button>
                      <button
                        onClick={() => setShowTimePicker(false)}
                        className="flex-1 bg-zinc-700 text-white py-2 rounded font-medium hover:bg-zinc-600 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-white">
                Benefits
              </label>
              <div className="space-y-2">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                      className="flex-1 rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                      placeholder={`Benefit ${index + 1}`}
                    />
                    {formData.benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(index)}
                        className="rounded-md border border-red-600 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/20"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddBenefit}
                  className="inline-flex items-center justify-center rounded-md border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-900/20"
                >
                  + Add Benefit
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (editingId ? "Updating..." : "Creating...") : (editingId ? "Update Session" : "Create Session")}
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

