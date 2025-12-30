"use client";

import { useAuth } from "@/contexts/AuthContext";
import { PillarGrid } from "@/components/dashboard/PillarGrid";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

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
      <div className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-[#146e96] hover:text-[#146e96]/80 transition-colors duration-200 mb-6"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base font-medium">Back to Home</span>
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1
                className="text-[40px] font-normal leading-tight tracking-tight text-[#111A4A] mb-3"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                  fontWeight: "400",
                }}
              >
                Welcome, {user?.displayName || "User"}
              </h1>
              <p
                className="text-lg leading-6 text-[#111A4A] opacity-60"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/profile")}
                className="border border-[#146e96] text-[#146e96] px-[18px] py-[15px] rounded-full text-base leading-4 font-semibold hover:bg-[#146e96] hover:text-white transition-all duration-200 cursor-pointer"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                  fontWeight: "500",
                }}
              >
                My Profile
              </button>
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="mb-12">
          <h2
            className="text-[32px] font-normal leading-tight tracking-tight text-[#111A4A] mb-3"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              fontWeight: "400",
            }}
          >
            Your Strategic Pillars
          </h2>
          <p
            className="text-lg leading-6 text-[#111A4A] opacity-60"
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
          <div className="bg-gradient-to-r from-[#146e96]/5 to-transparent border border-[#146e96]/10 rounded-2xl p-6 mt-12 flex items-start gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-[#146e96] shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span
              className="text-[#111A4A] opacity-60 text-base"
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
