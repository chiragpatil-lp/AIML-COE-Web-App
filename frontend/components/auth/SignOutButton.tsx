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
      // Navigate to signin page
      router.push("/auth/signin");
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
      className="border border-[#202020] text-[#202020] px-[18px] py-[15px] rounded-full text-base leading-4 font-semibold transition-all duration-150 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] hover:rounded-2xl hover:bg-[#202020] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        fontFamily: "var(--font-plus-jakarta-sans), Plus Jakarta Sans",
      }}
    >
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
}
