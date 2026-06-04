"use client";


import { useState, useEffect } from "react";
import useDraft from "./useDraft";

export default function usePostForm(autoSave) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { loadDraft, clearDraft } = useDraft(
    title,
    content,
    autoSave
  );

  useEffect(() => {
    if (!autoSave) return;

    const draft = loadDraft();

    setTitle(draft.title || "");
    setContent(draft.content || "");
  }, [autoSave]);

  return {
    title,
    content,
    setTitle,
    setContent,
    clearDraft,
  };
}