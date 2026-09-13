"use client";

import { createContext, useContext, useState, useEffect } from "react";

const FavContext = createContext();

export default function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("jotful-favorites");
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  const toggleFavorite = (postId) => {
    const isFav = favorites.includes(postId);
    const updated = isFav
      ? favorites.filter((id) => id !== postId)
      : [...favorites, postId];
    setFavorites(updated);
    localStorage.setItem("jotful-favorites", JSON.stringify(updated));
    return !isFav;
  };

  const removeFavorite = (postId) => {
    setFavorites((prev) => prev.filter((id) => id !== postId));
  };

  const isFavorite = (postId) => favorites.includes(postId);

  return (
    <FavContext.Provider value={{ favorites, removeFavorite, toggleFavorite, isFavorite }}>
      {children}
    </FavContext.Provider>
  );
}

export const useFav = () =>  useContext(FavContext);


