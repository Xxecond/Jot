import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(new URL("/auth/login?error=oauth-cancelled", baseUrl));
    }

    if (!code) {
      return NextResponse.redirect(new URL("/auth/login?error=oauth-failed", baseUrl));
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: GOOGLE_REDIRECT_URI,
      }),
    });

    const tokens = await tokenResponse.json();
    if (!tokens.access_token) {
      return NextResponse.redirect(new URL("/auth/login?error=oauth-failed", baseUrl));
    }

    // Get user info
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userResponse.json();
    if (!googleUser.email) {
      return NextResponse.redirect(new URL("/auth/login?error=oauth-failed", baseUrl));
    }

    await connectDB();

    // Find or create user
    let user = await User.findOne({ email: googleUser.email });
    if (!user) {
      user = await User.create({
        email: googleUser.email,
        isVerified: true,
        provider: "google",
        providerId: googleUser.id,
      });
    } else if (!user.provider) {
      // Link existing account
      user.provider = "google";
      user.providerId = googleUser.id;
      user.isVerified = true;
      await user.save();
    }

    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return new Response(
      `<html><head></head><body>
        <script>
          document.cookie = "access_token=${jwtToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax";
          window.location.href = "/dashboard/home";
        </script>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (err) {
    console.error("OAuth error:", err);
    return NextResponse.redirect(new URL("/auth/login?error=server-error", baseUrl));
  }
}