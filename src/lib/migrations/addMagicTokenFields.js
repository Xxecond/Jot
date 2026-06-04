/**
 * Migration script to add magicToken and magicTokenExpiry fields to existing users
 * Run this script if you have existing users that need these fields
 * 
 * Usage: node -r @babel/register src/lib/migrations/addMagicTokenFields.js
 */

import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

async function migrate() {
  try {
    console.log("🔄 Starting migration...");
    await connectDB();

    // Find all users
    const users = await User.find({});
    console.log(`📊 Total users in database: ${users.length}`);

    // Check for users without magicToken field
    const usersWithoutMagicToken = await User.find({
      $or: [
        { magicToken: { $exists: false } },
        { magicTokenExpiry: { $exists: false } }
      ]
    });

    console.log(`⚠️  Users without magicToken fields: ${usersWithoutMagicToken.length}`);

    if (usersWithoutMagicToken.length > 0) {
      console.log("\n📋 Examining first user without fields:");
      const user = usersWithoutMagicToken[0];
      console.log("  → ID:", user._id);
      console.log("  → Email:", user.email);
      console.log("  → isVerified:", user.isVerified);
      console.log("  → All fields:", Object.keys(user.toObject()));
    }

    // Add default values if needed
    const result = await User.updateMany(
      {
        $or: [
          { magicToken: { $exists: false } },
          { magicTokenExpiry: { $exists: false } }
        ]
      },
      {
        $set: {
          magicToken: null,
          magicTokenExpiry: null,
          lastEmailSent: new Date()
        }
      }
    );

    console.log(`✅ Migration complete!`);
    console.log(`   → Modified: ${result.modifiedCount} users`);

    // Verify the fix
    const usersStillMissing = await User.find({
      $or: [
        { magicToken: { $exists: false } },
        { magicTokenExpiry: { $exists: false } }
      ]
    });

    if (usersStillMissing.length === 0) {
      console.log("✅ All users now have magicToken fields!");
    } else {
      console.warn("⚠️  Some users still missing fields:", usersStillMissing.length);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrate();
