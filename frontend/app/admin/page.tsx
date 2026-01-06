"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Shield, Users, Search, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditUserPermissionsDialog } from "@/components/admin/EditUserPermissionsDialog";
import { AddUserDialog } from "@/components/admin/AddUserDialog";
import { DebugAdminStatus } from "@/components/admin/DebugAdminStatus";
import {
  getAllUserPermissions,
  getPillarAccessSummary,
} from "@/lib/firebase/user-management";
import type { UserPermissions } from "@/lib/types/auth.types";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const { user, permissions, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserPermissions[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserPermissions[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserPermissions | null>(
    null,
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [summary, setSummary] = useState<{ [key: string]: number }>({});

  const userIsAdmin = permissions?.isAdmin === true;

  // Redirect non-admin users
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    } else if (!loading && user && !userIsAdmin) {
      toast.error("Access denied. Admin privileges required.");
      router.push("/dashboard");
    }
  }, [user, loading, userIsAdmin, router]);

  // Load users
  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const [allUsers, accessSummary] = await Promise.all([
        getAllUserPermissions(),
        getPillarAccessSummary(),
      ]);
      setUsers(allUsers);
      setFilteredUsers(allUsers);
      setSummary(accessSummary);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users. Please refresh the page.");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (userIsAdmin) {
      loadUsers();
    }
  }, [userIsAdmin]);

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (u) =>
          u.email.toLowerCase().includes(query) ||
          u.userId.toLowerCase().includes(query),
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const handleEditUser = (user: UserPermissions) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    loadUsers();
  };

  // Show loading state while checking auth
  if (loading || !user || !userIsAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-[#404040]">
            {loading ? "Verifying admin access..." : "Redirecting..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <DebugAdminStatus />
      {/* Header */}
      <div className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() =>
              window.history.length > 1
                ? router.back()
                : router.push("/dashboard")
            }
            className="inline-flex items-center gap-2 text-[#146e96] hover:text-[#146e96]/80 transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base font-medium">Back</span>
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-10 h-10 text-[#146e96]" />
                <h1
                  className="text-[40px] font-normal leading-tight tracking-tight text-[#111A4A]"
                  style={{
                    fontWeight: "400",
                  }}
                >
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-lg leading-6 text-[#111A4A] opacity-60">
                Manage user permissions and access control
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-[#146e96] to-[#146e96]/80 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-3xl font-bold mb-1">
              {summary.totalUsers || 0}
            </p>
            <p className="text-sm opacity-80">
              Total Users
            </p>
          </div>

          <div className="bg-white border-2 border-[#146e96]/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-[#146e96]" />
            </div>
            <p className="text-3xl font-bold text-[#111A4A] mb-1">
              {summary.admins || 0}
            </p>
            <p className="text-sm text-[#111A4A] opacity-60">
              Administrators
            </p>
          </div>

          {[
            [1, 2, 3],
            [4, 5, 6],
          ].map((pillars, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6"
            >
              <p className="text-sm text-[#111A4A] opacity-60 mb-3">
                Pillar Access
              </p>
              <div className="space-y-1">
                {pillars.map((num) => (
                  <div
                    key={num}
                    className="flex items-center justify-between text-sm"
                  >
                    <span
                      className="text-[#111A4A] opacity-60"
                      style={{
                        fontFamily:
                          "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                      }}
                    >
                      P{num}:
                    </span>
                    <span
                      className="font-semibold text-[#111A4A]"
                      style={{
                        fontFamily:
                          "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                      }}
                    >
                      {summary[`pillar${num}`] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* User Management Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-2xl font-semibold text-[#111A4A] mb-2"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                User Permissions
              </h2>
              <p
                className="text-sm text-[#111A4A] opacity-60"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                Manage access levels for all users
              </p>
            </div>

            {/* Actions: Add User Button and Search Bar */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAddUserDialogOpen(true)}
                className="bg-[#146e96] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#146e96]/90 transition-all duration-200 flex items-center gap-2"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Add User
              </button>

              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#111A4A] opacity-40" />
                <input
                  type="text"
                  placeholder="Search by email or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#146e96] focus:border-transparent"
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Users Table */}
          {loadingUsers ? (
            <div className="flex items-center justify-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p
                className="text-[#111A4A] opacity-60"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                {searchQuery
                  ? "No users found matching your search"
                  : "No users found"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      style={{
                        fontFamily:
                          "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                        fontWeight: "600",
                      }}
                    >
                      Email
                    </TableHead>
                    <TableHead
                      style={{
                        fontFamily:
                          "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                        fontWeight: "600",
                      }}
                    >
                      Role
                    </TableHead>
                    <TableHead
                      style={{
                        fontFamily:
                          "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                        fontWeight: "600",
                      }}
                    >
                      Pillar Access
                    </TableHead>
                    <TableHead
                      style={{
                        fontFamily:
                          "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                        fontWeight: "600",
                      }}
                    >
                      Last Updated
                    </TableHead>
                    <TableHead
                      className="text-right"
                      style={{
                        fontFamily:
                          "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                        fontWeight: "600",
                      }}
                    >
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((userData) => (
                    <TableRow key={userData.userId}>
                      <TableCell
                        style={{
                          fontFamily:
                            "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-[#111A4A]">
                            {userData.email}
                          </span>
                          <span className="text-xs text-[#111A4A] opacity-40 font-mono">
                            {userData.userId.substring(0, 12)}...
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {userData.isAdmin ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#146e96]/10 text-[#146e96] text-xs font-semibold">
                            <Shield className="w-3 h-3" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-[#111A4A] text-xs font-medium">
                            User
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {userData.isAdmin ? (
                            <span
                              className="text-sm text-[#111A4A] opacity-60"
                              style={{
                                fontFamily:
                                  "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                              }}
                            >
                              All Pillars (6/6)
                            </span>
                          ) : (
                            <>
                              {[1, 2, 3, 4, 5, 6].map((num) => {
                                const pillarKey =
                                  `pillar${num}` as keyof typeof userData.pillars;
                                const hasAccess = userData.pillars[pillarKey];
                                return (
                                  <div
                                    key={num}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                      hasAccess
                                        ? "bg-[#146e96] text-white"
                                        : "bg-gray-200 text-gray-400"
                                    }`}
                                    title={`Pillar ${num}: ${hasAccess ? "Granted" : "Denied"}`}
                                  >
                                    {num}
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell
                        style={{
                          fontFamily:
                            "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                        }}
                      >
                        <span className="text-sm text-[#111A4A] opacity-60">
                          {new Date(userData.updatedAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => handleEditUser(userData)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#146e96] hover:bg-[#146e96]/5 rounded-lg transition-colors"
                          style={{
                            fontFamily:
                              "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                          }}
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Edit User Dialog */}
      <EditUserPermissionsDialog
        user={selectedUser}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleEditSuccess}
      />

      {/* Add User Dialog */}
      <AddUserDialog
        open={addUserDialogOpen}
        onOpenChange={setAddUserDialogOpen}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
