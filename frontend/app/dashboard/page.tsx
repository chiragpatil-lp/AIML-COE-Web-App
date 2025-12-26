"use client";

import { useAuth } from "@/contexts/AuthContext";
import { PillarGrid } from "@/components/dashboard/PillarGrid";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, permissions, loading } = useAuth();
  const router = useRouter();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  // Show loading state while checking auth or redirecting
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p
            className="text-[#404040]"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            {loading
              ? "Loading your dashboard..."
              : "Redirecting to sign in..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#e9e9e9] shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-3xl font-bold text-[#202020]"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                Welcome, {user?.displayName || "User"}
              </h1>
              <p
                className="text-[#404040] mt-1"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                {permissions?.isAdmin ? (
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="badge badge-success badge-sm"
                      style={{
                        fontFamily:
                          "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                      }}
                    >
                      Administrator
                    </span>
                    <span>{user?.email}</span>
                  </span>
                ) : (
                  <span>{user?.email}</span>
                )}
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h2
            className="text-2xl font-semibold mb-2 text-[#202020]"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            Your Strategic Pillars
          </h2>
          <p
            className="text-[#404040]"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            Access your assigned strategic pillars below. Click on any pillar to
            open it in a new tab.
          </p>
        </div>

        <PillarGrid />

        {/* Info Banner */}
        {!permissions?.isAdmin && (
          <div className="bg-[#e9e9e9] rounded-[40px] p-6 mt-8 flex items-start gap-4 shadow-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-[#404040] shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span
              className="text-[#404040]"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              }}
            >
              Need access to additional pillars? Contact your administrator.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
