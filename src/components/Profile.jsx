"use client";

import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { useGuest } from "@/contexts/GuestContext";

export default function Profile({ isMobile = false }) {
  const { user, loading } = useAuth();
  const { isGuest } = useGuest();

  if (loading || !user || isGuest) return null;

  const getInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : "U";
  };

  return (
    <Link 
      href="/settings" 
      className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${
        isMobile ? "justify-end" : ""
      }`}
    >
      <div className="w-8 h-8 bg-white text-cyan-600 rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
        {getInitials(user.email)}
      </div>
      {!isMobile && (
        <span className="text-white text-sm font-medium hidden">
          {user.email}
        </span>
      )}
    </Link>
  );
}