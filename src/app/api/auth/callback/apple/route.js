import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID;
const APPLE_CLIENT_SECRET = process.env.APPLE_CLIENT_SECRET;
const APPLE_REDIRECT_URI = process.env.APPLE_REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const formData = await req.formData();
    const code = formData.get("code");
    const user = formData.get("user");
    const error = formData.get("error");

    if (error) {
      return NextResponse.redirect(new URL("/login?error=oauth-cancelled", req.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL("/login?error=oauth-failed", req.url));
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://appleid.apple.com/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: APPLE_CLIENT_ID,
        client_secret: APPLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: APPLE_REDIRECT_URI,
      }),
    });

    const tokens = await tokenResponse.json();
    if (!tokens.id_token) {
      return NextResponse.redirect(new URL("/login?error=oauth-failed", req.url));
    }

    // Decode JWT to get user info
    const payload = JSON.parse(Buffer.from(tokens.id_token.split('.')[1], 'base64').toString());
    
    let userInfo = { email: payload.email, id: payload.sub };
    if (user) {
      const userData = JSON.parse(user);
      userInfo.name = userData.name?.firstName + ' ' + userData.name?.lastName;
    }

    if (!userInfo.email) {
      return NextResponse.redirect(new URL("/login?error=oauth-failed", req.url));
    }

    await connectDB();

    // Find or create user
    let dbUser = await User.findOne({ email: userInfo.email });
    if (!dbUser) {
      dbUser = await User.create({
        email: userInfo.email,
        name: userInfo.name || "Apple User",
        isVerified: true,
        provider: "apple",
        providerId: userInfo.id,
      });
    } else if (!dbUser.provider) {
      // Link existing account
      dbUser.provider = "apple";
      dbUser.providerId = userInfo.id;
      dbUser.isVerified = true;
      await dbUser.save();
    }

    // Create JWT
    const jwtToken = jwt.sign(
      { userId: dbUser._id, email: dbUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.redirect(new URL("/dashboard/home", req.url));
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
    return NextResponse.redirect(new URL("/login?error=server-error", req.url));
  }
}