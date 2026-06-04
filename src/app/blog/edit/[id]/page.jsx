"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useGuest } from "@/contexts/GuestContext";

import { Button, Spinner, ProgressBar } from "@/components/ui";
import Image from "next/image";
import usePostForm from "@/features/posts/hooks/usePostForm";
import useImageUpload from "@/features/posts/hooks/useImageUpload";
import useEditPost from "@/features/posts/hooks/useEditPost";
import Header from "@/components/Header";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

export default function EditJot() {
  const { id } = useParams();
  const router = useRouter();

  const { settings } = useSettings();
  const { addNotification } = useNotifications();

  const { post, loading, updating, update } = useEditPost(id);

  const { title, content, setTitle, setContent } = usePostForm(
    settings.autoSave,
  );

  const {
    setSelectedFile,
    selectedFile,
    setImagePreview,
    imagePreview,
    selectImage,
    dragActive,
    removeImage,
    handleDrag,
    handleDrop,
  } = useImageUpload();

  // hydrate form when post loads
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      // hydrate image preview when editing an existing post
      if (post.image) {
        setImagePreview(post.image);
        setSelectedFile(null);
      }
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await update({
        title,
        content,
      });

      router.push("/dashboard/home");
    } catch (err) {
      addNotification(err.message, "error");
    }
  };

  if (loading) {
    return (
      <div className="">
        <Header />
        {loading && (
          <div className="fixed top-0  min-h-screen flex justify-center items-center bg-red-900 left-0 w-full z-10">
            <ProgressBar height="h-2" className="w-2/3" />
          </div>
        )}
        <div className="flex justify-center items-center h-screen w-full">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="flex justify-center items-center">
    <form
          onSubmit={handleSubmit}
          className="bg-gray-200 dark:text-white text-black dark:bg-gray-500/10 dark:shadow-[0_0_20px_rgba(255, 255, 255, 0.1)] shadow-[0_0_20px_rgba(0,0,0,0.7)] rounded-lg p-8 w-[90%] "
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full px-3 py-1 md:p-2 xl:p-3 mb-5 focus:outline-none ring ring-black dark:ring-white focus:ring-2 dark:bg-white/20 bg-black/20 rounded-lg outline-none placeholder:text-white/50"
            required
          />

          <label className="inline-block w-auto max-w-max ring dark:ring-white ring-black px-2 rounded-lg mb-4 text-sm xl:text-base">
            Choose Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                setSelectedFile(file);
                setImagePreview(URL.createObjectURL(file));
              }}
            />
          </label>

          {!imagePreview && (
            <div
              className={`w-full h-62 border-2 border-dashed rounded-lg mb-4 flex items-center justify-center cursor-pointer transition-colors ${
                dragActive
                  ? "border-cyan-500 dark:border-cyan-900 bg-cyan-50 dark:bg-black/90"
                  : "border-black dark:border-white bg-cyan-50 dark:bg-black/90"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <p className="text-gray-600 text-center dark:text-gray-100">
                {dragActive ? (
                  "Drop image here"
                ) : (
                  <>
                    <span className="md:hidden">Tap to select image</span>
                    <span className="hidden md:inline">
                      Drag image here to upload
                    </span>
                  </>
                )}
              </p>
            </div>
          )}

          {imagePreview && (
            <div className="mb-4 xl-text-lg text-center">
              <div
                className="relative w-[95%] max-w-4xl mx-auto mb-3 overflow-hidden rounded-lg"
                style={{ aspectRatio: "16/9" }}
              >
                <Image
                  src={imagePreview}
                  alt="preview"
                  fill
                  className="object-contain"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                className="bg-red-700 dark:bg-red-850"
                onClick={() => {
                  setImagePreview(null);
                  setSelectedFile(null);
                }}
              >
                Remove Image
              </Button>
            </div>
          )}

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="write your content here...."
            rows="5"
            className="w-full px-3 py-1 md:p-2 xl:p-3 mb-5 focus:outline-none ring ring-black dark:ring-white focus:ring-2 dark:bg-white/20 bg-black/20 rounded-lg outline-none placeholder:text-white/50"
            required
          />

          <Button type="submit" disabled={loading || updating} variant="special" className="w-full">
            {loading ? <Spinner size="sm" /> : "Add Jot"}
          </Button>
        </form>
      </section>
    </div>
  );
}
