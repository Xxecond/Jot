"use client";

import { useEffect } from "react";
import { checkSession } from "@/features/auth/services/authService";
import { useRouter } from "next/navigation";

export default function useSessionPolling({
  sessionId,
  polling = true,
  onSuccess,
  onDenied,
  redirectTo = "/dashboard/home",
}) {
  const router = useRouter();

  useEffect(() => {
    if (!sessionId || !polling) return;

    const interval = setInterval(async () => {
      try {
        const data = await checkSession(sessionId);

        if (data.authenticated) {
          clearInterval(interval);
          
          if (data.token) {
            // ✅ Store token in localStorage for axios interceptor
            localStorage.setItem("token", data.token);
            console.log("✅ Token stored in localStorage");
          }

          // ✅ Log completion
          console.log("✅ Session authenticated successfully");
          
          // Refresh router to pick up the new auth_token cookie set by check-session
          router.refresh();

          // Call success callback
          onSuccess?.();

          // Small delay to ensure cookie and token are propagated through axios
          setTimeout(() => {
            router.push(redirectTo);
          }, 300);
        }

        if (data.denied) {
          clearInterval(interval);
          console.warn("⚠️ User denied the authentication request");
          onDenied?.();
        }
      } catch (err) {
        console.error("❌ Session polling error:", err.message);
        // Continue polling on error - don't clear the interval
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [sessionId, polling, onSuccess, onDenied, router, redirectTo]);
}