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
 * POST /api/admin/set-admin-claim
 * Sets admin custom claim for a user
 * Admin-only endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("firebase-token")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Verify session and check if caller is admin
    const decodedToken = await verifySessionCookie(sessionCookie);
    const callerIsAdmin = await isUserAdmin(decodedToken.uid);

    if (!callerIsAdmin) {
      return NextResponse.json(
        { error: "Only admins can set admin claims" },
        { status: 403 },
      );
    }

    // Parse request body
    const body = await request.json();
    const { userId, isAdmin } = body;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "userId must be a string" },
        { status: 400 },
      );
    }

    if (typeof isAdmin !== "boolean") {
      return NextResponse.json(
        { error: "isAdmin must be a boolean" },
        { status: 400 },
      );
    }

    // Initialize Firebase Admin
    const app = getFirebaseAdminApp();
    const auth = getAuth(app);
    const db = getFirestore(app, "aiml-coe-web-app");

    // Set custom claim
    await auth.setCustomUserClaims(userId, { admin: isAdmin });

    // Update Firestore permissions document
    await db.collection("userPermissions").doc(userId).update({
      isAdmin,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Log the change for audit purposes
    await db.collection("adminAuditLog").add({
      action: "admin_claim_set",
      targetUserId: userId,
      isAdmin,
      performedBy: decodedToken.uid,
      performedByEmail: decodedToken.email,
      timestamp: FieldValue.serverTimestamp(),
    });

    console.log("Admin claim set successfully", {
      isAdmin,
    });
    // PII: User IDs commented out - check audit logs for details
    // console.log("Admin claim set:", {
    //   targetUserId: userId,
    //   isAdmin,
    //   performedBy: decodedToken.uid,
    // });

    return NextResponse.json({
      success: true,
      message: `Admin claim ${isAdmin ? "granted" : "revoked"} for user ${userId}`,
    });
  } catch (error) {
    console.error("Error setting admin claim:", error);
    return NextResponse.json(
      {
        error: "Failed to set admin claim",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
