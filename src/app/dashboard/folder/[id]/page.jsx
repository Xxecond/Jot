"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

import {BlogCard, SearchBar } from "@/components";
import { Button, ProgressBar } from "@/components/ui";

import { useFolders } from "@/contexts/FolderContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useGuest } from "@/contexts/GuestContext";

import {usePosts} from "@/features/posts/hooks/usePosts";
import usePostFilter from "@/features/posts/hooks/usePostFilter";

export default function FolderPage() {
  const { id } = useParams();
  const [showRemoteProgress, setShowRemoteProgress] = useState(false);

  const { folders } = useFolders();
  const { settings } = useSettings();
  const { isGuest, guestPosts } = useGuest();

  const { posts, loading, removePost } = usePosts();

  useEffect(() => {
    try {
      const flag =
        typeof window !== "undefined" &&
        sessionStorage.getItem("jotful-progress");
      if (flag === "true" && loading) {
        setShowRemoteProgress(true);
      }
    } catch (e) {}

    if (!loading) {
      try {
        if (typeof window !== "undefined")
          sessionStorage.removeItem("jotful-progress");
      } catch {}
      setShowRemoteProgress(false);
    }
  }, [loading]);

  const folder = folders.find((f) => f.id === id);

  const basePosts = isGuest ? guestPosts : posts;

  const filtered = usePostFilter(basePosts, "", settings).filter((p) =>
    folder?.postIds?.includes(p._id),
  );

  return (
    <div className="min-h-screen">
      {(loading || showRemoteProgress) && (
        <div className="fixed top-0  min-h-screen flex justify-center items-center bg-red-900 left-0 w-full z-10">
          <ProgressBar height="h-2" className="w-2/3" />
        </div>
      )}
     
      <SearchBar />

      <section className="p-4">
        {filtered.length > 0 ? (
          filtered.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              onDelete={removePost}
              hideAction
            />
          ))
        ) : (
          <div className="text-center mt-40">
            <p>No posts in folder</p>
            <Button>
              <Link href="/home">Go Home</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
