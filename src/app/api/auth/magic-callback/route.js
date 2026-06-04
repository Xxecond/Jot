// app/api/auth/magic-callback/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import AuthSession from "@/models/AuthSession";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const sessionId = searchParams.get("sessionId");
    const action = searchParams.get("action");

    if (!token) {
      console.warn("❌ Magic callback - No token provided");
      return NextResponse.redirect(new URL("/auth/login?error=invalid-token", req.url));
    }

    console.log("🔍 Magic callback received token:", token.substring(0, 15) + "...");

    const user = await User.findOne({
      magicToken: token,
      magicTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      console.error("❌ Token not found or expired. Token:", token);
      
      // Debug: Check if token exists at all (expired or invalid)
      const expiredUser = await User.findOne({
        magicToken: token,
      });
      
      if (expiredUser) {
        const expiryTime = expiredUser.magicTokenExpiry;
        console.warn("   → Token expired at:", expiryTime);
        console.warn("   → Current time:", Date.now());
        console.warn("   → User email:", expiredUser.email);
      } else {
        console.warn("   → Token not found in any user record");
        // Check if user exists but no token field (migration issue)
        const totalUsers = await User.countDocuments();
        console.warn("   → Total users in DB:", totalUsers);
      }
      
      return NextResponse.redirect(new URL("/auth/login?error=expired-token", req.url));
    }

    console.log("✅ Token found for user:", user.email, "| User ID:", user._id);

    // Clear magic token + verify user
    user.magicToken = undefined;
    user.magicTokenExpiry = undefined;
    user.isVerified = true;
    await user.save();

    console.log("✅ User verified and magic token cleared");

    const jwtToken = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("🔐 JWT token created for userId:", user._id.toString());

    // DENY
    if (action === "deny") {
      if (sessionId) {
        await AuthSession.findOneAndUpdate(
          { sessionId },
          { authenticated: false, denied: true, status: "denied" },
          { upsert: true }
        );
      }
      return new Response(`
        <html><body style="font-family:Arial;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f3f4f6;">
          <div style="text-align:center;">
            <h2 style="color:#ef4444;">❌ Request Denied</h2>
            <p>You can close this tab.</p>
          </div>
          <script>setTimeout(() => window.close(), 1500);</script>
        </body></html>
      `, { headers: { "Content-Type": "text/html" } });
    }

    // APPROVE
    if (sessionId) {
      await AuthSession.findOneAndUpdate(
        { sessionId },
        {
          sessionId,
          userId: user._id,
          authenticated: true,
          denied: false,
          jwtToken,
          status: "authenticated",
        },
        { upsert: true, new: true }
      );

      console.log("✅ AuthSession updated for sessionId:", sessionId);

      // Small delay helps local dev + slow DB
      await new Promise(r => setTimeout(r, 400));

      return new Response(`
        <html><body style="font-family:Arial;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f3f4f6;">
          <div style="text-align:center;">
            <h2 style="color:#22c55e;">✅ Authentication Successful!</h2>
            <p>You can close this tab.</p>
          </div>
          <script>setTimeout(() => window.close(), 1500);</script>
        </body></html>
      `, { headers: { "Content-Type": "text/html" } });
    }

    // Fallback (no sessionId)
    const response = NextResponse.redirect(new URL("/dashboard/home", req.url));
    response.cookies.set("access_token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    console.log("🍪 access_token cookie set (fallback path)");

    return response;

  } catch (err) {
    console.error("❌ Magic callback error:", err);
    return NextResponse.redirect(new URL("/auth/login?error=server-error", req.url));
  }
}