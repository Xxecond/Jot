import { useState, useEffect } from "react";
import { getPost, updatePost } from "../services/postApi";

export default function useEditPost(id) {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getPost(id);
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchPost();
  }, [id]);

  const update = async (payload) => {
    // show global progress until dashboard finishes fetching
    try {
      if (typeof window !== "undefined")
        sessionStorage.setItem("jotful-progress", "true");
    } catch {}

    setUpdating(true);

    try {
      const updated = await updatePost(id, payload);
      setPost(updated);
      return updated;
    } finally {
      setUpdating(false);
    }
  };

  return { post, loading, updating, update };
}
