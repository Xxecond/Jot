"use client";
import React from "react";
import { usePathname } from "next/navigation";
import {Navbar} from "@/components";
import Profile from "@/components/Profile";
import { useFolders } from "@/contexts/FolderContext";

export default function Header() {
  const pathname = usePathname();
  const { folders } = useFolders();

  const headings = {
    "/dashboard/home": "APP - NAME",
    "/dashboard/create": "New Jot",
    "/dashboard/settings": "Settings",
    "/dashboard/favorites": "Favorites",
  };

  const getPageName = (path) => {
    if (headings[path]) return headings[path];
    if (path.startsWith('/dashboard/edit') || path.includes('/edit/')) return 'Edit Jot';
    if (path.startsWith('/dashboard/folder/')) {
      const id = path.split('/dashboard/folder/')[1];
      const folder = folders.find(f => f.id === id);
      return folder ? folder.name : 'Folder';
    }
    return 'Page';
  };

  const pageName = getPageName(pathname);

  return (
    <header className="fixed top-0 w-full bg-cyan-600 dark:bg-cyan-950 text-white dark:text-cyan-50 py-3 xl:py-4 z-50">
      {/* Mobile Layout */}
      <div className="md:hidden absolute top-0 -left-4">
        <Navbar first="icon" />
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden md:flex absolute top-1 translate-y-1/2 right-3 items-center gap-4">
        <Navbar second="plain" />
      </div>
      
      {/* Title */}
      <div className="text-center md:flex md:text-left md:pl-5">
        <div className="hidden md:flex">
        <Profile />
        </div>
        <h1 className="text-xl md:text-2xl md:pl-10 xl:3xl font-semibold tracking-wide">
          {pageName}
        </h1>
      </div>
    </header>
  );
}