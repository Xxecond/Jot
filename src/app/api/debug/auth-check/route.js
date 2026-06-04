// app/api/debug/auth-check/route.js
// DEBUG ENDPOINT - Remove in production!
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req) {
  // ⚠️ SECURITY: Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    const result = {
      database: mongoose.connection.readyState === 1 ? "✅ Connected" : "❌ Disconnected",
      timestamp: new Date().toISOString(),
    };

    // Check by userId
    if (userId) {
      console.log(`🔍 Debugging userId: ${userId}`);
      
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        result.userId = { error: "Invalid ObjectId format" };
      } else {
        const user = await User.findById(userId);
        result.userId = user ? 
          {
            found: true,
            id: user._id,
            email: user.email,
            isVerified: user.isVerified,
            hasMagicToken: !!user.magicToken,
            createdAt: user.createdAt,
          } : 
          { found: false, searched: userId };
      }
    }

    // Check by email
    if (email) {
      console.log(`🔍 Debugging email: ${email}`);
      const user = await User.findOne({ email });
      result.email = user ?
        {
          found: true,
          id: user._id,
          email: user.email,
          isVerified: user.isVerified,
          hasMagicToken: !!user.magicToken,
          createdAt: user.createdAt,
        } :
        { found: false, searched: email };
    }

    // Get collection stats
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const unverifiedUsers = await User.countDocuments({ isVerified: false });
    const usersWithMagicToken = await User.countDocuments({ magicToken: { $exists: true, $ne: null } });

    result.stats = {
      totalUsers,
      verifiedUsers,
      unverifiedUsers,
      usersWithActiveMagicToken: usersWithMagicToken,
    };

    if (!userId && !email) {
      // List first 5 users for debugging
      const recentUsers = await User.find().limit(5).sort({ createdAt: -1 });
      result.recentUsers = recentUsers.map(u => ({
        id: u._id,
        email: u.email,
        isVerified: u.isVerified,
        createdAt: u.createdAt,
      }));
    }

    return NextResponse.json(result);

  } catch (err) {
    console.error("❌ Debug endpoint error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
