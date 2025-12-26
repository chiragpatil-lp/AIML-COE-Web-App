"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import type { AuthContextType, UserPermissions } from "@/lib/types/auth.types";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType>({
  user: null,
  permissions: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  hasAccessToPillar: () => false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

interface FirestoreUserPermissions {
  userId: string;
  email: string;
  isAdmin: boolean;
  pillars: {
    pillar1: boolean;
    pillar2: boolean;
    pillar3: boolean;
    pillar4: boolean;
    pillar5: boolean;
    pillar6: boolean;
  };
  createdAt?: { toDate(): Date } | Date;
  updatedAt?: { toDate(): Date } | Date;
}

/**
 * Type guard to validate Firestore user permissions data structure
 * @param data - Unknown data from Firestore
 * @returns True if data matches UserPermissions structure
 */
function isValidUserPermissions(
  data: unknown,
): data is FirestoreUserPermissions {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;

  return (
    typeof d.userId === "string" &&
    typeof d.email === "string" &&
    typeof d.isAdmin === "boolean" &&
    typeof d.pillars === "object" &&
    d.pillars !== null &&
    typeof (d.pillars as Record<string, unknown>).pillar1 === "boolean" &&
    typeof (d.pillars as Record<string, unknown>).pillar2 === "boolean" &&
    typeof (d.pillars as Record<string, unknown>).pillar3 === "boolean" &&
    typeof (d.pillars as Record<string, unknown>).pillar4 === "boolean" &&
    typeof (d.pillars as Record<string, unknown>).pillar5 === "boolean" &&
    typeof (d.pillars as Record<string, unknown>).pillar6 === "boolean"
  );
}

/**
 * Safely converts Firestore Timestamp to Date
 * @param value - Firestore Timestamp or Date
 * @returns JavaScript Date object
 */
function toDate(value: unknown): Date {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return (value as { toDate(): Date }).toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  return new Date();
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  // Initialize loading state - if auth isn't initialized, we're not really loading
  const [loading, setLoading] = useState(!!auth);
  // Initialize error state based on auth initialization
  const [error, setError] = useState<string | null>(
    !auth
      ? "Firebase Auth is not initialized. Please check your environment variables."
      : null,
  );

  /**
   * Fetches user permissions from Firestore
   * Creates default permissions if user is new
   * @param userId - Firebase Auth user ID
   * @param userEmail - User's email address
   * @returns Promise that resolves when permissions are fetched
   */
  const fetchPermissions = async (
    userId: string,
    userEmail: string,
  ): Promise<void> => {
    if (!db) {
      const errorMsg =
        "Firestore is not initialized. Please check your Firebase configuration.";
      console.error(errorMsg);
      setError(errorMsg);
      toast.error("Database connection failed. Please contact support.");
      return;
    }

    try {
      const permissionsRef = doc(db, "userPermissions", userId);
      const permissionsSnap = await getDoc(permissionsRef);

      if (permissionsSnap.exists()) {
        const data = permissionsSnap.data();

        // Validate data structure before using it
        if (!isValidUserPermissions(data)) {
          const errorMsg = "Invalid permissions data structure in Firestore";
          console.error(errorMsg, data);
          setError(errorMsg);
          toast.error("Invalid user permissions. Please contact support.");
          return;
        }

        // Convert Firestore timestamps to Date objects
        setPermissions({
          ...data,
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt),
        });

        // Show success toast after permissions are loaded
        toast.success("Signed in successfully!");
      } else {
        // Create default permissions for new user
        // NOTE: This is a temporary solution. In production, user creation
        // should be handled by a Cloud Function to prevent privilege escalation
        const defaultPermissions: UserPermissions = {
          userId,
          email: userEmail,
          isAdmin: false,
          pillars: {
            pillar1: false,
            pillar2: false,
            pillar3: false,
            pillar4: false,
            pillar5: false,
            pillar6: false,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await setDoc(permissionsRef, defaultPermissions);
        setPermissions(defaultPermissions);

        // Show success toast for new users
        toast.success("Welcome! Your account has been created.");
      }

      // Clear any previous errors
      setError(null);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to fetch permissions";
      console.error("Error fetching permissions:", {
        message: errorMsg,
        stack: error instanceof Error ? error.stack : undefined,
        userId,
      });
      setError(errorMsg);
      toast.error(
        "Failed to load user permissions. Please try refreshing the page.",
      );
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    // Early check for auth initialization
    if (!auth) {
      console.error(
        "Firebase Auth is not initialized. Please check your environment variables.",
      );
      toast.error(
        "Authentication service unavailable. Please contact support.",
      );
      return;
    }

    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!mounted) return;

      setUser(user);
      if (user) {
        // Validate email exists (Google OAuth should always provide it)
        if (!user.email) {
          const errorMsg = "User authenticated but email is missing";
          console.error(errorMsg, { uid: user.uid });
          setError(errorMsg);
          toast.error("Authentication error: Missing email. Please try again.");
          if (mounted) setLoading(false);
          return;
        }

        await fetchPermissions(user.uid, user.email);
      } else {
        setPermissions(null);
        setError(null);
      }
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  /**
   * Signs in user with Google OAuth popup
   * @throws Error if Firebase Auth is not initialized
   * @returns Promise that resolves when sign-in is complete
   */
  const signInWithGoogle = async (): Promise<void> => {
    if (!auth) {
      throw new Error(
        "Firebase Auth is not initialized. Please check your environment variables.",
      );
    }
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
      await signInWithPopup(auth, provider);
      // Success toast will be shown after permissions are fetched in fetchPermissions()
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to sign in";
      console.error("Error signing in with Google:", {
        message: errorMsg,
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  };

  /**
   * Signs out the current user
   * @throws Error if Firebase Auth is not initialized
   * @returns Promise that resolves when sign-out is complete
   */
  const signOut = async (): Promise<void> => {
    if (!auth) {
      throw new Error("Firebase Auth is not initialized");
    }
    try {
      await firebaseSignOut(auth);
      toast.success("Signed out successfully");
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to sign out";
      console.error("Error signing out:", {
        message: errorMsg,
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  };

  /**
   * Checks if user has access to a specific pillar
   * @param pillarNumber - Pillar number (1-6)
   * @returns True if user has access (either admin or specific pillar access)
   */
  const hasAccessToPillar = (pillarNumber: number): boolean => {
    if (!permissions) return false;
    if (permissions.isAdmin) return true;
    const pillarKey =
      `pillar${pillarNumber}` as keyof typeof permissions.pillars;
    return permissions.pillars[pillarKey] || false;
  };

  const value: AuthContextType = {
    user,
    permissions,
    loading,
    error,
    signInWithGoogle,
    signOut,
    hasAccessToPillar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
