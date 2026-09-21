"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./authContext";
import { JsonWebTokenError } from "jsonwebtoken";

const FavContext = createContext();

export default function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  const storageKey = user ? `jotful-favorites-${user.id}` : null;

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    const savedFavorites = localStorage.getItem(storageKey);
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (err) {
        console.error("Failed to parse saved folders:", err);
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [user, storageKey]);

  const toggleFavorite = (postId) => {
    if (!user) return false;
    const isFav = favorites.includes(postId);
    const updated = isFav
      ? favorites.filter((id) => id !== postId)
      : [...favorites, postId];
    setFavorites(updated);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
    return !isFav;
  };

  const removeFavorite = (postId) => {
    if (!user) return;
    const updated = favorites.filter((id) => id !== postId);
    setFavorites(updated);

    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  };

  const isFavorite = (postId) => favorites.includes(postId);

  return (
    <FavContext.Provider
      value={{ favorites, removeFavorite, toggleFavorite, isFavorite }}
    >
      {children}
    </FavContext.Provider>
  );
}

export const useFav = () => useContext(FavContext);
