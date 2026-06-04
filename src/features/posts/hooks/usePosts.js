import { useEffect, useState } from "react";
import { getPosts } from "../services/postApi";

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { posts, setPosts, loading };
};