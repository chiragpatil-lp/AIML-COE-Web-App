"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SignOutButton() {
  const { signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Success toast is shown in AuthContext
      // Navigate to root page
      router.push("/");
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to sign out";
      console.error("Sign-out error:", errorMsg);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="bg-[#f35959ff] text-white px-[18px] py-[15px] rounded-full text-base leading-4 font-semibold hover:bg-[#f35959ff]/90 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
        fontWeight: "500",
      }}
    >
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
}
