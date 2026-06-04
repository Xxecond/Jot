"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { getMe, logoutUser } from "@/features/auth/services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // load user on refresh
  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      setError(null);
      const userData = await getMe();
      setUser(userData);
      console.log("✅ User authenticated:", userData.email);
    } catch (err) {
      // 401 is expected when no token exists - this is NOT an error
      if (err.response?.status === 401) {
        console.log("ℹ️ No active session - user not logged in");
        setUser(null);
      } else {
        console.error("❌ Auth check failed:", err.message);
        setError(err.message);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        error,
        logout,
        refreshUser: initAuth,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
