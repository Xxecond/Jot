import { useEffect, useState } from "react";
import { getPost } from "../services/postApi";

export const usePost = (id, isGuest, guestPosts) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      try {
        if (isGuest) {
          const found = guestPosts.find(p => p._id === id);
          setPost(found || null);
        } else {
          const data = await getPost(id);
          setPost(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id, isGuest, guestPosts]);

  return { post, setPost, loading };
};