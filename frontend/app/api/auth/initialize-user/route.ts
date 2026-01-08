import { NextRequest, NextResponse } from "next/server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { cookies } from "next/headers";
import { verifySessionCookie } from "@/lib/firebase/admin";

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
      storageBucket,
      databaseURL: `https://${projectId}.firebaseio.com`,
    });
  }

  return initializeApp({
    projectId,
    storageBucket,
    databaseURL: `https://${projectId}.firebaseio.com`,
  });
}

interface UserPermissions {
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
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

/**
 * POST /api/auth/initialize-user
 * 
 * Manually initializes user permissions (fallback if onCreate trigger fails)
 * Authenticated users can initialize their own permissions
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Unauthorized - No session cookie" },
        { status: 401 }
      );
    }

    const decodedClaims = await verifySessionCookie(sessionCookie);
    
    if (!decodedClaims) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid session" },
        { status: 401 }
      );
    }

    const userId = decodedClaims.uid;
    const userEmail = decodedClaims.email;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User must have an email" },
        { status: 400 }
      );
    }

    // Initialize Firestore
    const app = getFirebaseAdminApp();
    const db = getFirestore(app, "aiml-coe-web-app");
    const userRef = db.collection("userPermissions").doc(userId);

    // Check if already initialized
    const existingDoc = await userRef.get();
    
    if (existingDoc.exists) {
      return NextResponse.json({
        success: true,
        message: "User already initialized",
      });
    }

    // Check for pending permissions by email
    const pendingQuery = await db
      .collection("userPermissions")
      .where("email", "==", userEmail.toLowerCase())
      .where("isPending", "==", true)
      .limit(1)
      .get();

    if (!pendingQuery.empty) {
      const pendingDoc = pendingQuery.docs[0];
      const pendingData = pendingDoc.data();
      
      const permissionsFromPending: UserPermissions = {
        userId,
        email: userEmail,
        isAdmin: pendingData.isAdmin || false,
        pillars: pendingData.pillars,
        createdAt: pendingData.createdAt || FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await userRef.set(permissionsFromPending);
      await pendingDoc.ref.delete(); // Clean up pending document

      return NextResponse.json({
        success: true,
        message: "User initialized from pending permissions",
      });
    }

    // Create default permissions
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
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await userRef.set(defaultPermissions);

    return NextResponse.json({
      success: true,
      message: "User initialized successfully",
    });
  } catch (error) {
    console.error("Error initializing user:", error);
    
    return NextResponse.json(
      {
        error: "Failed to initialize user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
