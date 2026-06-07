import { useEffect, useState } from "react";
import { getPosts, deletePost } from "../services/postApi";

export const usePosts = (isGuest, guestPosts = [], user) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load posts
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);

      try {
        if (isGuest) {
          setPosts(guestPosts);
          return;
        } 
        if(!user) {
          setPosts([]);
          return;
        }
       const data = await getPosts();
       setPosts(data); 
      } catch (err) {
        if(err.response?.status !== 401){
        console.error("Failed to load posts:", err);
      } 
    }finally {
        setLoading(false);
      }
    };

    fetch();
  }, [isGuest, user]); // 👈 keep this clean

  // sync guest posts separately
  useEffect(() => {
    if (isGuest) {
      setPosts(guestPosts);
    }
  }, [guestPosts, isGuest]);

  // REAL DELETE (DB only)
  const removePost = async (id) => {
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return {
    posts,
    setPosts,
    loading,
    removePost, // ✅ IMPORTANT (you were missing this)
  };
};