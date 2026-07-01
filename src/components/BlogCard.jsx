'use client'

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSettings } from "@/contexts/SettingsContext";
import { useFolders } from "@/contexts/FolderContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useGuest } from "@/contexts/GuestContext";
import Modal from "@/components/Modal";
import FolderModal from "@/components/FolderModal";

export default function BlogCard({ blog, onDelete, hideAction, change, notification, actionLabel, variant }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [folderModal, setFolderModal] = useState(false);
  const [folderPicker, setFolderPicker] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const longPressTimer = useRef(null);
  const contentRef = useRef(null);
  const router = useRouter();
  const { settings } = useSettings();
  const { folders, addFolder, addFolderWithPost, addPostToFolder, deleteFolder, toggleFavorite, isFavorite, removePostFromFolder } = useFolders();
  const { addNotification } = useNotifications();
  const { isGuest, exitGuestMode } = useGuest();
  const [guestPrompt, setGuestPrompt] = useState(false);
  const favorite = isFavorite(blog._id);


  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > contentRef.current.clientHeight);
    }
  }, [blog?.content]);

  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'small': return 'text-sm md:text-base';
      case 'large': return 'text-xl md:text-2xl';
      default: return 'text-base md:text-lg';
    }
  };

  const getThemeClass = () => {
    switch (settings.cardStyle) {
      case 'slate':    return 'bg-slate-600 dark:bg-slate-800 text-white';
      case 'rose':     return 'bg-rose-500 dark:bg-rose-800 text-white';
      case 'emerald':  return 'bg-emerald-600 dark:bg-emerald-900 text-white';
      case 'midnight': return 'bg-indigo-900 dark:bg-gray-950 text-white';
      default:         return 'bg-cyan-600 dark:bg-cyan-900 text-white';
    }
  };

  const getTitleBgClass = () => {
    switch (settings.cardStyle) {
      case 'slate':    return 'bg-slate-700 dark:bg-slate-900';
      case 'rose':     return 'bg-rose-600 dark:bg-rose-900';
      case 'emerald':  return 'bg-emerald-700 dark:bg-emerald-950';
      case 'midnight': return 'bg-indigo-950 dark:bg-black';
      default:         return 'bg-cyan-700 dark:bg-cyan-950';
    }
  };

  const getViewMoreBgClass = () => {
    switch (settings.cardStyle) {
      case 'slate':    return 'bg-slate-600 dark:bg-slate-800';
      case 'rose':     return 'bg-rose-500 dark:bg-rose-800';
      case 'emerald':  return 'bg-emerald-600 dark:bg-emerald-900';
      case 'midnight': return 'bg-indigo-900 dark:bg-gray-950';
      default:         return 'bg-cyan-600 dark:bg-cyan-900';
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffMs = now - posted;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffMins < 1) return '1s';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    if (diffWeeks < 4) return `${diffWeeks}w`;
    if (diffMonths < 12) return `${diffMonths}mo`;
    return `${diffYears}y`;
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

  const handleToggle = () => {
    if (isOverflowing) setIsExpanded(prev => !prev);
  };

  const handleEdit = () => {
    router.push(`/dashboard/edit/${blog._id}`);
  };

  const renderContent = (text) => {
    return text.split("\n").map((line, lineIndex) => (
      <div key={lineIndex}>
        {line.split(" ").map((word, i)=>
         word.startsWith('#')? (
        <span key={i} className="text-cyan-300 dark:text-cyan-400 font-semibold">{word}{" "} </span>
        ):
          ( word + ' '
    )
    )}
    </div >
    ));
  }

  const  handleDelete = () => {
  if (onDelete) return onDelete(blog._id);
};

const variants ={
    danger: "bg-red-600 dark:bg-red-800",
    warning: "bg-orange-600"
  }

  return (
    <div className={`w-[90%] max-w-xl rounded-lg overflow-hidden mx-auto wrap-break-word whitespace-normal my-12 ${getThemeClass()}`}>
      {/* Title */}
      <div className={`text-center py-1 px-2 relative ${getTitleBgClass()}`}>
        {blog.createdAt && settings.showTimestamps && (
          <p className="absolute -translate-y-1/2 top-1/2 left-2 text-xs xl:text-sm text-cyan-100 dark:text-cyan-400 flex items-center gap-1 opacity-0 pointer-events-none">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {getTimeAgo(blog.createdAt)}
          </p>
        )}
        <h2 className={`font-semibold text-white wrap-break-word tracking-wide pr-12 break-words ${
          settings.fontSize === 'small' ? 'text-lg md:text-xl xl:text-2xl' :
          settings.fontSize === 'large' ? 'text-2xl md:text-3xl xl:text-4xl' :
          'text-xl md:text-2xl xl:text-3xl'
        }`}>
          {blog.title}
        </h2>
        {blog.createdAt && settings.showTimestamps && (
          <p className="absolute -translate-y-1/2 top-1/2 right-2 text-xs xl:text-sm text-cyan-100 dark:text-cyan-400 flex items-center gap-1 flex-shrink-0">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {getTimeAgo(blog.createdAt)}
          </p>
        )}
      </div>

      {/* Image */}
      {blog.image && settings.showImages && (
        <div className="relative w-full aspect-[4/4] md:aspect-[4/3] overflow-hidden ">
          <Image
            src={blog.image}
            alt={blog.title || "Blog image"}
            fill
            className=" object-center "
            priority= {false}

          />
        </div>
      )}

      {/* Content */}
<div className="relative text-white p-2 tracking-wide leading-snug font-light mx-auto">
  <div
    ref={contentRef}
    onClick={handleToggle}
    className={`cursor-${isOverflowing ? "pointer" : "default"} ${
      isExpanded ? "" : (
        settings.lineClamp === '1' ? 'line-clamp-1' :
        settings.lineClamp === '3' ? 'line-clamp-3' :
        settings.lineClamp === '4' ? 'line-clamp-4' :
       'line-clamp-2'
      )
    } whitespace-pre-line ${getFontSizeClass()}`}
  >
    {renderContent(blog.content)}
  </div>

  {/* View more / View less - positioned at the bottom right of the clamped text */}
  {isOverflowing && !isExpanded && (
    <span
      onClick={handleToggle}
      className={`absolute bottom-2 right-2 text-[#4fc3f7] font-bold text-[1rem] cursor-pointer ${getViewMoreBgClass()} pl-2`}
    >
     ...View more
    </span>
  )}
  {isOverflowing && isExpanded && (
    <span
      onClick={handleToggle}
      className="block text-[#4fc3f7] font-bold text-[1rem] cursor-pointer mt-2"
    >
      View less
    </span>
  )}
</div>

      {/* Actions */}
      <div className="flex flex-row justify-between mx-4 items-center my-2 gap-2">
        <button
          onClick={handleEdit}
          className={`bg-green-600 dark:bg-green-800 text-white px-3 rounded hover:font-bold ${
            settings.fontSize === 'small' ? 'text-sm md:text-base' :
            settings.fontSize === 'large' ? 'text-lg md:text-xl' :
            'text-base md:text-lg'
          }`}
        >
          Edit
        </button>

       {!hideAction &&( <button
          onClick={() => { if (isGuest) { setGuestPrompt(true); return; } setFolderPicker(true); }}
          className={`bg-cyan-200 dark:bg-cyan-950 text-white px-3 rounded hover:font-bold ${
            settings.fontSize === 'small' ? 'text-sm md:text-base' :
            settings.fontSize === 'large' ? 'text-lg md:text-xl' :
            'text-base md:text-lg'
          }`}
        >
          📁
        </button>)
        }

        {!hideAction && (<button
          onClick={() => {
            if (isGuest) { setGuestPrompt(true); return; }
            const added = toggleFavorite(blog._id);
            addNotification(added ? 'Added to Favorites' : 'Removed from Favorites', 'success');
          }}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110"
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`w-5 h-5 transition-all duration-200 ${
              favorite
                ? 'fill-rose-400 stroke-rose-400'
                : 'fill-none stroke-white'
            }`}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>)
}

        {!change ? (
  <button onClick={handleDelete}  className={`${variants[variant]} text-white px-3 rounded hover:font-bold ${
            settings.fontSize === 'small' ? 'text-sm md:text-base' :
            settings.fontSize === 'large' ? 'text-lg md:text-xl' :
            'text-base md:text-lg'
          }`}
>
    {actionLabel}
  </button>
) : (
  <button
    onClick={() => {
      if (isGuest) {
        setGuestPrompt(true);
        return;
      }

      if (!notification) {
        // Remove from Favorites
        toggleFavorite(blog._id);
        addNotification('Removed from Favorites', 'success');
      } else {
        // Remove from Folder
        if (blog.folderId) {
          removePostFromFolder(blog.folderId, blog._id);
          addNotification('Removed from folder', 'success');
        } else {
          addNotification('Cannot remove: Folder ID not found', 'error');
        }
      }
    }}
    className={`bg-orange-600 dark:bg-orange-800 text-white px-3 rounded hover:font-bold ${
      settings.fontSize === 'small' ? 'text-sm md:text-base' :
      settings.fontSize === 'large' ? 'text-lg md:text-xl' :
      'text-base md:text-lg'
    }`}
  >
    Remove
  </button>
)}

      </div>

      {guestPrompt && (
        <Modal
          open={guestPrompt}
          message="Sign in to use this feature?"
          onConfirm={() => { setGuestPrompt(false); exitGuestMode(); router.push('/auth/login'); }}
          onCancel={() => setGuestPrompt(false)}
        />
      )}

      {folderPicker && (
        <div className="fixed inset-0 z-[100] bg-black/60" onClick={() => setFolderPicker(false)}>
          <div
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[68%] max-w-sm rounded-xl z-[110] overflow-hidden ${
              settings.cardStyle === 'slate' ? 'bg-slate-700' :
              settings.cardStyle === 'rose' ? 'bg-rose-600' :
              settings.cardStyle === 'emerald' ? 'bg-emerald-700' :
              settings.cardStyle === 'midnight' ? 'bg-indigo-950' :
              'bg-cyan-700'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <p className="text-white text-center pt-4 pb-2 font-medium">Add to Folder</p>
            <ul className="max-h-48 overflow-y-auto">
              {folders.map(f => (
                <li key={f.id}>
                  <button
                    onClick={() => {
                      addPostToFolder(f.id, blog._id);
                      addNotification(`Added to "${f.name}"`, 'success');
                      setFolderPicker(false);
                    }}
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
            <div className="flex border-t-2 border-white">
              <button
                onClick={() => { if (folders.length >= 5) return; setFolderPicker(false); setFolderModal(true); }}
                className={`text-white p-2 w-1/2 text-sm ${
                  folders.length >= 5
                    ? 'opacity-40 cursor-not-allowed text-gray-300'
                    : 'hover:bg-black/20'
                }`}
                disabled={folders.length >= 5}
              >
                + New Folder
              </button>
              <button
                onClick={() => setFolderPicker(false)}
                className="text-white p-2 w-1/2 hover:bg-black/20 border-l-2 border-white text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <Modal
          open={!!deleteTarget}
          message={`Delete folder "${deleteTarget.name}"?`}
          onConfirm={() => { deleteFolder(deleteTarget.id); setDeleteTarget(null); setFolderPicker(false); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {folderModal && (
        <FolderModal
          open={folderModal}
          onConfirm={(name) => {
            addFolderWithPost(name, blog._id);
            addNotification(`Added to "${name}"`, 'success');
            setFolderModal(false);
          }}
          onCancel={() => setFolderModal(false)}
        />
      )}
    </div>
  );
}
