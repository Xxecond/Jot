"use client";

import { AuthProvider } from "@/contexts/authContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { FolderProvider } from "@/contexts/FolderContext";
import { GuestProvider } from "@/contexts/GuestContext";
import FavoritesProvider from "@/contexts/FavoritesContext";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <SettingsProvider>
        <NotificationProvider>
          <FolderProvider>
            <FavoritesProvider>
              <GuestProvider>{children}</GuestProvider>
            </FavoritesProvider>
          </FolderProvider>
        </NotificationProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
