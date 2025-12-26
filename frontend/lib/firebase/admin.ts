import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { isValidUserPermissions, fromFirestore } from "./permissions";

let adminApp: App | undefined;
let adminAuth: Auth | undefined;
let adminDb: Firestore | undefined;

/**
 * Initialize Firebase Admin SDK
 * This should only be called server-side
 * @returns Admin app instance
 */
function initializeAdminApp(): App {
  if (adminApp) {
    return adminApp;
  }

  const apps = getApps();
  if (apps.length > 0) {
    adminApp = apps[0];
    return adminApp;
  }

  // Initialize with service account credentials from environment variables
  // For production, use a service account JSON file
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

  if (serviceAccount) {
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // Fallback: Initialize with project ID for local development
    // This requires setting up Application Default Credentials
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      throw new Error(
        "Firebase Admin: Missing FIREBASE_SERVICE_ACCOUNT_KEY or NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      );
    }

    adminApp = initializeApp({
      projectId,
    });
  }

  return adminApp;
}

/**
 * Get Firebase Admin Auth instance
 * @returns Admin Auth instance
 */
export function getAdminAuth(): Auth {
  if (!adminAuth) {
    const app = initializeAdminApp();
    adminAuth = getAuth(app);
  }
  return adminAuth;
}

/**
 * Get Firebase Admin Firestore instance
 * @returns Admin Firestore instance
 */
export function getAdminFirestore(): Firestore {
  if (!adminDb) {
    const app = initializeAdminApp();
    adminDb = getFirestore(app, "aiml-coe-web-app");
  }
  return adminDb;
}

/**
 * Verify Firebase ID token and return user
 * @param token - Firebase ID token from client
 * @returns Decoded token with user info
 */
export async function verifyIdToken(token: string) {
  const auth = getAdminAuth();
  return await auth.verifyIdToken(token);
}

/**
 * Get user permissions from Firestore using Admin SDK
 * @param userId - Firebase user ID
 * @returns User permissions or null if not found
 * @throws Error if permissions data is malformed
 */
export async function getUserPermissions(userId: string) {
  const db = getAdminFirestore();
  const permissionsRef = db.collection("userPermissions").doc(userId);
  const permissionsSnap = await permissionsRef.get();

  if (!permissionsSnap.exists) {
    return null;
  }

  const data = permissionsSnap.data();

  // Validate permissions structure before returning
  if (!isValidUserPermissions(data)) {
    throw new Error(`Invalid permissions structure for user ${userId}`);
  }

  return fromFirestore(data);
}
