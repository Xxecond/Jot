// app/api/auth/check-session/route.js
import { connectDB } from "@/lib/db";
import AuthSession from "@/models/AuthSession";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      console.warn("❌ check-session - No sessionId provided");
      return NextResponse.json({ authenticated: false, denied: false }, { status: 400 });
    }

    const session = await AuthSession.findOne({ sessionId });

    if (!session) {
      console.log("ℹ️ check-session - Session not found (still pending):", sessionId);
      return NextResponse.json({ authenticated: false, denied: false });
    }

    if (session.denied) {
      console.log("⚠️ check-session - Session denied:", sessionId);
      await AuthSession.deleteOne({ sessionId });
      return NextResponse.json({ authenticated: false, denied: true });
    }

    if (session.authenticated && session.jwtToken) {
      console.log("✅ check-session - Session authenticated:", sessionId);
      
      const response = NextResponse.json({ 
        authenticated: true, 
        token: session.jwtToken 
      });

      // ✅ Set HttpOnly cookie with proper security settings
      response.cookies.set("access_token", session.jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });

      console.log("🍪 access_token cookie set successfully");

      // Clean up session after successful use
      await AuthSession.deleteOne({ sessionId });

      return response;
    }

    // Still pending
    console.log("⏳ check-session - Still pending:", sessionId);
    return NextResponse.json({ authenticated: false, denied: false });
  } catch (err) {
    console.error("❌ Check session error:", err);
    return NextResponse.json({ authenticated: false, denied: false }, { status: 500 });
  }
}