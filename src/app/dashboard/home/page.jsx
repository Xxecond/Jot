"use client";

import { useState, useEffect } from "react";
import { BlogCard, SearchBar } from "@/components";
import { ProgressBar, Button } from "@/components/ui";
import Modal from "@/components/Modal";
import Link from "next/link";

import { useFolders } from "@/contexts/FolderContext";
import { useGuest } from "@/contexts/GuestContext";
import { useSettings } from "@/contexts/SettingsContext";

import { usePosts } from "@/features/posts/hooks/usePosts";
import usePostFilter from "@/features/posts/hooks/usePostFilter";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [actionType, setActionType] = useState(null); // "delete" | "remove"

  const { isGuest, guestPosts, hydrated, deleteGuestPost } = useGuest();
  const { settings } = useSettings();

  const { posts, loading, removePost } = usePosts(
    isGuest,
    guestPosts,
    hydrated,
    deleteGuestPost,
  );

  const [showRemoteProgress, setShowRemoteProgress] = useState(false);

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

  const filtered = usePostFilter(posts, searchTerm, settings);

  return (
    <div className="min-h-screen">
      {(loading || showRemoteProgress) && (
        <div className="fixed top-0  min-h-screen flex justify-center items-center bg-white dark:bg-black/90 left-0 w-full z-10">
          <ProgressBar height="h-2" className="w-2/3" />
        </div>
      )}
      <SearchBar setSearchTerm={setSearchTerm} />

      <section className="px-4 py-6">
        {filtered.length > 0 ? (
          <>
            {filtered.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                actionLabel="Delete"
                variant ="danger"
                onDelete={() => {
                  setSelectedId(blog._id);
                  setActionType("delete");
                  setModalOpen(true);
                }}
              />
            ))}

            <div className="flex justify-center my-8">
              <Button variant="special">
                <Link href="/dashboard/create">+ Add Jot</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="flex justify-center mt-40">
            <Button variant="special">
              <Link href="/dashboard/create">CREATE NEW JOT</Link>
            </Button>
          </div>
        )}
      </section>
            <Modal
        open={modalOpen}
        message="Are you sure you want to delete this post?"
        onCancel={() => setModalOpen(false)}
        onConfirm={() => {
          removePost(selectedId);
          setModalOpen(false);
        }}
      />

    </div>
  );
}
