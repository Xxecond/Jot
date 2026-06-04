import api from "@/lib/api/api";

// GET all posts
export const getPosts = async () => {
  const res = await api.get("/api/posts");
  return res.data;
};

// GET single post
export const getPost = async (id) => {
  const res = await api.get(`/api/posts/${id}`);
  return res.data;
};

// CREATE post
export const createPost = async (data) => {
  const res = await api.post("/api/posts", data);
  return res.data;
};

// UPDATE post
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

// DELETE post
export const deletePost = async (id) => {
  const res = await api.delete(`/api/posts/${id}`);
  return res.data;
};