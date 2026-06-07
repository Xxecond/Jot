import { useState, useEffect } from "react";
import { getPost, updatePost } from "../services/postApi";
import { uploadImage } from "../services/uploadApi";

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
    try {
      setUpdating(true);

      let imageUrl = payload.image;

      if(payload.image instanceof File){
        imageUrl = await uploadImage(payload.image)
      }
      const updated = await updatePost(id, {
        title: payload.title,
        content: payload.content,
        image: imageUrl
      })

      setPost(updated);
      return updated;
    } finally {
      setUpdating(false);
    }
  };

  return { post, loading, updating, update };
}
