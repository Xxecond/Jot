import { useMemo } from "react";

export default function usePostFilter(posts, searchTerm, settings) {
  return useMemo(() => {
    const term = searchTerm
      .toLowerCase()
      .replace(/^#/, "");

    const filtered = posts
      .filter((blog) => {
        const titleMatch = blog?.title
          ?.toLowerCase()
          .includes(term);

        const hashtagMatch = blog?.content
          ?.toLowerCase()
          .split(/\s+/)
          .some(
            (w) =>
              w.startsWith("#") &&
              w.slice(1).includes(term)
          );

        return titleMatch || hashtagMatch;
      })
      .sort((a, b) =>
        settings.sortOrder === "oldest"
          ? new Date(a.createdAt) -
            new Date(b.createdAt)
          : new Date(b.createdAt) -
            new Date(a.createdAt)
      );

    return filtered;
  }, [posts, searchTerm, settings.sortOrder]);
}