"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import usePost from "@/features/posts/hooks/usePost";

export default function BlogDetails() {
  const { id } = useParams();

  const { post, loading } = usePost(id);

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl">{post.title}</h1>

      {post.image && (
        <Image
          src={post.image}
          width={600}
          height={300}
          alt="blog"
        />
      )}

      <p>{post.content}</p>
    </div>
  );
}