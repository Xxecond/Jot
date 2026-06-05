 // lib/postService.js

// Helper: get token from localStorage safely
function getAuthToken() {
  if (typeof window !== "undefined") {
    // Check localStorage first (remember me), then sessionStorage (no-remember)
    const local = localStorage.getItem("token");
    if (local) return local;
    const sess = sessionStorage.getItem("token");
    if (sess) return sess;
  }
  return null;
}

// Helper: prepare headers with optional token
function getHeaders(contentType = "application/json") {
  const headers = {};
  if (contentType) headers["Content-Type"] = contentType;

  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return headers;
}

// ✅ Create a new post
export async function createPost(postData) {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Include cookies
    body: JSON.stringify(postData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || `Failed to create post: ${res.status}`);
  }
  return res.json();
}

// ✅ Get a single post by ID
export async function getPostById(id) {
  const res = await fetch(`/api/posts/${id}`, {
    credentials: "include", // Include cookies
  });

  if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`);
  return res.json();
}

// ✅ Get all posts for the logged-in user
export async function getUserPosts() {
  const res = await fetch("/api/posts", {
    credentials: "include", // Include cookies
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || `Failed to fetch posts: ${res.status}`);
  }
  return res.json();
}

// ✅ Update a post using FormData (supports images)
export async function updatePost(id, { title, content, image }) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);

  if (image instanceof File) {
    formData.append("image", image); // raw file upload
  } else if (typeof image === "string" && image) {
    formData.append("imageUrl", image); // Cloudinary URL string
  } else if (image === "") {
    formData.append("removeImage", "true");
  }

  const res = await fetch(`/api/posts/${id}`, {
    method: "PUT",
    credentials: "include", // Include cookies
    body: formData,
  });

  if (!res.ok) throw new Error(`Failed to update post: ${res.status}`);
  return res.json();
}

// ✅ Delete a post
export async function deletePost(id) {
  const res = await fetch(`/api/posts/${id}`, {
    method: "DELETE",
    credentials: "include", // Include cookies
  });

  if (!res.ok) throw new Error(`Failed to delete post: ${res.status}`);
  return res.json();
}
