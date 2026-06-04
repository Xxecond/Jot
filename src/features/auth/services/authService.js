import api from "@/lib/api/api";
import { authSchema } from "@/lib/validations/authSchema";
/**
 * Send magic link for login/signup
 */
export const sendMagicLink = async (email, sessionId = null, action = "signup") => {
  authSchema.parse({ email });
  const { data } = await api.post("/api/auth/magic-link", {
    email,
    sessionId,
    action,
  });

  return data;
};

/**
 * Get current authenticated user
 */
export const getMe = async () => {
  try {
    const { data } = await api.get("/api/auth/me");
    return data;
  } catch (err) {
    if (err.response?.status === 401) {
      // Expected when no token - re-throw to let caller handle
      console.log("ℹ️ No active session");
      throw err;
    }
    // Other errors should be logged
    console.error("❌ Failed to get user:", err.message);
    throw err;
  }
};

/**
 * Clear all auth + guest storage
 */
export const clearAuthStorage = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");

  sessionStorage.removeItem("jotful-guest");

  sessionStorage.removeItem("jotful-guest-posts");
};

/**
 * Logout user (server + client cleanup)
 */
export const logoutUser = async () => {
  if (typeof window === "undefined") return;

  try {
    await api.post("/api/auth/logout");
    console.log("✅ Logged out successfully");
  } catch (err) {
    console.error("⚠️ Logout request failed (but clearing local data anyway):", err.message);
  } finally {
    clearAuthStorage();
  }
};

export const checkSession = async (sessionId) => {
  try {
    const { data } = await api.get(`/api/auth/check-session?sessionId=${sessionId}`);
    return data;
  } catch (err) {
    console.error("❌ Failed to check session:", err.message);
    throw err;
  }
};
