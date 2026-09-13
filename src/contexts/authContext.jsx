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
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 404) {
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
