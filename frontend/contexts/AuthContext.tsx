"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { auth, db, functions } from "@/lib/firebase/config";
import type { AuthContextType, UserPermissions } from "@/lib/types/auth.types";
import { toast } from "sonner";
import { isValidUserPermissions, toDate } from "@/lib/firebase/permissions";

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

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  // Initialize loading to true consistently on server and client
  const [loading, setLoading] = useState(true);
  // Initialize error to null consistently
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches user permissions from Firestore
   * Waits for Cloud Function to create permissions for new users
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

    // Retry configuration for waiting on Cloud Function
    const MAX_RETRIES = 3; // Reduced since we have a fallback
    const RETRY_DELAY_MS = 2000; // 2 seconds

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
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

          setError(null);
          return; // Success - exit retry loop
        }

        // Permissions don't exist yet
        if (attempt < MAX_RETRIES) {
          console.log(
            `Waiting for user permissions (attempt ${attempt + 1}/${MAX_RETRIES})...`,
          );
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        } else {
          // Retries exhausted - try fallback
          if (functions) {
            console.log(
              "Retries exhausted. Attempting to initialize user via callable function...",
            );
            try {
              const initializeUser = httpsCallable(functions, "initializeUser");
              await initializeUser();

              // Try to fetch one last time immediately
              const retrySnap = await getDoc(permissionsRef);
              if (retrySnap.exists()) {
                const data = retrySnap.data();
                // Validate data
                if (isValidUserPermissions(data)) {
                  setPermissions({
                    ...data,
                    createdAt: toDate(data.createdAt),
                    updatedAt: toDate(data.updatedAt),
                  });
                  setError(null);
                  return;
                }
              }
            } catch (fallbackError) {
              console.error("Fallback initialization failed:", fallbackError);
            }
          }

          const errorMsg =
            "User permissions not found after retries and fallback.";
          console.error(errorMsg, { userId, userEmail });
          setError(errorMsg);
          toast.error(
            "Failed to load permissions. Please try signing out and in again.",
          );
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Failed to fetch permissions";
        console.error("Error fetching permissions:", {
          message: errorMsg,
          userId,
          attempt,
        });

        if (attempt === MAX_RETRIES) {
          setError(errorMsg);
          toast.error("Failed to load permissions. Please refresh the page.");
        }
      }
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    // Check for auth initialization once mounted on client
    if (!auth) {
      setTimeout(() => {
        console.error(
          "Firebase Auth is not initialized. Please check your environment variables.",
        );
        setError(
          "Firebase Auth is not initialized. Please check your environment variables.",
        );
        setLoading(false);
      }, 0);
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

        // Set authentication cookie for server-side verification
        try {
          const token = await user.getIdToken();
          document.cookie = `firebase-token=${token}; path=/; max-age=3600; secure; samesite=lax`;
        } catch (error) {
          console.error("Failed to set auth cookie:", error);
        }

        await fetchPermissions(user.uid, user.email);
      } else {
        setPermissions(null);
        setError(null);
        // Clear cookie on sign out
        document.cookie = "firebase-token=; path=/; max-age=0";
      }
      if (mounted) setLoading(false);
    });

    // Refresh token every 50 minutes (Firebase tokens expire in 1 hour)
    const refreshTokenInterval = setInterval(
      async () => {
        const currentUser = auth?.currentUser;
        if (currentUser) {
          try {
            const token = await currentUser.getIdToken(true); // Force refresh
            document.cookie = `firebase-token=${token}; path=/; max-age=3600; secure; samesite=lax`;
          } catch (error) {
            console.error("Failed to refresh auth token:", error);
          }
        }
      },
      50 * 60 * 1000,
    ); // 50 minutes

    return () => {
      mounted = false;
      clearInterval(refreshTokenInterval);
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
      // Clear authentication cookie
      document.cookie = "firebase-token=; path=/; max-age=0";
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
