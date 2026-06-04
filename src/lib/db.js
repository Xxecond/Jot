import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  try{
    await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");
} catch (err){
  console.error("MongoDB connection failed:", err);
  process.exit(1);
}
}
