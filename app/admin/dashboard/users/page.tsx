"use client";

import { useState, useEffect } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  registered: boolean;
  phone?: string;
  createdAt: string;
  updatedAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      
      if (data.success && data.data) {
        setUsers(data.data);
      } else {
        setError(data.message || "Failed to fetch users");
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to fetch users. Please try again.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 p-6 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Users Management</h1>
          {users.length > 0 && (
            <div className="text-sm text-zinc-400">
              Total Users: {users.length}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-500/20 border border-red-500/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Users List */}
        <div className="mt-6">
          {loading ? (
            <div className="text-zinc-400 text-center py-8">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-10 text-center">
              <p className="text-zinc-400 mb-2">No users found</p>
              <p className="text-zinc-500 text-sm mt-2">
                Users will appear here once they register.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-700 bg-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-sm">
                  <thead>
                    <tr className="border-b border-zinc-700 bg-zinc-900 text-left text-xs uppercase tracking-wide text-zinc-400">
                      <th className="px-6 py-3 font-medium">Name</th>
                      <th className="px-6 py-3 font-medium">Email</th>
                      <th className="px-6 py-3 font-medium">Phone</th>
                      <th className="px-6 py-3 font-medium">Role</th>
                      <th className="px-6 py-3 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-zinc-700 last:border-0 hover:bg-zinc-900/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-white">{user.name || "N/A"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-zinc-300">{user.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-zinc-400">
                            {user.phone || (
                              <span className="text-zinc-500 italic">Not provided</span>
                            )}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-400 capitalize">
                            {user.role || "user"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-zinc-400">
                          {new Date(user.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
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

