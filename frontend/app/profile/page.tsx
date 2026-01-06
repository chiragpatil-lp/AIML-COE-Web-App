"use client";

import { useAuth } from "@/contexts/AuthContext";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

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
      <div className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[#146e96] hover:text-[#146e96]/80 transition-colors duration-200 mb-6"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base font-medium">Back</span>
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
                My Profile
              </h1>
              <p
                className="text-lg leading-6 text-[#111A4A] opacity-60"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                Manage your account settings and access permissions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Profile Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Picture */}
            <div className="shrink-0">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  width={128}
                  height={128}
                  className="rounded-full ring-4 ring-[#146e96]/10 ring-offset-2"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#146e96] to-[#146e96]/80 text-white flex items-center justify-center text-4xl font-bold ring-4 ring-[#146e96]/10 ring-offset-2">
                  {(user.displayName || user.email || "U")[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* User Information */}
            <div className="flex-1 space-y-6 text-center md:text-left">
              {/* Name */}
              <div>
                <h2
                  className="text-[32px] font-normal leading-tight tracking-tight text-[#111A4A] mb-2"
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                    fontWeight: "400",
                  }}
                >
                  {user.displayName || "User"}
                </h2>
                <p
                  className="text-lg leading-6 text-[#111A4A] opacity-60"
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
                  className="text-sm font-medium text-[#111A4A] opacity-60 uppercase tracking-wider mb-3 block"
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                  }}
                >
                  Access Level
                </label>
                <span
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#146e96]/10 text-[#146e96] border border-[#146e96]/20"
                  style={{
                    fontFamily:
                      "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                    fontWeight: "500",
                  }}
                >
                  {getAccessLevel()}
                </span>
              </div>

              {/* Pillar Access Details */}
              {!permissions?.isAdmin && (
                <div>
                  <label
                    className="text-sm font-medium text-[#111A4A] opacity-60 uppercase tracking-wider mb-4 block"
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
                            className={`flex items-center gap-2.5 p-3.5 rounded-xl transition-all duration-200 ${
                              hasAccess
                                ? "bg-gradient-to-r from-[#146e96]/5 to-transparent border border-[#146e96]/20"
                                : "bg-gray-50 border border-gray-100 opacity-50"
                            }`}
                          >
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${
                                hasAccess ? "bg-[#146e96]" : "bg-gray-300"
                              }`}
                            />
                            <span
                              className={`text-sm font-medium ${
                                hasAccess
                                  ? "text-[#111A4A]"
                                  : "text-[#111A4A] opacity-60"
                              }`}
                              style={{
                                fontFamily:
                                  "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                                fontWeight: "500",
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
        <div className="mt-8 bg-gradient-to-r from-[#146e96]/5 to-transparent border border-[#146e96]/10 rounded-2xl p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex-1">
              <h3
                className="text-2xl font-normal leading-tight tracking-tight text-[#111A4A] mb-2"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                  fontWeight: "400",
                }}
              >
                Need More Access?
              </h3>
              <p
                className="text-base leading-6 text-[#111A4A] opacity-60"
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
              className="border border-[#146e96] text-[#146e96] px-[18px] py-[15px] rounded-full text-base leading-4 font-semibold transition-all duration-200 cursor-not-allowed opacity-50"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                fontWeight: "500",
              }}
              title="This feature is coming soon"
            >
              Request Access
            </button>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-8 bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
          <h3
            className="text-2xl font-normal leading-tight tracking-tight text-[#111A4A] mb-8"
            style={{
              fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
              fontWeight: "400",
            }}
          >
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label
                className="text-sm font-medium text-[#111A4A] opacity-60 uppercase tracking-wider mb-3 block"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                User ID
              </label>
              <p
                className="text-[#111A4A] font-mono text-sm break-all bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl"
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                }}
              >
                {user.uid}
              </p>
            </div>
            <div>
              <label
                className="text-sm font-medium text-[#111A4A] opacity-60 uppercase tracking-wider mb-3 block"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
                }}
              >
                Account Created
              </label>
              <p
                className="text-[#111A4A] bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl"
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
