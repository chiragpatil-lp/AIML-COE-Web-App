"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export function DebugAdminStatus() {
  const { user, permissions } = useAuth();

  useEffect(() => {
    if (user && permissions) {
      // PII: Debug logging disabled to prevent exposing user data in production
      // Uncomment only for local debugging if needed
      /*
      console.log("=== ADMIN DEBUG INFO ===");
      console.log("User ID:", user.uid);
      console.log("Email:", user.email);
      console.log("Is Admin:", permissions.isAdmin);
      console.log("Full Permissions:", permissions);
      console.log("======================");
      */
      console.log("=== ADMIN DEBUG INFO ===");
      console.log("Is Admin:", permissions.isAdmin);
      console.log("Pillars Access:", Object.values(permissions.pillars).filter(Boolean).length);
      console.log("======================");
    }
  }, [user, permissions]);

  return null;
}
