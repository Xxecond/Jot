"use client";

import { createContext, useContext, useState, useEffect } from "react";

const FolderContext = createContext();

export const useFolders = () => {
  const context = useContext(FolderContext);
  if (!context)
    throw new Error("useFolders must be used within FolderProvider");
  return context;
};

export const FolderProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
  const [activeFolder, setActiveFolder] = useState(null);

  useEffect(() => {
    const savedFolders = localStorage.getItem("jotful-folders");
    if (savedFolders) setFolders(JSON.parse(savedFolders));
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
    const updated = folders.map((f) =>
      f.id === folderId && !f.postIds.includes(postId)
        ? { ...f, postIds: [...f.postIds, postId] }
        : f,
    );
    setFolders(updated);
    localStorage.setItem("jotful-folders", JSON.stringify(updated));
  };

  const removePostFromFolder = (folderId, postId) => {
    const updated = folders.map((f) =>
      f.id === folderId
        ? { ...f, postIds: f.postIds.filter((id) => id !== postId) }
        : f,
    );
    setFolders(updated);
    localStorage.setItem("jotful-folders", JSON.stringify(updated));
  };

  const deleteFolder = (folderId) => {
    const updated = folders.filter((f) => f.id !== folderId);
    setFolders(updated);
    localStorage.setItem("jotful-folders", JSON.stringify(updated));
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
