"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

type TabType = "discovery" | "private" | "corporate";

type Enquiry = {
  _id: string;
  fullName: string;
  address: string;
  dateOfBirth: string;
  services: string;
  phone: string;
  email: string;
  comment?: string;
  status: "pending" | "contacted" | "completed";
  sessionType: "discovery" | "private" | "corporate";
  createdAt: string;
  updatedAt: string;
};

export default function EnquiriesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("discovery");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Add Slot form state
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [slotFormData, setSlotFormData] = useState({
    month: '',
    date: '',
    time: ''
  });
  const [submittingSlot, setSubmittingSlot] = useState(false);
  
  // Slots list state
  type Slot = {
    _id: string;
    sessionType: string;
    month: string;
    date: string;
    time: string;
    isBooked: boolean;
  };
  
  const [showSlotsList, setShowSlotsList] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);

  const tabs = [
    { id: "discovery" as TabType, label: "Discovery" },
    { id: "private" as TabType, label: "Private Session" },
    { id: "corporate" as TabType, label: "Corporate Sessions" },
  ];

  // Fetch enquiries
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/enquiries");
      const data = await response.json();
      console.log("Enquiries API response:", data);
      
      if (data.success && data.data) {
        setEnquiries(data.data);
      } else {
        console.error("Failed to fetch enquiries:", data.message);
        setEnquiries([]);
      }
    } catch (error) {
      console.error("Failed to fetch enquiries:", error);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Filter enquiries by active tab
  const filteredEnquiries = enquiries.filter((enquiry) => enquiry.sessionType === activeTab);

  // Handle status update
  const handleStatusUpdate = async (id: string, newStatus: "pending" | "contacted" | "completed") => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the local state
        setEnquiries((prev) =>
          prev.map((enq) =>
            enq._id === id ? { ...enq, status: newStatus } : enq
          )
        );
        toast.success("Enquiry status updated successfully");
      } else {
        toast.error(data.message || "Failed to update enquiry");
      }
    } catch (error) {
      console.error("Failed to update enquiry:", error);
      toast.error("Failed to update enquiry");
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/enquiries/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setEnquiries((prev) => prev.filter((enq) => enq._id !== id));
        toast.success("Enquiry deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete enquiry");
      }
    } catch (error) {
      console.error("Failed to delete enquiry:", error);
      toast.error("Failed to delete enquiry");
    } finally {
      setDeletingId(null);
    }
  };

  // Toggle expanded view
  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Handle slot form submission
  const handleSlotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingSlot(true);
    
    try {
      const response = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionType: activeTab, 
          ...slotFormData 
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Slot added successfully for ${activeTab} session!`);
        
        // Reset form
        setSlotFormData({ month: '', date: '', time: '' });
        setShowSlotForm(false);
        
        // Refresh slots list if it's visible
        if (showSlotsList) {
          fetchSlots();
        }
      } else {
        toast.error(data.message || 'Failed to add slot. Please try again.');
      }
    } catch (error) {
      console.error('Failed to add slot:', error);
      toast.error('Failed to add slot. Please try again.');
    } finally {
      setSubmittingSlot(false);
    }
  };

  // Handle slot form cancel
  const handleSlotCancel = () => {
    setSlotFormData({ month: '', date: '', time: '' });
    setShowSlotForm(false);
  };

  // Fetch slots
  const fetchSlots = async () => {
    try {
      setLoadingSlots(true);
      const response = await fetch(`/api/slots?sessionType=${activeTab}&showAll=true`);
      const data = await response.json();
      
      if (data.success) {
        setSlots(data.data || []);
      } else {
        console.error('Failed to fetch slots:', data.message);
        toast.error('Failed to fetch slots');
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Failed to fetch slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  // Handle show slots toggle
  const handleShowSlots = () => {
    if (!showSlotsList) {
      fetchSlots();
    }
    setShowSlotsList(!showSlotsList);
  };

  // Convert 24-hour time to 12-hour format
  const formatTime12Hour = (time24: string) => {
    if (!time24) return '';
    
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Handle delete slot
  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm('Are you sure you want to delete this slot?')) return;

    setDeletingSlotId(slotId);
    try {
      const response = await fetch(`/api/slots/${slotId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Slot deleted successfully');
        fetchSlots(); // Refresh the list
      } else {
        toast.error(data.message || 'Failed to delete slot');
      }
    } catch (error) {
      console.error('Failed to delete slot:', error);
      toast.error('Failed to delete slot');
    } finally {
      setDeletingSlotId(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-6 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-white mb-6">Yoga Sessions Enquiries</h1>

        {/* Tabs */}
        <div className="border-b border-zinc-800 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
                <span className="ml-2 text-xs">
                  ({enquiries.filter((e) => e.sessionType === tab.id).length})
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Stats & Slot Management Buttons */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-zinc-500">
            Total Enquiries: {enquiries.length} | Showing: {filteredEnquiries.length} for {activeTab}
          </div>
          
          {/* Slot Management Buttons - Only show for Discovery and Private */}
          {(activeTab === 'discovery' || activeTab === 'private') && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleShowSlots}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                {showSlotsList ? 'Hide Slots' : 'Show Slots'}
              </button>
              
              <button
                onClick={() => {
                  console.log('Add Slot button clicked, activeTab:', activeTab);
                  setShowSlotForm(!showSlotForm);
                }}
                className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                {showSlotForm ? 'Cancel' : 'Add Slot'}
              </button>
            </div>
          )}
        </div>

        {/* Add Slot Form */}
        {showSlotForm && (activeTab === 'discovery' || activeTab === 'private') && (
          <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Add Available Slot for {activeTab === 'discovery' ? 'Discovery' : 'Private'} Session
            </h2>
            
            <form onSubmit={handleSlotSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Month Selection */}
                <div>
                  <label htmlFor="month" className="block text-sm font-medium text-zinc-300 mb-2">
                    Month <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="month"
                    required
                    value={slotFormData.month}
                    onChange={(e) => setSlotFormData({ ...slotFormData, month: e.target.value })}
                    className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">Select Month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                </div>

                {/* Date Selection */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-zinc-300 mb-2">
                    Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="date"
                    type="date"
                    required
                    value={slotFormData.date}
                    onChange={(e) => setSlotFormData({ ...slotFormData, date: e.target.value })}
                    className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-zinc-300 mb-2">
                    Time <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="time"
                    required
                    value={slotFormData.time}
                    onChange={(e) => setSlotFormData({ ...slotFormData, time: e.target.value })}
                    className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">Select Time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="09:30">9:30 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="10:30">10:30 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="12:30">12:30 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="13:30">1:30 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="14:30">2:30 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="15:30">3:30 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="16:30">4:30 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="17:30">5:30 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="18:30">6:30 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="19:30">7:30 PM</option>
                    <option value="20:00">8:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submittingSlot}
                  className="rounded-md bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingSlot ? 'Adding...' : 'Add Slot'}
                </button>
                <button
                  type="button"
                  onClick={handleSlotCancel}
                  className="rounded-md border border-zinc-600 px-6 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Available Slots List */}
        {showSlotsList && (activeTab === 'discovery' || activeTab === 'private') && (
          <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Available Slots for {activeTab === 'discovery' ? 'Discovery' : 'Private'} Sessions
              </h2>
              <button
                onClick={fetchSlots}
                className="rounded-md bg-zinc-700 px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-600"
              >
                Refresh
              </button>
            </div>
            
            {loadingSlots ? (
              <div className="text-center py-8">
                <p className="text-zinc-400">Loading slots...</p>
              </div>
            ) : slots.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-zinc-400">No available slots found for {activeTab} sessions.</p>
                <p className="text-zinc-500 text-sm mt-2">Click &quot;Add Slot&quot; to create new slots.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-700 text-left text-xs uppercase tracking-wide text-zinc-400">
                      <th className="px-4 py-3 font-medium">Month</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Time</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((slot) => (
                      <tr
                        key={slot._id}
                        className="border-b border-zinc-700 last:border-0 hover:bg-zinc-900/50"
                      >
                        <td className="px-4 py-3 text-zinc-300">{slot.month}</td>
                        <td className="px-4 py-3 text-zinc-300">
                          {new Date(slot.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-3 text-zinc-300">{formatTime12Hour(slot.time)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            slot.isBooked 
                              ? 'bg-red-500/10 text-red-400' 
                              : 'bg-green-500/10 text-green-400'
                          }`}>
                            {slot.isBooked ? 'Booked' : 'Available'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteSlot(slot._id)}
                            disabled={deletingSlotId === slot._id || slot.isBooked}
                            className="rounded-md border border-red-600 px-3 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingSlotId === slot._id ? '...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 text-xs text-zinc-500">
                  Total Slots: {slots.length} | Available: {slots.filter(s => !s.isBooked).length} | Booked: {slots.filter(s => s.isBooked).length}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enquiries List */}
        <div className="mt-6">
          {loading ? (
            <div className="text-zinc-400 text-center py-8">Loading enquiries...</div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-10 text-center">
              <p className="text-zinc-400 mb-2">
                No {activeTab} enquiries found
              </p>
              <p className="text-zinc-500 text-sm mt-2">
                Total enquiries in database: {enquiries.length}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-700 bg-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-zinc-700 bg-zinc-900 text-left text-xs uppercase tracking-wide text-zinc-400">
                      <th className="px-6 py-3 font-medium">Name</th>
                      <th className="px-6 py-3 font-medium">Services</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Contact</th>
                      <th className="px-6 py-3 font-medium">Date Submitted</th>
                      <th className="px-6 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnquiries.map((enquiry) => (
                      <>
                        <tr
                          key={enquiry._id}
                          className="border-b border-zinc-700 last:border-0 cursor-pointer hover:bg-zinc-900/50"
                          onClick={() => toggleExpanded(enquiry._id)}
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-white">{enquiry.fullName}</p>
                              <p className="text-xs text-zinc-500 mt-1">DOB: {enquiry.dateOfBirth}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                              {enquiry.services}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                              enquiry.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                              enquiry.status === 'contacted' ? 'bg-blue-500/10 text-blue-400' :
                              'bg-yellow-500/10 text-yellow-400'
                            }`}>
                              {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs">
                              <p className="text-zinc-400">{enquiry.email}</p>
                              <p className="text-zinc-500 mt-1">{enquiry.phone}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-zinc-400">
                            {new Date(enquiry.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-2 flex-wrap">
                              {enquiry.status !== "contacted" && (
                                <button
                                  onClick={() => handleStatusUpdate(enquiry._id, "contacted")}
                                  disabled={updatingId === enquiry._id}
                                  className="rounded-md border border-blue-600 px-3 py-1 text-xs font-medium text-blue-400 transition-colors hover:bg-blue-900/20 disabled:opacity-50"
                                >
                                  {updatingId === enquiry._id ? "..." : "Mark Contacted"}
                                </button>
                              )}
                              {enquiry.status !== "completed" && (
                                <button
                                  onClick={() => handleStatusUpdate(enquiry._id, "completed")}
                                  disabled={updatingId === enquiry._id}
                                  className="rounded-md border border-green-600 px-3 py-1 text-xs font-medium text-green-400 transition-colors hover:bg-green-900/20 disabled:opacity-50"
                                >
                                  {updatingId === enquiry._id ? "..." : "Complete"}
                                </button>
                              )}
                              {enquiry.status !== "pending" && (
                                <button
                                  onClick={() => handleStatusUpdate(enquiry._id, "pending")}
                                  disabled={updatingId === enquiry._id}
                                  className="rounded-md border border-yellow-600 px-3 py-1 text-xs font-medium text-yellow-400 transition-colors hover:bg-yellow-900/20 disabled:opacity-50"
                                >
                                  {updatingId === enquiry._id ? "..." : "Mark Pending"}
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(enquiry._id)}
                                disabled={deletingId === enquiry._id}
                                className="rounded-md border border-red-600 px-3 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-900/20 disabled:opacity-50"
                              >
                                {deletingId === enquiry._id ? "..." : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {/* Expanded Details Row */}
                        {expandedId === enquiry._id && (
                          <tr className="border-b border-zinc-700 bg-zinc-900/50">
                            <td colSpan={6} className="px-6 py-4">
                              <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-zinc-500 mb-1">Full Name</p>
                                    <p className="text-sm text-white">{enquiry.fullName}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-zinc-500 mb-1">Date of Birth</p>
                                    <p className="text-sm text-white">{enquiry.dateOfBirth}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-zinc-500 mb-1">Email</p>
                                    <p className="text-sm text-white">{enquiry.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-zinc-500 mb-1">Phone</p>
                                    <p className="text-sm text-white">{enquiry.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-zinc-500 mb-1">Address</p>
                                    <p className="text-sm text-white">{enquiry.address}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-zinc-500 mb-1">Service Requested</p>
                                    <p className="text-sm text-white">{enquiry.services}</p>
                                  </div>
                                </div>
                                {enquiry.comment && (
                                  <div className="pt-2">
                                    <p className="text-xs text-zinc-500 mb-1">
                                      {enquiry.sessionType === 'discovery' ? 'Discovery Form Details' : 'Comment'}
                                    </p>
                                    <div className="text-sm text-zinc-300 bg-zinc-800 p-3 rounded-md">
                                      {enquiry.sessionType === 'discovery' ? (
                                        (() => {
                                          try {
                                            const discoveryData = JSON.parse(enquiry.comment);
                                            return (
                                              <div className="space-y-3">
                                                <div>
                                                  <p className="text-xs text-zinc-400 mb-1">Appointment Date & Time</p>
                                                  <p className="text-white">{discoveryData.selectedDate} at {discoveryData.selectedTime}</p>
                                                </div>
                                                <div>
                                                  <p className="text-xs text-zinc-400 mb-1">Has Crystal Bowls</p>
                                                  <p className="text-white">{discoveryData.hasCrystalBowls || 'Not specified'}</p>
                                                </div>
                                                {discoveryData.notesAndAlchemies && (
                                                  <div>
                                                    <p className="text-xs text-zinc-400 mb-1">Notes and Alchemies</p>
                                                    <p className="text-white">{discoveryData.notesAndAlchemies}</p>
                                                  </div>
                                                )}
                                                <div>
                                                  <p className="text-xs text-zinc-400 mb-1">Experience Level</p>
                                                  <p className="text-white">{discoveryData.experienceLevel?.join(', ') || 'Not specified'}</p>
                                                </div>
                                                <div>
                                                  <p className="text-xs text-zinc-400 mb-1">Main Intention</p>
                                                  <p className="text-white">{discoveryData.mainIntention?.join(', ') || 'Not specified'}</p>
                                                </div>
                                                {discoveryData.soundOrEnergy && (
                                                  <div>
                                                    <p className="text-xs text-zinc-400 mb-1">Sound or Energy Looking For</p>
                                                    <p className="text-white">{discoveryData.soundOrEnergy}</p>
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          } catch {
                                            return <p>{enquiry.comment}</p>;
                                          }
                                        })()
                                      ) : (
                                        <p>{enquiry.comment}</p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

