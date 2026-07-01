"use client";

import { useState, useEffect } from "react";
import { BlogCard, SearchBar } from "@/components";
import { ProgressBar, Button } from "@/components/ui";
import Modal from "@/components/Modal";
import Link from "next/link";

import { useFolders } from "@/contexts/FolderContext";
import { useGuest } from "@/contexts/GuestContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/context/authContext";

import { usePosts } from "@/features/posts/hooks/usePosts";
import usePostFilter from "@/features/posts/hooks/usePostFilter";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [actionType, setActionType] = useState(null); // "delete" | "remove"

  const { isGuest, guestPosts, hydrated, deleteGuestPost } = useGuest();
  const { settings } = useSettings();
  const { user } = useAuth();

  const { posts, loading, removePost } = usePosts(
    isGuest,
    guestPosts,
    user,
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

  const getAccentBg = () => {
    switch (settings.cardStyle) {
      case 'slate':    return 'bg-slate-600 hover:bg-slate-500 dark:bg-slate-800';
      case 'rose':     return 'bg-rose-500 hover:bg-rose-400 dark:bg-rose-800';
      case 'emerald':  return 'bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-900';
      case 'midnight': return 'bg-indigo-900 hover:bg-indigo-800 dark:bg-gray-950';
      default:         return '';
    }
  };

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
              <Button variant="special" className={getAccentBg()}>
                <Link href="/dashboard/create">+ Add Jot</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="flex justify-center mt-40">
            <Button variant="special" className={getAccentBg()}>
              <Link href="/dashboard/create">CREATE JOT</Link>
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
