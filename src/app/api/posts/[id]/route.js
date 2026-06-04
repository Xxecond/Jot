// app/api/posts/[id]/route.js
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { uploadFile } from "@/lib/upload";

const JWT_SECRET = process.env.JWT_SECRET;

// Helper: get userId from httpOnly cookie
async function getUserId(req) {
  const token = req.cookies.get("access_token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId || decoded.id;
  } catch {
    return null;
  }
}

// GET one post (public – no auth needed)
export async function GET(req, { params }) {
  // Handle both sync and async params
  const resolvedParams = await params;
  const { id } = resolvedParams;
  console.log("GET post request for ID:", id);

  try {
    await connectDB();
    console.log("Database connected, searching for post...");

    const post = await Post.findById(id);
    console.log("Post found:", !!post);

    if (!post) {
      console.log("Post not found in database");
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("GET post error:", error);
    return NextResponse.json({ error: "Failed to load post" }, { status: 500 });
  }
}

// PUT – update post
export async function PUT(req, { params }) {
  // Handle both sync and async params
  const resolvedParams = await params;
  const { id } = resolvedParams;
  console.log("PUT request for post ID:", id);

  try {
    await connectDB();
    console.log("Database connected for PUT request");

    const userId = await getUserId(req);
    console.log("User ID from token:", userId);

    if (!userId) {
      console.log("No user ID found - unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    let title;
    let content;
    let removeImage;
    let image;
    let imageUrl;

    if (
      contentType.includes("multipart/form-data") ||
      contentType.includes("application/x-www-form-urlencoded")
    ) {
      const formData = await req.formData();
      title = formData.get("title");
      content = formData.get("content");
      removeImage = formData.get("removeImage");
      image = formData.get("image"); // new file
      imageUrl = formData.get("imageUrl"); // existing URL from frontend

      console.log("Form data received:", {
        title,
        content,
        hasImage: !!image,
        imageUrl,
        removeImage,
      });
    } else {
      const json = await req.json();
      title = json.title;
      content = json.content;
      removeImage = json.removeImage;
      imageUrl = json.imageUrl;
      image = json.image;

      console.log("JSON data received:", {
        title,
        content,
        imageUrl,
        removeImage,
      });
    }

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content required" },
        { status: 400 },
      );
    }

    const post = await Post.findOne({ _id: id, userId });
    console.log("Post found for update:", !!post);

    if (!post) {
      return NextResponse.json(
        { error: "Post not found or unauthorized" },
        { status: 404 },
      );
    }

    let finalImageUrl = post.image;

    // Use existing URL if sent
    if (imageUrl && typeof imageUrl === "string" && imageUrl.trim()) {
      finalImageUrl = imageUrl;
    }
    // Upload new image if file provided
    else if (image && typeof image === "object") {
      finalImageUrl = await uploadFile(image);
    }
    // Remove image if requested
    else if (removeImage === "true") {
      finalImageUrl = "";
    }

    post.title = title;
    post.content = content;
    post.image = finalImageUrl;
    await post.save();

    console.log("Post updated successfully");
    return NextResponse.json(post);
  } catch (error) {
    console.error("PUT post error:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 },
    );
  }
}

// DELETE post
export async function DELETE(req, { params }) {
  // Handle both sync and async params
  const resolvedParams = await params;
  const { id } = resolvedParams;
  console.log("DELETE request for post ID:", id);

  try {
    await connectDB();
    console.log("Database connected for DELETE request");

    const userId = await getUserId(req);
    console.log("User ID from token:", userId);

    if (!userId) {
      console.log("No user ID found - unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await Post.findOneAndDelete({ _id: id, userId });
    console.log("Post deleted:", !!deleted);

    if (!deleted) {
      return NextResponse.json(
        { error: "Post not found or unauthorized" },
        { status: 404 },
      );
    }

    console.log("Post deleted successfully");
    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    console.error("DELETE post error:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
