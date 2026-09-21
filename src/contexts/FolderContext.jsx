"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./authContext";
const FolderContext = createContext();

export const useFolders = () => {
  const context = useContext(FolderContext);
  if (!context)
    throw new Error("useFolders must be used within FolderProvider");
  return context;
};

export const FolderProvider = ({ children }) => {
  const {user} = useAuth();
  const [folders, setFolders] = useState([]);
  const [activeFolder, setActiveFolder] = useState(null);

  const storageKey = user ? `jotful-folders-${user.id}` : null;

  useEffect(() => {
    if (!user) {
      setFolders([]);
      setActiveFolder(null);
      return;
    }

    const savedFolders = localStorage.getItem(storageKey);

    if (savedFolders) {
      try {
        setFolders(JSON.parse(savedFolders));
      } catch (err) {
        console.error("Failed to parse saved folders:", err);

        setFolders([]);
      }
    } else {
      setFolders([]);
    }

    setActiveFolder(null);
  }, [user, storageKey]);

  const saveFolders = (updatedFolders) => {
    setFolders(updatedFolders);

    if (storageKey) {
      localStorage.setItem(
        storageKey,

        JSON.stringify(updatedFolders),
      );
    }
  };

  const addFolder = (name) => {
    if (folders.length >= 5) return null;
    const folder = { id: Date.now().toString(), name, postIds: [] };
    const updated = [...folders, folder];
    saveFolders(updated);
    return folder;
  };

  const addFolderWithPost = (name, postId) => {
    if (folders.length >= 5) return null;
    const folder = { id: Date.now().toString(), name, postIds: [postId] };
    const updated = [...folders, folder];
    saveFolders(updated);
    return folder;
  };

  const addPostToFolder = (folderId, postId) => {
    const updated = folders.map((f) =>
      f.id === folderId && !f.postIds.includes(postId)
        ? { ...f, postIds: [...f.postIds, postId] }
        : f,
    );
    saveFolders(updated);
  };

  const removePostFromFolder = (folderId, postId) => {
    const updated = folders.map((f) =>
      f.id === folderId
        ? { ...f, postIds: f.postIds.filter((id) => id !== postId) }
        : f,
    );
    saveFolders(updated);
  };

  const deleteFolder = (folderId) => {
    const updated = folders.filter((f) => f.id !== folderId);
    saveFolders(updated);
  };

  return (
    <FolderContext.Provider
      value={{
        folders,
        activeFolder,
        setActiveFolder,
        addFolder,
        addFolderWithPost,
        addPostToFolder,
        removePostFromFolder,
        deleteFolder,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};
