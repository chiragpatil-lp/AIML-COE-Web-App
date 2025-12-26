import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken, getUserPermissions } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

// Pillar URL mapping - should match environment variables
const PILLAR_URLS: Record<string, string> = {
  "1": process.env.NEXT_PUBLIC_PILLAR_1_URL || "",
  "2": process.env.NEXT_PUBLIC_PILLAR_2_URL || "",
  "3": process.env.NEXT_PUBLIC_PILLAR_3_URL || "",
  "4": process.env.NEXT_PUBLIC_PILLAR_4_URL || "",
  "5": process.env.NEXT_PUBLIC_PILLAR_5_URL || "",
  "6": process.env.NEXT_PUBLIC_PILLAR_6_URL || "",
};

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * Server-side pillar access endpoint
 * Verifies user authentication and permissions before redirecting to pillar URL
 *
 * @param request - Next.js request object
 * @param params - Route parameters containing pillar ID
 * @returns Redirect to pillar URL or error response
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    const { id } = params;
    const pillarNumber = parseInt(id, 10);

    // Validate pillar number
    if (isNaN(pillarNumber) || pillarNumber < 1 || pillarNumber > 6) {
      return NextResponse.json(
        { error: "Invalid pillar ID. Must be between 1 and 6." },
        { status: 400 },
      );
    }

    // Get ID token from Authorization header or cookie
    const authHeader = request.headers.get("Authorization");
    const cookieStore = cookies();
    const tokenFromCookie = cookieStore.get("firebase-token")?.value;

    const token = authHeader?.replace("Bearer ", "") || tokenFromCookie;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 },
      );
    }

    // Verify the ID token
    let decodedToken;
    try {
      decodedToken = await verifyIdToken(token);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Invalid token";
      console.error("Token verification failed:", errorMsg);
      return NextResponse.json(
        { error: "Invalid authentication token. Please sign in again." },
        { status: 401 },
      );
    }

    // Get user permissions from Firestore
    const permissions = await getUserPermissions(decodedToken.uid);

    if (!permissions) {
      return NextResponse.json(
        { error: "User permissions not found. Please contact support." },
        { status: 403 },
      );
    }

    // Check if user has access to this pillar
    const isAdmin = permissions.isAdmin === true;
    const pillarKey = `pillar${pillarNumber}`;
    const hasAccess = isAdmin || permissions.pillars?.[pillarKey] === true;

    if (!hasAccess) {
      console.warn("Access denied:", {
        userId: decodedToken.uid,
        pillarNumber,
        isAdmin,
        pillarAccess: permissions.pillars?.[pillarKey],
      });

      return NextResponse.json(
        {
          error: `Access denied. You don't have permission to access Pillar ${pillarNumber}.`,
        },
        { status: 403 },
      );
    }

    // Get the pillar URL
    const pillarUrl = PILLAR_URLS[id];

    if (!pillarUrl || pillarUrl === "#") {
      return NextResponse.json(
        { error: "Pillar URL not configured. Please contact support." },
        { status: 500 },
      );
    }

    // Log successful access (for audit purposes)
    console.info("Pillar access granted:", {
      userId: decodedToken.uid,
      email: decodedToken.email,
      pillarNumber,
      isAdmin,
      timestamp: new Date().toISOString(),
    });

    // Redirect to the pillar URL
    return NextResponse.redirect(pillarUrl, { status: 302 });
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Internal server error";
    console.error("Error in pillar access endpoint:", {
      error: errorMsg,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 },
    );
  }
}
