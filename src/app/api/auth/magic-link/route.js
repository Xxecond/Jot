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

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    
    // Handle signup
    if (action === 'signup') {
      if (existingUser) {
        if (!existingUser.isVerified) {
          
          // Allow resending verification email
          const token = crypto.randomBytes(32).toString("hex");
          existingUser.magicToken = token;
          existingUser.magicTokenExpiry = Date.now() + 15 * 60 * 1000;
          existingUser.lastEmailSent = Date.now();
          
         await existingUser.save();
        
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
          const magicLink = `${baseUrl}/api/auth/magic-callback?token=${token}`;
          
          await sendMagicLinkEmail(email, magicLink, sessionId);
        
          return NextResponse.json({ 
            message: "Verification email resent! Check your email.",
            });
        }
        return NextResponse.json({ error: "Email already registered. Please login instead." }, { status: 409 });
      }
        
      // Create new user
      const user = await User.create({ 
        email,
        isVerified: false,
        lastEmailSent: Date.now()
      });
      
      
      const token = crypto.randomBytes(32).toString("hex");
      user.magicToken = token;
      user.magicTokenExpiry = Date.now() + 15 * 60 * 1000;
      
       await user.save();
      
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const magicLink = `${baseUrl}/api/auth/magic-callback?token=${token}`;

      await sendMagicLinkEmail(email, magicLink, sessionId);
      
      return NextResponse.json({ 
        message: "Account created!",
      });
    }
    
    // Handle login
    if (action === 'login') {
      if (!existingUser) {
        return NextResponse.json({ error: "No account found. Please signup first." }, { status: 404 });
      }
      
      if (!existingUser.isVerified) {
        return NextResponse.json({ error: "Please verify your email first." }, { status: 403 });
      }
      
      const token = crypto.randomBytes(32).toString("hex");
      existingUser.magicToken = token;
      existingUser.magicTokenExpiry = Date.now() + 15 * 60 * 1000;
      existingUser.lastEmailSent = Date.now();
      
      await existingUser.save();
      
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const magicLink = `${baseUrl}/api/auth/magic-callback?token=${token}`;

      await sendMagicLinkEmail(email, magicLink, sessionId);
      
      return NextResponse.json({ 
        message: "Magic link sent! Check your email.",
       });
    }
    
    // Fallback - treat as login if no action specified
    
    return NextResponse.json(
      { error: "Invalid request action"},
    {status: 400}
  );
  } catch (err) {
    console.error("Magic-link error:", err);
    return NextResponse.json({ error: "Server error" }, 
      { status: 500 });
  }
}