"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export function DebugAdminStatus() {
  const { user, permissions } = useAuth();

  useEffect(() => {
    if (user && permissions) {
      console.log("=== ADMIN DEBUG INFO ===");
      console.log("User ID:", user.uid);
      console.log("Email:", user.email);
      console.log("Is Admin:", permissions.isAdmin);
      console.log("Full Permissions:", permissions);
      console.log("======================");
    }
  }, [user, permissions]);

  return null;
}
