/**
 * Server-side Firebase Admin SDK functions
 * These functions run on the server and use Firebase Admin SDK for privileged operations
 */

import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import type { UserPermissions } from "@/lib/types/auth.types";

/**
 * Initialize Firebase Admin SDK
 * Uses Application Default Credentials in production (Cloud Run)
 * Uses service account JSON in development
 */
function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Check if running in Cloud Run (Application Default Credentials available)
  const isCloudRun = process.env.K_SERVICE !== undefined;

  if (isCloudRun) {
    // Cloud Run: Use Application Default Credentials
    return initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }

  // Local development: Use service account key from environment variable
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccount) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. " +
        "Please set it in your .env.local file for local development.",
    );
  }

  let serviceAccountJson;
  try {
    serviceAccountJson = JSON.parse(serviceAccount);
  } catch (error) {
    throw new Error(
      "Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Ensure it is valid JSON.",
    );
  }

  return initializeApp({
    credential: cert(serviceAccountJson),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

/**
 * Get Firestore instance configured for the aiml-coe-web-app database
 */
function getAdminFirestore() {
  const app = getFirebaseAdminApp();
  return getFirestore(app, "aiml-coe-web-app");
}

/**
 * Verifies a Firebase ID token
 * @param token - Firebase ID token from client
 * @returns Decoded token with user information
 * @throws Error if token is invalid or expired
 */
export async function verifyIdToken(token: string) {
  try {
    const app = getFirebaseAdminApp();
    const auth = getAuth(app);
    return await auth.verifyIdToken(token);
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Invalid or expired token");
  }
}

/**
 * Gets user permissions from Firestore
 * @param userId - Firebase Auth user ID
 * @returns User permissions or null if not found
 */
export async function getUserPermissions(
  userId: string,
): Promise<UserPermissions | null> {
  try {
    const db = getAdminFirestore();
    const userDoc = await db.collection("userPermissions").doc(userId).get();

    if (!userDoc.exists) {
      console.warn(`User permissions not found for userId: ${userId}`);
      return null;
    }

    const data = userDoc.data();
    if (!data) {
      return null;
    }

    return {
      userId: userDoc.id,
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
    };
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    throw error;
  }
}

/**
 * Checks if a user is an admin
 * @param userId - Firebase Auth user ID
 * @returns True if user is an admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const permissions = await getUserPermissions(userId);
    return permissions?.isAdmin === true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
