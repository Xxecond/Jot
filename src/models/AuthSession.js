import mongoose from "mongoose";

const authSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    authenticated: {
      type: Boolean,
      default: false,
    },

    denied: {
      type: Boolean,
      default: false,
    },

    jwtToken: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "authenticated",
        "denied",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
    expires: 900, // 15 minutes auto-delete
  }
);

const AuthSession =
  mongoose.models.AuthSession ||
  mongoose.model(
    "AuthSession",
    authSessionSchema
  );

export default AuthSession;