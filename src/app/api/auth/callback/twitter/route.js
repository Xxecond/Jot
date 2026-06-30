import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;
const TWITTER_REDIRECT_URI = process.env.TWITTER_REDIRECT_URI;
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

    // Exchange code for access token
    const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${Buffer.from(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        redirect_uri: TWITTER_REDIRECT_URI,
        code_verifier: 'challenge'
      }),
    });

    const tokens = await tokenResponse.json();
    if (!tokens.access_token) {
      return NextResponse.redirect(new URL("/auth/login?error=oauth-failed", baseUrl));
    }

    // Get user info
    const userResponse = await fetch("https://api.twitter.com/2/users/me?user.fields=name,username", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const userData = await userResponse.json();
    const twitterUser = userData.data;
    
    if (!twitterUser) {
      return NextResponse.redirect(new URL("/auth/login?error=oauth-failed", baseUrl));
    }

    await connectDB();

    // Find or create user (Twitter doesn't always provide email)
    let user = await User.findOne({ providerId: twitterUser.id, provider: "twitter" });
    if (!user) {
      user = await User.create({
        email: `${twitterUser.username}@twitter.local`, // Fallback email
        isVerified: true,
        provider: "twitter",
        providerId: twitterUser.id,
      });
    }

    // Create JWT
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.redirect(new URL("/dashboard/home", baseUrl));
    response.cookies.set("access_token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/"
    });

    return response;
  } catch (err) {
    console.error("OAuth error:", err);
    return NextResponse.redirect(new URL("/auth/login?error=server-error", baseUrl));
  }
}