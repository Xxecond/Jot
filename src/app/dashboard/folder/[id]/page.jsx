"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

import { BlogCard, SearchBar } from "@/components";
import { Button, ProgressBar } from "@/components/ui";

import { useFolders } from "@/contexts/FolderContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useGuest } from "@/contexts/GuestContext";

import { useAuth } from "@/context/authContext";
import { usePosts } from "@/features/posts/hooks/usePosts";
import usePostFilter from "@/features/posts/hooks/usePostFilter";

export default function FolderPage() {
  const { id } = useParams();
  const [showRemoteProgress, setShowRemoteProgress] = useState(false);

    const { folders, removePostFromFolder } = useFolders();
  const { settings } = useSettings();
  const { isGuest, guestPosts } = useGuest();
  const { user } = useAuth();

  const { posts, loading, removePost } = usePosts(isGuest, guestPosts, user);

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
        <div className="fixed top-0  min-h-screen flex justify-center items-center bg-white dark:bg-black left-0 w-full z-10">
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
              hideAction
              actionLabel="Remove"
              variant="warning"
              onDelete={() => {
                removePostFromFolder(id, blog._id);
              }}
            />
          ))
        ) : (
          <div className="text-center mt-35">
            <p className="pb-3">No posts in folder</p>
            <Button variant="special">
              <Link href="/dashboard/home">Go Home</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
