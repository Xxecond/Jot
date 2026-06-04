'use client';

import { AuthProvider } from "@/context/authContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { FolderProvider } from "@/contexts/FolderContext";
import { GuestProvider } from "@/contexts/GuestContext";

export default function Providers({ children }) {
  return (
    <AuthProvider>
        <SettingsProvider>
          <NotificationProvider>
            <FolderProvider>
              <GuestProvider>
                {children}
              </GuestProvider>
            </FolderProvider>
          </NotificationProvider>
        </SettingsProvider>
    </AuthProvider>
  );
}