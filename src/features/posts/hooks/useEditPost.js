import { useState, useEffect } from "react";
import { getPost, updatePost } from "../services/postApi";
import { uploadImage } from "../services/uploadApi";
import { useGuest } from "@/contexts/GuestContext";

export default function useEditPost(id) {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [post, setPost] = useState(null);
  const { updateGuestPost } = useGuest();

  useEffect(() => {
    async function fetchPost() {
      try {
        // Handle guest posts
        if (id?.startsWith("guest-")) {
          const guestPosts =
            JSON.parse(sessionStorage.getItem("jotful-guest-posts")) || [];

          const guestPost = guestPosts.find((p) => p._id === id);

          if (guestPost) {
            setPost(guestPost);
          }

          setLoading(false);
          return;
        }

        // Handle database posts
        const data = await getPost(id);
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPost();
    }
  }, [id]);

  const update = async (payload) => {
    try {
      setUpdating(true);

      let imageUrl = payload.image;

      // Handle guest posts
      if (id?.startsWith("guest-")) {
        if (payload.image instanceof File) {
          imageUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(payload.image);
          });
        }
        const data = { title: payload.title, content: payload.content, image: imageUrl };
        updateGuestPost(id, data);
        const updatedPost = { ...post, ...data };
        setPost(updatedPost);
        return updatedPost;
      }

      if (payload.image instanceof File) {
        imageUrl = await uploadImage(payload.image);
      }

      // Handle database posts
      const updated = await updatePost(id, {
        title: payload.title,
        content: payload.content,
        image: imageUrl,
      });

      setPost(updated);

      return updated;
    } finally {
      setUpdating(false);
    }
  };

  return {
    post,
    loading,
    updating,
    update,
  };
}