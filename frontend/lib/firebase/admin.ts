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

  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  if (clientEmail && privateKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
      storageBucket,
    });
  }

  // Fallback to legacy service account key from environment variable
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccount) {
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
      projectId,
      storageBucket,
    });
  }

  // Fallback to Application Default Credentials (ADC) or existing config
  // This works for Cloud Run and local dev if "gcloud auth application-default login" is used
  return initializeApp({
    projectId,
    storageBucket,
    // Note: Admin SDK usually infers credentials from the environment if not provided
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
 * Verifies a Firebase Session Cookie
 * @param sessionCookie - Firebase Session Cookie from client
 * @returns Decoded token with user information
 * @throws Error if cookie is invalid or expired
 */
export async function verifySessionCookie(sessionCookie: string) {
  try {
    const app = getFirebaseAdminApp();
    const auth = getAuth(app);
    return await auth.verifySessionCookie(
      sessionCookie,
      true /** checkRevoked */,
    );
  } catch (error) {
    console.error("Session cookie verification failed:", error);
    throw new Error("Invalid or expired session cookie");
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

/**
 * Creates a session cookie from a Firebase ID token
 * @param idToken - The Firebase ID token to exchange for a session cookie
 * @param expiresIn - The duration in milliseconds for the cookie to be valid
 * @returns A promise that resolves to the session cookie string
 */
export async function createSessionCookie(
  idToken: string,
  expiresIn: number,
): Promise<string> {
  const app = getFirebaseAdminApp();
  const auth = getAuth(app);
  return auth.createSessionCookie(idToken, { expiresIn });
}
