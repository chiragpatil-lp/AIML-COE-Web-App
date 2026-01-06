import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

// POST /api/auth/session - Create a session cookie
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
    }

    // Verify the ID token
    try {
      const decodedToken = await verifyIdToken(idToken);

      // Calculate expiration (e.g., 5 days or match token expiry)
      // Firebase ID tokens last 1 hour, but we can create a session
      // cookie that lasts longer if we were using session cookies.
      // For this implementation, we'll match the standard session duration.
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

      const cookieStore = await cookies();
      cookieStore.set("firebase-token", idToken, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      });

      return NextResponse.json({ status: "success", uid: decodedToken.uid });
    } catch (error) {
      console.error("Error verifying token:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/auth/session - Delete the session cookie
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("firebase-token");
  return NextResponse.json({ status: "success" });
}
