// app/api/auth/magic-link/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { sendMagicLinkEmail } from "@/lib/sendEmail";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { email, sessionId, action } = await req.json(); // action: 'signup' or 'login'

    console.log("📧 Magic-link request:", { email, sessionId, action });

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    
    // Handle signup
    if (action === 'signup') {
      if (existingUser) {
        if (!existingUser.isVerified) {
          console.log("🔄 Resending verification email for unverified user:", email);
          
          // Allow resending verification email
          const token = crypto.randomBytes(32).toString("hex");
          existingUser.magicToken = token;
          existingUser.magicTokenExpiry = Date.now() + 15 * 60 * 1000;
          existingUser.lastEmailSent = Date.now();
          
          const saved = await existingUser.save();
          console.log("✅ Token saved for resend:", { email, tokenLength: token.length, savedId: saved._id });

          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
          const magicLink = `${baseUrl}/api/auth/magic-callback?token=${token}`;
          
          console.log("📨 Sending magic link email to:", email);
          await sendMagicLinkEmail(email, magicLink, sessionId);
          console.log("✅ Email sent successfully");

          return NextResponse.json({ 
            message: "Verification email resent! Check your email.",
            isUnverified: true,
            waitingUrl: `${baseUrl}/auth/waiting`
          });
        }
        return NextResponse.json({ error: "Email already registered. Please login instead." }, { status: 400 });
      }
      
      console.log("🆕 Creating new user for signup:", email);
      
      // Create new user
      const user = await User.create({ 
        email,
        isVerified: false,
        lastEmailSent: Date.now()
      });
      
      console.log("✅ User created:", { email, id: user._id });
      
      const token = crypto.randomBytes(32).toString("hex");
      user.magicToken = token;
      user.magicTokenExpiry = Date.now() + 15 * 60 * 1000;
      
      const saved = await user.save();
      console.log("✅ Magic token saved for new user:", { email, tokenLength: token.length, savedId: saved._id });

      // Verify token was saved
      const verification = await User.findById(saved._id).select("magicToken");
      console.log("🔍 Token verification check:", { hasMagicToken: !!verification.magicToken, tokenMatches: verification.magicToken === token });

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const magicLink = `${baseUrl}/api/auth/magic-callback?token=${token}`;

      console.log("📨 Sending magic link email to:", email);
      await sendMagicLinkEmail(email, magicLink, sessionId);
      console.log("✅ Email sent successfully");

      return NextResponse.json({ 
        message: "Account created! Check your email to verify.",
        waitingUrl: `${baseUrl}/auth/waiting`
      });
    }
    
    // Handle login
    if (action === 'login') {
      if (!existingUser) {
        return NextResponse.json({ error: "No account found. Please signup first." }, { status: 400 });
      }
      
      if (!existingUser.isVerified) {
        return NextResponse.json({ error: "Please verify your email first. Check your inbox or signup again to resend." }, { status: 403 });
      }
      
      console.log("🔐 Sending login magic link for verified user:", email);
      
      const token = crypto.randomBytes(32).toString("hex");
      existingUser.magicToken = token;
      existingUser.magicTokenExpiry = Date.now() + 15 * 60 * 1000;
      existingUser.lastEmailSent = Date.now();
      
      const saved = await existingUser.save();
      console.log("✅ Magic token saved for login:", { email, tokenLength: token.length, savedId: saved._id });

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const magicLink = `${baseUrl}/api/auth/magic-callback?token=${token}`;

      console.log("📨 Sending login magic link email to:", email);
      await sendMagicLinkEmail(email, magicLink, sessionId);
      console.log("✅ Email sent successfully");

      return NextResponse.json({ 
        message: "Magic link sent! Check your email.",
        waitingUrl: `${baseUrl}/auth/waiting`
      });
    }
    
    // Fallback - treat as login if no action specified
    console.log("⚠️ No action specified, using fallback logic");
    
    let user = existingUser;
    if (!user) {
      user = await User.create({ email });
      console.log("✅ User created (fallback):", { email, id: user._id });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.magicToken = token;
    user.magicTokenExpiry = Date.now() + 15 * 60 * 1000;
    
    const saved = await user.save();
    console.log("✅ Magic token saved (fallback):", { email, tokenLength: token.length, savedId: saved._id });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const magicLink = `${baseUrl}/api/auth/magic-callback?token=${token}`;

    console.log("📨 Sending magic link email (fallback):", email);
    await sendMagicLinkEmail(email, magicLink, sessionId);
    console.log("✅ Email sent successfully");

    return NextResponse.json({ 
      message: "Magic link sent",
      waitingUrl: `${baseUrl}/auth/waiting`
    });
  } catch (err) {
    console.error("❌ Magic-link error:", err);
    console.error("   → Stack:", err.stack);
    return NextResponse.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}