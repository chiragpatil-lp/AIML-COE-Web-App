import { NextRequest, NextResponse } from "next/server";
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
 * POST /api/admin/update-permissions
 * Updates user pillar permissions
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
        { error: "Only admins can update user permissions" },
        { status: 403 },
      );
    }

    // Parse request body
    const body = await request.json();
    const { userId, pillars } = body;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "userId must be a string" },
        { status: 400 },
      );
    }

    if (!pillars || typeof pillars !== "object") {
      return NextResponse.json(
        { error: "pillars must be an object" },
        { status: 400 },
      );
    }

    // Validate pillars object structure
    const validPillarKeys = [
      "pillar1",
      "pillar2",
      "pillar3",
      "pillar4",
      "pillar5",
      "pillar6",
    ];

    for (const key of Object.keys(pillars)) {
      if (!validPillarKeys.includes(key)) {
        return NextResponse.json(
          { error: `Invalid pillar key: ${key}` },
          { status: 400 },
        );
      }
      if (typeof pillars[key] !== "boolean") {
        return NextResponse.json(
          { error: `Pillar value must be boolean: ${key}` },
          { status: 400 },
        );
      }
    }

    // Initialize Firebase Admin
    const app = getFirebaseAdminApp();
    const db = getFirestore(app, "aiml-coe-web-app");

    // Update Firestore permissions document
    await db.collection("userPermissions").doc(userId).update({
      pillars,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Log the change for audit purposes
    await db.collection("adminAuditLog").add({
      action: "permissions_updated",
      targetUserId: userId,
      pillars,
      performedBy: decodedToken.uid,
      performedByEmail: decodedToken.email,
      timestamp: FieldValue.serverTimestamp(),
    });

    console.log("User permissions updated successfully", {
      pillarCount: Object.keys(pillars).filter((k) => pillars[k]).length,
    });
    // PII: User IDs commented out - check audit logs for details
    // console.log("User permissions updated:", {
    //   targetUserId: userId,
    //   pillars,
    //   performedBy: decodedToken.uid,
    // });

    return NextResponse.json({
      success: true,
      message: `Permissions updated for user ${userId}`,
    });
  } catch (error) {
    console.error("Error updating user permissions:", error);
    return NextResponse.json(
      {
        error: "Failed to update user permissions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
