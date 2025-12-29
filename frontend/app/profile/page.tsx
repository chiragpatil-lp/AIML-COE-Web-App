"use client";

import { useAuth } from "@/contexts/AuthContext";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function ProfilePage() {
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
            {loading ? "Loading your profile..." : "Redirecting to sign in..."}
          </p>
        </div>
      </div>
    );
  }

  // Determine access level display
  const getAccessLevel = () => {
    if (permissions?.isAdmin) {
      return "Administrator";
    }
    const pillarCount = Object.values(permissions?.pillars || {}).filter(
      Boolean,
    ).length;
    if (pillarCount === 0) {
      return "Limited Access";
    }
    return `${pillarCount} Pillar${pillarCount > 1 ? "s" : ""}`;
  };

  const getAccessLevelBadgeClass = () => {
    if (permissions?.isAdmin) {
      return "badge-success";
    }
    const pillarCount = Object.values(permissions?.pillars || {}).filter(
      Boolean,
    ).length;
    if (pillarCount === 0) {
      return "badge-warning";
    }
    return "badge-info";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#e9e9e9] shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <h1
              className="text-3xl font-bold text-[#202020]"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              }}
            >
              My Profile
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="border border-[#202020] text-[#202020] px-[18px] py-[15px] rounded-full text-base leading-4 font-semibold transition-all duration-150 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] hover:bg-[#202020] hover:text-white cursor-pointer"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                Back to Dashboard
              </button>
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Profile Card */}
        <div className="bg-[#e9e9e9] rounded-[40px] p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Picture */}
            <div className="shrink-0">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  width={128}
                  height={128}
                  className="rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-[#202020] text-white flex items-center justify-center text-4xl font-bold shadow-lg">
                  {(user.displayName || user.email || "U")[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* User Information */}
            <div className="flex-1 space-y-6 text-center md:text-left">
              {/* Name */}
              <div>
                <h2
                  className="text-3xl font-bold text-[#202020] mb-1"
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                  }}
                >
                  {user.displayName || "User"}
                </h2>
                <p
                  className="text-lg text-[#404040]"
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                  }}
                >
                  {user.email}
                </p>
              </div>

              {/* Access Level */}
              <div>
                <label
                  className="text-sm font-semibold text-[#404040] uppercase tracking-wider mb-2 block"
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                  }}
                >
                  Access Level
                </label>
                <span
                  className={`badge ${getAccessLevelBadgeClass()} badge-lg font-semibold`}
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                  }}
                >
                  {getAccessLevel()}
                </span>
              </div>

              {/* Pillar Access Details */}
              {!permissions?.isAdmin && (
                <div>
                  <label
                    className="text-sm font-semibold text-[#404040] uppercase tracking-wider mb-3 block"
                    style={{
                      fontFamily:
                        "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                    }}
                  >
                    Pillar Access
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(permissions?.pillars || {}).map(
                      ([key, hasAccess]) => {
                        const pillarNames: Record<string, string> = {
                          pillar1: "Strategy & Value Realization",
                          pillar2: "Innovation & IP Development",
                          pillar3: "Platforms & Engineering",
                          pillar4: "People & Capability Enablement",
                          pillar5: "COE Delivery Governance",
                          pillar6: "Communication & Market Intelligence",
                        };
                        return (
                          <div
                            key={key}
                            className={`flex items-center gap-2 p-3 rounded-2xl ${
                              hasAccess
                                ? "bg-white border border-green-200"
                                : "bg-[#d9d9d9]"
                            }`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${
                                hasAccess ? "bg-green-500" : "bg-[#808080]"
                              }`}
                            />
                            <span
                              className={`text-sm font-medium ${
                                hasAccess ? "text-[#202020]" : "text-[#606060]"
                              }`}
                              style={{
                                fontFamily:
                                  "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                              }}
                            >
                              {pillarNames[key]}
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Request Additional Access Section */}
        <div className="mt-8 bg-[#e9e9e9] rounded-[40px] p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3
                className="text-xl font-bold text-[#202020] mb-2"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                Need More Access?
              </h3>
              <p
                className="text-[#404040]"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                Request access to additional pillars or features. Your
                administrator will review your request.
              </p>
            </div>
            <button
              disabled
              className="border border-[#202020] text-[#202020] px-[18px] py-[15px] rounded-full text-base leading-4 font-semibold transition-all duration-150 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] hover:bg-[#202020] hover:text-white cursor-not-allowed opacity-50"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              }}
              title="This feature is coming soon"
            >
              Request Additional Access
            </button>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-8 bg-[#e9e9e9] rounded-[40px] p-8 shadow-xl">
          <h3
            className="text-xl font-bold text-[#202020] mb-6"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="text-sm font-semibold text-[#404040] uppercase tracking-wider mb-2 block"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                User ID
              </label>
              <p
                className="text-[#202020] font-mono text-sm break-all bg-white px-4 py-2 rounded-2xl"
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                }}
              >
                {user.uid}
              </p>
            </div>
            <div>
              <label
                className="text-sm font-semibold text-[#404040] uppercase tracking-wider mb-2 block"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                Account Created
              </label>
              <p
                className="text-[#202020] bg-white px-4 py-2 rounded-2xl"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                {permissions?.createdAt
                  ? new Date(permissions.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
