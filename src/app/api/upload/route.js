import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { uploadFile } from "@/lib/upload";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    // Get token from cookies
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify token
    jwt.verify(token, JWT_SECRET);

    // Get file from formData
    const data = await req.formData();
    const file = data.get("file");
    const quality = data.get("quality") || "medium";

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Upload (local in dev, cloudinary in prod)
    const url = await uploadFile(file, { quality });

    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}