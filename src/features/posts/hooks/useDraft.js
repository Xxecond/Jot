"use client";

import { useEffect } from "react";

export default function useDraft(title, content, autoSave) {
  useEffect(() => {
    if (!autoSave || (!title && !content)) return;

    const timer = setTimeout(() => {
      localStorage.setItem(
        "draft",
        JSON.stringify({ title, content })
      );
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, content, autoSave]);

  const loadDraft = () => {
    const draft = localStorage.getItem("draft");

    if (!draft) {
      return { title: "", content: "" };
    }

    return JSON.parse(draft);
  };

  const clearDraft = () => {
    localStorage.removeItem("draft");
  };

  return { loadDraft, clearDraft };
}