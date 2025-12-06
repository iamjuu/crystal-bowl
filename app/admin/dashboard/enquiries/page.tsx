"use client";

import { config } from "@/middleware";
import { useState, useEffect } from "react";

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
      } else {
        alert(data.message || "Failed to update enquiry");
      }
    } catch (error) {
      console.error("Failed to update enquiry:", error);
      alert("Failed to update enquiry");
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
      } else {
        alert(data.message || "Failed to delete enquiry");
      }
    } catch (error) {
      console.error("Failed to delete enquiry:", error);
      alert("Failed to delete enquiry");
    } finally {
      setDeletingId(null);
    }
  };

  // Toggle expanded view
  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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

        {/* Stats */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            Total Enquiries: {enquiries.length} | Showing: {filteredEnquiries.length} for {activeTab}
          </div>
        </div>

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

