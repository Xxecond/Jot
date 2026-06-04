// app/api/auth/me/route.js
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    await connectDB();

    let token = null;
    let tokenSource = null;

    // 1. Check cookie (primary - from magic-callback or check-session)
    token = req.cookies.get("access_token")?.value;
    if (token) tokenSource = "cookie";

    // 2. Fallback: Check Authorization header (from localStorage / axios)
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
        tokenSource = "header";
      }
    }

    if (!token) {
      console.warn("❌ /api/auth/me - No token in cookie or Authorization header");
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    console.log(`ℹ️ /api/auth/me - Token found in ${tokenSource}`);

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.error("❌ /api/auth/me - Invalid JWT:", err.message);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.log("🔍 /api/auth/me - Decoded userId:", decoded.userId, "| Email:", decoded.email);

    // ✅ Convert string ID to ObjectId if needed
    let userId = decoded.userId;
    if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
      userId = new mongoose.Types.ObjectId(userId);
    }

    const user = await User.findById(userId)
      .select("email name isVerified provider");

    if (!user) {
      console.warn("⚠️ /api/auth/me - User not found in database");
      console.warn("   → Searched for userId:", userId);
      console.warn("   → Email from token:", decoded.email);
      console.warn("   → Token may be from deleted user or invalid JWT");
      
      // Try to find by email as fallback (for debugging)
      const userByEmail = await User.findOne({ email: decoded.email })
        .select("_id email name isVerified provider");
      
      if (userByEmail) {
        console.log("   → ℹ️ Found user by email but ID mismatch!");
        console.log("      Token userId: ", userId);
        console.log("      DB userId: ", userByEmail._id);
      }

      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("✅ /api/auth/me - User authenticated:", user.email);

    return NextResponse.json({
      id: user._id,
      email: user.email,
      name: user.name,
      isVerified: user.isVerified,
      provider: user.provider,
    });

  } catch (error) {
    console.error("❌ /api/auth/me error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}