import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { cookies } from "next/headers";
import { verifySessionCookie, isUserAdmin } from "@/lib/firebase/admin";

/**
 * Initialize Firebase Admin SDK
 */
function getFirebaseAdminApp() {
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

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccount) {
    return initializeApp({
      credential: cert(JSON.parse(serviceAccount)),
      projectId,
      storageBucket,
    });
  }

  return initializeApp({ projectId, storageBucket });
}

/**
 * DELETE /api/admin/delete-user
 *
 * Permanently deletes a user from both Firebase Authentication and Firestore.
 * This is a destructive operation that:
 * - Removes user from Firebase Auth (cannot sign in anymore)
 * - Deletes user permissions document from Firestore
 * - Logs the action in the audit trail
 *
 * Admin-only endpoint
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("firebase-token")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decodedClaims = await verifySessionCookie(sessionCookie);

    if (!decodedClaims) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Verify admin privileges
    const callerIsAdmin = await isUserAdmin(decodedClaims.uid);

    if (!callerIsAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 },
      );
    }

    // Parse request body
    const body = await request.json();
    const { userId } = body;

    // Validate input
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "userId is required and must be a string" },
        { status: 400 },
      );
    }

    // Prevent self-deletion
    if (userId === decodedClaims.uid) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 },
      );
    }

    // Initialize Firebase Admin
    const app = getFirebaseAdminApp();
    const auth = getAuth(app);
    const db = getFirestore(app, "aiml-coe-web-app");

    // Get user information before deletion (for audit log)
    let userEmail = "unknown";
    let userWasAdmin = false;

    try {
      const userRecord = await auth.getUser(userId);
      userEmail = userRecord.email || "unknown";
    } catch (error) {
      console.warn(`Could not fetch user record for ${userId}:`, error);
    }

    try {
      const permissionsDoc = await db
        .collection("userPermissions")
        .doc(userId)
        .get();

      if (permissionsDoc.exists) {
        const data = permissionsDoc.data();
        userWasAdmin = data?.isAdmin || false;
      }
    } catch (error) {
      console.warn(`Could not fetch permissions for ${userId}:`, error);
    }

    // Step 1: Delete from Firebase Authentication
    try {
      await auth.deleteUser(userId);
      console.log(`Deleted user from Firebase Auth: ${userId}`);
    } catch (error: any) {
      // If user doesn't exist in Auth, that's okay - continue with Firestore deletion
      if (error.code !== "auth/user-not-found") {
        throw error;
      }
      console.log(
        `User ${userId} not found in Auth, continuing with Firestore deletion`,
      );
    }

    // Step 2: Delete from Firestore
    try {
      await db.collection("userPermissions").doc(userId).delete();
      console.log(`Deleted user permissions from Firestore: ${userId}`);
    } catch (error) {
      console.error(`Error deleting user permissions for ${userId}:`, error);
      // Continue - we want to log the audit even if deletion partially failed
    }

    // Step 3: Log the action in audit trail
    try {
      await db.collection("adminAuditLog").add({
        action: "user_deleted",
        targetUserId: userId,
        targetUserEmail: userEmail,
        targetUserWasAdmin: userWasAdmin,
        performedBy: decodedClaims.uid,
        performedByEmail: decodedClaims.email || "unknown",
        timestamp: FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error("Error logging audit trail:", error);
      // Don't fail the request if audit logging fails
    }

    return NextResponse.json({
      success: true,
      message: `User ${userEmail} has been permanently deleted`,
      deletedUserId: userId,
      deletedUserEmail: userEmail,
    });
  } catch (error) {
    console.error("Error deleting user:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete user";

    return NextResponse.json(
      {
        error: "Failed to delete user",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
