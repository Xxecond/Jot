import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;
const TWITTER_REDIRECT_URI = process.env.TWITTER_REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  const baseUrl = 'http://localhost:3000';
  
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

    // Retrieve the code_verifier stored in the cookie during the auth initiation
    const cookieStore = await cookies();
    const codeVerifier = cookieStore.get("twitter_code_verifier")?.value;

    if (!codeVerifier) {
      return NextResponse.redirect(new URL("/auth/login?error=oauth-failed", baseUrl));
    }

    // Exchange code for access token
    const credentials = Buffer.from(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`).toString('base64');
    const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        client_id: TWITTER_CLIENT_ID,
        redirect_uri: TWITTER_REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    const tokens = await tokenResponse.json();
    if (!tokens.access_token) {
      console.error("Twitter token exchange failed:", tokens);
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