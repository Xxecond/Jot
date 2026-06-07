import api from "@/lib/api/api";

/**
 * FETCH POSTS (authenticated user)
 */
export const getPosts = async () => {
  const res = await api.get("/api/posts");
  return res.data;
};

/**
 * FETCH SINGLE POST
 */
export const getPost = async (id) => {
  const res = await api.get(`/api/posts/${id}`);
  return res.data;
};

/**
 * CREATE POST
 */
export const createPost = async (data) => {
  const res = await api.post("/api/posts", data);
  return res.data;
};

/**
 * UPDATE POST
 */
export const updatePost = async (id, data) => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("content", data.content);

  if (data.image instanceof File) {
    formData.append("image", data.image);
  } else if (typeof data.image === "string" && data.image.trim()) {
    formData.append("imageUrl", data.image);
  }

  if (data.removeImage) {
    formData.append("removeImage", "true");
  }

  const res = await api.put(`/api/posts/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

/**
 * ❌ PERMANENT DELETE (DB)
 * ONLY use in HOME or admin actions
 */
export const deletePost = async (id) => {
  const res = await api.delete(`/api/posts/${id}`);
  return res.data;
};