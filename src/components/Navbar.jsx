"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Modal from "./Modal";
import FolderModal from "./FolderModal";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useFolders } from "@/contexts/FolderContext";
import { useGuest } from "@/contexts/GuestContext";

function Spin({ open, setOpen, className }) {
  return (
    <button
      variant="ghost"
      onClick={() => setOpen(!open)}
      className={`md:hidden w-8.5 h-8 flex flex-col justify-center items-center gap-1.5 
          ml-9 mt-3 transform transition-transform duration-900 
          ${open ? "border-2 border-white" : ""} ${className}`}
    >
      <span
        className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${open ? "rotate-45 translate-y-2 bg-white" : ""}`}
      />
      <span
        className={`block w-5 h-0.5 bg-white transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
      />
      <span
        className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${open ? "-rotate-45 -translate-y-2 bg-white" : ""}`}
      />
    </button>
  );
}

export default function Navbar({ first, second }) {
  const [open, setOpen] = useState(false);
  const [textColor, setTextColor] = useState(false);
  const [modal, setModal] = useState(false);
  const [folderModal, setFolderModal] = useState(false);
  const [folderDropdownOpen, setFolderDropdownOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const longPressTimer = useRef(null);
  const { logout, user } = useAuth();
  const { folders, addFolder, deleteFolder, setActiveFolder } = useFolders();
  const { isGuest, exitGuestMode } = useGuest();
  const [guestPrompt, setGuestPrompt] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  const navLinks = [
    { id: 1, href: "/dashboard/home", text: "Home" },
    { id: 2, href: "/dashboard/create", text: "Create Jot" },
    { id: 3, href: "/dashboard/favorites", text: "Favorites" },
  ];

  const handleLogout = async () => {
    await logout();
    exitGuestMode();
    setModal(false);
    router.push("/auth/login");
  };

  const handleRestrictedClick = () => {
    if (isGuest) {
      setGuestPrompt(true);
      return true;
    }
    return false;
  };

  const handleCreateFolder = (name) => {
    addFolder(name);
    setFolderModal(false);
  };

  const handleFolderSelect = (folder) => {
    if (handleRestrictedClick()) return;
    setFolderDropdownOpen(false);
    setOpen(false);
    router.push(`/dashboard/folder/${folder.id}`);
  };

  const handleFolderRightClick = (e, folder) => {
    e.preventDefault();
    setDeleteTarget(folder);
  };

  const handleLongPressStart = (folder) => {
    longPressTimer.current = setTimeout(() => setDeleteTarget(folder), 600);
  };

  const handleLongPressEnd = () => {
    clearTimeout(longPressTimer.current);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFolderDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setTextColor("text-cyan-500 dark:text-cyan-800");
      const timer = setTimeout(
        () => setTextColor("text-white dark:text-black"),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Mobile Navbar
  if (first === "icon") {
    return (
      <>
        <Spin
          setOpen={setOpen}
          open={open}
          className="z-3 relative transition-all duration-1000"
        />

        <div
          className={`fixed inset-0 bg-linear-to-b from-black/70 to-black/70 transition-opacity duration-300 md:hidden ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={() => setOpen(false)}
        />

        {modal && (
          <Modal
            open={modal}
            message="Are you sure you want to logout?"
            onConfirm={handleLogout}
            onCancel={() => setModal(false)}
          />
        )}

        {guestPrompt && (
          <Modal
            open={guestPrompt}
            message="Sign in to use this feature?"
            onConfirm={() => {
              setGuestPrompt(false);
              exitGuestMode();
              router.push("/auth/login");
            }}
            onCancel={() => setGuestPrompt(false)}
          />
        )}

        {folderModal && (
          <FolderModal
            open={folderModal}
            onConfirm={handleCreateFolder}
            onCancel={() => setFolderModal(false)}
          />
        )}

        {deleteTarget && (
          <Modal
            open={!!deleteTarget}
            message={`Delete folder "${deleteTarget.name}"?`}
            onConfirm={() => {
              deleteFolder(deleteTarget.id);
              setDeleteTarget(null);
            }}
            onCancel={() => setDeleteTarget(null)}
          />
        )}

        <div
          className={`fixed left-0 top-0 h-full w-64 bg-cyan-700 dark:bg-cyan-950 shadow-xl shadow-white/10 transform transition-transform duration-800 pb-safe ${open ? "translate-x-0" : "-translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="h-full flex flex-col">
            <ul className="slidein mt-20 flex flex-col px-5 space-y-5 pt-6 grow">
              {navLinks.map((item) => (
                <li
                  key={item.id}
                  className="bg-black/70 dark:bg-white/70   rounded-md p-2 transition-all duration-300 hover:pl-5"
                >
                  {isGuest &&
                  (item.href === "/favorites" || item.href === "/settings") ? (
                    <button
                      onClick={() => setGuestPrompt(true)}
                      className={`text-xl w-full text-left hover:text-cyan-500 dark:hover:text-cyan-700 ${textColor} block`}
                    >
                      {item.text}
                    </button>
                  ) : item.href === "/dashboard/home" ? (
                    <button
                      onClick={() => {
                        setActiveFolder(null);
                        setOpen(false);
                        router.push("/dashboard/home");
                      }}
                      className={`text-xl w-full text-left hover:text-cyan-500 dark:hover:text-cyan-700 ${textColor} block`}
                    >
                      {item.text}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`text-xl transform-all duration-1000 hover:text-cyan-500 dark:hover:text-cyan-700 ${textColor} block`}
                    >
                      {item.text}
                    </Link>
                  )}
                </li>
              ))}

              {/* Folder item */}
              <li className="bg-black/70 dark:bg-white/70  rounded-md p-2 hover:pl-5 transition-all duration-300">
                <button
                  onClick={() => {
                    if (handleRestrictedClick()) return;
                    setFolderDropdownOpen((prev) => !prev);
                  }}
                  className={`text-xl w-full text-left hover:text-cyan-500 dark:hover:text-cyan-700 ${textColor}`}
                >
                  Folders
                </button>
                {folderDropdownOpen && (
                  <ul className="mt-2 space-y-1 pl-2">
                    <li>
                      <button
                        onClick={() => {
                          if (folders.length >= 5) return;
                          setFolderModal(true);
                          setFolderDropdownOpen(false);
                        }}
                        disabled={folders.length >= 5}
                        className={`text-base w-full text-left ${
                          folders.length >= 5
                            ? "text-gray-400 opacity-40 cursor-not-allowed"
                            : "text-cyan-200 dark:text-cyan-800 hover:text-white"
                        }`}
                      >
                        + Add Folder
                      </button>
                    </li>
                    {folders.map((f) => (
                      <li key={f.id}>
                        <button
                          onClick={() => handleFolderSelect(f)}
                          onContextMenu={(e) => handleFolderRightClick(e, f)}
                          onTouchStart={() => handleLongPressStart(f)}
                          onTouchEnd={handleLongPressEnd}
                          onTouchMove={handleLongPressEnd}
                          className="text-base text-white dark:text-black hover:text-cyan-300 w-full text-left"
                        >
                          {f.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              <li className="bg-black/70 dark:bg-white/70 rounded-md p-2 transition-all duration-300 hover:pl-5">
                {isGuest ? (
                  <button
                    onClick={() => setGuestPrompt(true)}
                    className={`text-xl w-full text-left hover:text-cyan-500 dark:hover:text-cyan-700 ${textColor}`}
                  >
                    Settings
                  </button>
                ) : (
                  <Link
                    href="/settings"
                    onClick={() => setOpen(false)}
                    className={`text-xl w-full hover:text-cyan-500 dark:hover:text-cyan-700 ${textColor}`}
                  >
                    Settings
                  </Link>
                )}
              </li>

              {!isGuest && (
                <button
                  onClick={() => setModal(true)}
                  className={`text-left text-xl bg-black/70 dark:bg-white/70 rounded-md p-2 transition-all duration-300 hover:bg-red-900 dark:hover:bg-red-950 hover:text-cyan-500 dark:hover:text-cyan-700 hover:pl-5 ${textColor}`}
                >
                  Logout
                </button>
              )}
              {isGuest && (
                <button
                  onClick={() => {
                    exitGuestMode();
                    router.push("/auth/login");
                  }}
                  className={`text-left text-xl bg-black/70 dark:bg-white/70 rounded-md p-2 transition-all duration-300 hover:bg-green-700 dark:hover:bg-green-900 hover:pl-5 ${textColor}`}
                >
                  Sign In
                </button>
              )}
            </ul>

            {user && !isGuest && (
              <div className="mt-auto mb-10 px-5 pt-4">
                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 bg-white text-cyan-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                  </div>
                  <p className="text-white text-sm font-medium">{user.email}</p>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </>
    );
  }

  // Desktop Navbar
  if (second === "plain") {
    return (
      <>
        <nav>
          <ul className="flex space-x-4 py-0 items-center">
            {navLinks.map((item) => (
              <li
                key={item.id}
                className="tracking-tight text-white hover:font-semibold xl:text-lg"
              >
                {isGuest &&
                (item.href === "/favorites" || item.href === "/settings") ? (
                  <button
                    onClick={() => setGuestPrompt(true)}
                    className="tracking-tight text-white hover:font-semibold xl:text-lg"
                  >
                    {item.text}
                  </button>
                ) : item.href === "/home" ? (
                  <button
                    onClick={() => {
                      setActiveFolder(null);
                      router.push("/home");
                    }}
                    className="tracking-tight text-white hover:font-semibold xl:text-lg"
                  >
                    {item.text}
                  </button>
                ) : (
                  <Link href={item.href}>{item.text}</Link>
                )}
              </li>
            ))}

            {/* Folder Dropdown */}
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  if (handleRestrictedClick()) return;
                  setFolderDropdownOpen((prev) => !prev);
                }}
                className="tracking-tight text-white hover:font-semibold xl:text-lg flex items-center gap-1"
              >
                Folders
              </button>
              {folderDropdownOpen && (
                <ul className="absolute top-full left-0 mt-1 w-44 bg-cyan-700 dark:bg-cyan-950 rounded-lg shadow-lg z-50 overflow-hidden">
                  <li>
                    <button
                      onClick={() => {
                        if (folders.length >= 5) return;
                        setFolderModal(true);
                        setFolderDropdownOpen(false);
                      }}
                      disabled={folders.length >= 5}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        folders.length >= 5
                          ? "text-gray-400 opacity-40 cursor-not-allowed"
                          : "text-white hover:bg-black/20"
                      }`}
                    >
                      + Add Folder
                    </button>
                  </li>
                  {folders.map((f) => (
                    <li key={f.id}>
                      <button
                        onClick={() => handleFolderSelect(f)}
                        onContextMenu={(e) => handleFolderRightClick(e, f)}
                        onTouchStart={() => handleLongPressStart(f)}
                        onTouchEnd={handleLongPressEnd}
                        onTouchMove={handleLongPressEnd}
                        className="w-full text-left px-4 py-2 text-white hover:bg-black/20 text-sm"
                      >
                        {f.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li className="tracking-tight text-white hover:font-semibold xl:text-lg">
              {isGuest ? (
                <button onClick={() => setGuestPrompt(true)}>Settings</button>
              ) : (
                <Link href="/settings">Settings</Link>
              )}
            </li>

            {!isGuest && (
              <li>
                <button
                  onClick={() => setModal(true)}
                  className="tracking-tight text-white hover:font-semibold xl:text-lg"
                >
                  Logout
                </button>
              </li>
            )}

            {isGuest && (
              <li>
                <button
                  onClick={() => {
                    exitGuestMode();
                    router.push("/auth/login");
                  }}
                  className="tracking-tight text-white hover:font-semibold xl:text-lg"
                >
                  Sign In
                </button>
              </li>
            )}
          </ul>
        </nav>

        {guestPrompt &&
          typeof document !== "undefined" &&
          createPortal(
            <Modal
              open={guestPrompt}
              message="Sign in to use this feature?"
              onConfirm={() => {
                setGuestPrompt(false);
                exitGuestMode();
                router.push("/auth/login");
              }}
              onCancel={() => setGuestPrompt(false)}
            />,
            document.body,
          )}

        {folderModal &&
          typeof document !== "undefined" &&
          createPortal(
            <FolderModal
              open={folderModal}
              onConfirm={handleCreateFolder}
              onCancel={() => setFolderModal(false)}
            />,
            document.body,
          )}

        {modal &&
          typeof document !== "undefined" &&
          createPortal(
            <Modal
              open={modal}
              message="Are you sure you want to logout?"
              onConfirm={handleLogout}
              onCancel={() => setModal(false)}
            />,
            document.body,
          )}

        {deleteTarget &&
          typeof document !== "undefined" &&
          createPortal(
            <Modal
              open={!!deleteTarget}
              message={`Delete folder "${deleteTarget.name}"?`}
              onConfirm={() => {
                deleteFolder(deleteTarget.id);
                setDeleteTarget(null);
              }}
              onCancel={() => setDeleteTarget(null)}
            />,
            document.body,
          )}
      </>
    );
  }
}
