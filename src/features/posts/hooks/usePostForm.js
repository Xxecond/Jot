"use client";

import { useState, useEffect, useRef } from "react";
import useDraft from "./useDraft";

export default function usePostForm(autoSave) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { loadDraft, clearDraft } = useDraft(title, content, autoSave);

  const initialized = useRef(false);

  // LOAD draft ONLY ONCE
  useEffect(() => {
    if (!autoSave || initialized.current) return;

    const draft = loadDraft();

    if (draft?.title || draft?.content) {
      setTitle(draft.title || "");
      setContent(draft.content || "");
    }

    initialized.current = true;
  }, [autoSave, loadDraft]);

  const resetForm = () =>{
    setTitle(""),
    setContent(""),
    clearDraft()
  }

  return {
    title,
    content,
    setTitle,
    setContent,
    clearDraft,
    resetForm
  };
}