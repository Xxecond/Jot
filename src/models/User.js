import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    provider: {
      type: String,
      enum: ["google", "twitter", "magic"],
      default: "magic",
    },

    providerId: String,

    // ✅ Magic Link Authentication Fields
    magicToken: {
      type: String,
      default: null,
      sparse: true, // Allows multiple null values (for unique index)
    },

    magicTokenExpiry: {
      type: Date,
      default: null,
    },

    lastEmailSent: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// ✅ Create index for efficient magic token lookups
userSchema.index({ magicToken: 1, magicTokenExpiry: 1 });

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

export default User;