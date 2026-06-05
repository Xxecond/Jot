"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { BlogCard, SearchBar } from "@/components";
import { Button, ProgressBar, Modal } from "@/components/ui";

import { useFolders } from "@/contexts/FolderContext";
import { useSettings } from "@/contexts/SettingsContext";

import { usePosts } from "@/features/posts/hooks/usePosts";
import usePostFilter from "@/features/posts/hooks/usePostFilter";

export default function Favorites() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState({ open: false });
  const [showRemoteProgress, setShowRemoteProgress] = useState(false);

  const { favorites } = useFolders();
  const { settings } = useSettings();

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

  const filtered = usePostFilter(posts, searchTerm, settings).filter((b) =>
    favorites.includes(b._id),
  );

  return (
    <div className="min-h-screen ">
      {(loading || showRemoteProgress) && (
        <div className="fixed top-0  min-h-screen flex justify-center items-center bg-white dark:bg-black/90 left-0 w-full z-10">
          <ProgressBar height="h-2" className="w-2/3" />
        </div>
      )}

      <SearchBar setSearchTerm={setSearchTerm} />

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
            <p>No favorites yet</p>
            <Button>
              <Link href="/home">Go Home</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
