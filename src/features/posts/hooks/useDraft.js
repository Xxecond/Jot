"use client";

import { useEffect, useRef } from "react";

export default function useDraft(title, content, autoSave) {
  const isFirstRun = useRef(true);

  // SAVE draft (debounced)
  useEffect(() => {
    if (!autoSave) return;

    const timer = setTimeout(() => {
      // don’t save empty initial render
      if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
      }

      localStorage.setItem(
        "draft",
        JSON.stringify({ title, content })
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, content, autoSave]);

  // LOAD draft (manual only)
  const loadDraft = () => {
    try {
      const draft = localStorage.getItem("draft");
      if (!draft) return { title: "", content: "" };

      return JSON.parse(draft);
    } catch {
      return { title: "", content: "" };
    }
  };

  const clearDraft = () => {
    localStorage.removeItem("draft");
  };

  return { loadDraft, clearDraft };
}