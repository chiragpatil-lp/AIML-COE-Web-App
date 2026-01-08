import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { UserPermissions } from "@/lib/types/auth.types";

/**
 * Fetches all user permissions from Firestore
 * Admin-only function
 * @returns Promise with array of UserPermissions
 */
export async function getAllUserPermissions(): Promise<UserPermissions[]> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  try {
    const permissionsCollection = collection(db, "userPermissions");
    // Remove orderBy to avoid issues with missing email fields or indexes
    const snapshot = await getDocs(permissionsCollection);

    console.log(
      `[Admin] Fetched ${snapshot.size} user documents from Firestore`,
    );

    const users: UserPermissions[] = [];
    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      console.log(`[Admin] Processing user document:`, docSnapshot.id, data);

      users.push({
        userId: docSnapshot.id,
        email: data.email || "",
        isAdmin: data.isAdmin || false,
        pillars: {
          pillar1: data.pillars?.pillar1 || false,
          pillar2: data.pillars?.pillar2 || false,
          pillar3: data.pillars?.pillar3 || false,
          pillar4: data.pillars?.pillar4 || false,
          pillar5: data.pillars?.pillar5 || false,
          pillar6: data.pillars?.pillar6 || false,
        },
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });

    // Sort by email on the client side
    users.sort((a, b) => a.email.localeCompare(b.email));

    console.log(`[Admin] Returning ${users.length} users`);
    return users;
  } catch (error) {
    console.error("Error fetching all user permissions:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
}

/**
 * Updates user permissions via Next.js API routes
 * Admin-only function
 * @param userId - Firebase Auth user ID
 * @param updates - Partial UserPermissions to update
 * @returns Promise that resolves when update is complete
 */
export async function updateUserPermissions(
  userId: string,
  updates: Partial<Omit<UserPermissions, "userId" | "createdAt">>,
): Promise<void> {
  try {
    // Use Next.js API routes to ensure audit logging and custom claim synchronization
    // This avoids CORS issues by calling server-side endpoints
    const promises = [];

    if (updates.isAdmin !== undefined) {
      const response = await fetch("/api/admin/set-admin-claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, isAdmin: updates.isAdmin }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to set admin claim");
      }

      promises.push(response.json());
    }

    if (updates.pillars !== undefined) {
      const response = await fetch("/api/admin/update-permissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, pillars: updates.pillars }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update permissions");
      }

      promises.push(response.json());
    }

    await Promise.all(promises);
  } catch (error) {
    console.error("Error updating user permissions:", error);
    throw error;
  }
}

/**
 * Creates a new user permission document
 * Admin-only function - used to manually add users by email
 * @param email - User's email address
 * @param permissions - User permissions configuration
 * @returns Promise that resolves when user is created
 */
export async function createUserPermissions(
  email: string,
  permissions: {
    isAdmin: boolean;
    pillars: {
      pillar1: boolean;
      pillar2: boolean;
      pillar3: boolean;
      pillar4: boolean;
      pillar5: boolean;
      pillar6: boolean;
    };
  },
): Promise<void> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  try {
    // Note: We can't create a user by email alone in Firebase Auth
    // This function creates a permission document that will be linked
    // when the user first signs in with this email
    const tempUserId = `pending_${btoa(email.toLowerCase())}`;
    const userRef = doc(db, "userPermissions", tempUserId);

    await setDoc(userRef, {
      userId: tempUserId,
      email: email.toLowerCase(),
      isAdmin: permissions.isAdmin,
      pillars: permissions.pillars,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isPending: true, // Flag to indicate this is a pre-created permission
    });
  } catch (error) {
    console.error("Error creating user permissions:", error);
    throw error;
  }
}

/**
 * Checks if a user has admin privileges
 * @param userId - Firebase Auth user ID
 * @returns Promise with boolean indicating admin status
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  try {
    const userRef = doc(db, "userPermissions", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return false;
    }

    return userSnap.data().isAdmin === true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Gets a summary of user permissions by pillar
 * @returns Promise with pillar access statistics
 */
export async function getPillarAccessSummary(): Promise<{
  [key: string]: number;
}> {
  if (!db) {
    throw new Error("Firestore is not initialized");
  }

  try {
    const users = await getAllUserPermissions();
    const summary: { [key: string]: number } = {
      totalUsers: users.length,
      admins: 0,
      pillar1: 0,
      pillar2: 0,
      pillar3: 0,
      pillar4: 0,
      pillar5: 0,
      pillar6: 0,
    };

    users.forEach((user) => {
      if (user.isAdmin) {
        summary.admins += 1;
        // Admins have access to all pillars
        summary.pillar1 += 1;
        summary.pillar2 += 1;
        summary.pillar3 += 1;
        summary.pillar4 += 1;
        summary.pillar5 += 1;
        summary.pillar6 += 1;
      } else {
        if (user.pillars.pillar1) summary.pillar1 += 1;
        if (user.pillars.pillar2) summary.pillar2 += 1;
        if (user.pillars.pillar3) summary.pillar3 += 1;
        if (user.pillars.pillar4) summary.pillar4 += 1;
        if (user.pillars.pillar5) summary.pillar5 += 1;
        if (user.pillars.pillar6) summary.pillar6 += 1;
      }
    });

    return summary;
  } catch (error) {
    console.error("Error getting pillar access summary:", error);
    throw error;
  }
}
