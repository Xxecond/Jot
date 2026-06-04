// app/api/posts/route.js (or wherever it is)
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Helper to get and verify token from cookie
async function getUserIdFromCookie(req) {
  const token = req.cookies.get("access_token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId || decoded.id; // whatever you put in JWT
  } catch (err) {
    return null;
  }
}

// GET all posts
export async function GET(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromCookie(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// POST new post
export async function POST(req) {
  try {
    await connectDB();

    const userId = await getUserIdFromCookie(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, image } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content required" }, { status: 400 });
    }

    const post = await Post.create({
      title: body.title,
      content:body.content,
      image:body.image,
      userId,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("POST post error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}