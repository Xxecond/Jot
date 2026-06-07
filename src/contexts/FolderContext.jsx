"use client";

import { createContext, useContext, useState, useEffect } from "react";

const FolderContext = createContext();

export const useFolders = () => {
  const context = useContext(FolderContext);
  if (!context) throw new Error("useFolders must be used within FolderProvider");
  return context;
};

export const FolderProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeFolder, setActiveFolder] = useState(null);

  useEffect(() => {
    const savedFolders = localStorage.getItem("jotful-folders");
    const savedFavorites = localStorage.getItem("jotful-favorites");
    if (savedFolders) setFolders(JSON.parse(savedFolders));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  const addFolder = (name) => {
    if (folders.length >= 5) return null;
    const folder = { id: Date.now().toString(), name, postIds: [] };
    const updated = [...folders, folder];
    setFolders(updated);
    localStorage.setItem("jotful-folders", JSON.stringify(updated));
    return folder;
  };

  const addFolderWithPost = (name, postId) => {
    if (folders.length >= 5) return null;
    const folder = { id: Date.now().toString(), name, postIds: [postId] };
    const updated = [...folders, folder];
    setFolders(updated);
    localStorage.setItem("jotful-folders", JSON.stringify(updated));
    return folder;
  };

  const addPostToFolder = (folderId, postId) => {
    const updated = folders.map(f =>
      f.id === folderId && !f.postIds.includes(postId)
        ? { ...f, postIds: [...f.postIds, postId] }
        : f
    );
    setFolders(updated);
    localStorage.setItem("jotful-folders", JSON.stringify(updated));
  };

  const removePostFromFolder = (folderId, postId) => {
    const updated = folders.map(f =>
      f.id === folderId ? { ...f, postIds: f.postIds.filter(id => id !== postId) } : f
    );
    setFolders(updated);
    localStorage.setItem("jotful-folders", JSON.stringify(updated));
  };

  const deleteFolder = (folderId) => {
    const updated = folders.filter(f => f.id !== folderId);
    setFolders(updated);
    localStorage.setItem("jotful-folders", JSON.stringify(updated));
  };

  const toggleFavorite = (postId) => {
    const isFav = favorites.includes(postId);
    const updated = isFav ? favorites.filter(id => id !== postId) : [...favorites, postId];
    setFavorites(updated);
    localStorage.setItem("jotful-favorites", JSON.stringify(updated));
    return !isFav;
  };

  const removeFavorite = (postId) => {
    setFavorites((prev) => prev.filter((id) => id !== postId))
  }

  const isFavorite = (postId) => favorites.includes(postId);

  return (
    <FolderContext.Provider value={{ folders, favorites, activeFolder, setActiveFolder, addFolder, addFolderWithPost, addPostToFolder, removePostFromFolder, deleteFolder, toggleFavorite, isFavorite, removeFavorite }}>
      {children}
    </FolderContext.Provider>
  );
};
