"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSessionPolling from "@/features/auth/hooks/useSessionPolling";
import { useAuth } from "@/context/authContext";

export default function WaitingAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [sessionId, setSessionId] = useState(null);
  const [status, setStatus] = useState("waiting");

  // Get sessionId from URL
  useEffect(() => {
    const id = searchParams.get("sessionId");
    if (id) {
      setSessionId(id);
    } else {
      // Fallback (should not happen in normal flow)
      console.warn("No sessionId in URL");
      router.push("/auth/login");
    }
  }, [searchParams, router]);

  const handleSuccess = async (userData) => {
    setStatus("authenticated");
    setUser(userData);
    router.push("/dashboard/home");
  };

  const handleDenied = () => {
    setStatus("denied");
    alert("Login request was denied.");
    router.push("/auth/login");
  };

  // Use the shared polling hook
  useSessionPolling({
    sessionId,
    polling: !!sessionId && status === "waiting",
    onSuccess: handleSuccess,
    onDenied: handleDenied,
    redirectTo: "/dashboard/home",
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
        {status === "waiting" && (
          <>
            <h1 className="text-2xl font-semibold mb-4">
              Waiting for verification
            </h1>
            <p className="text-gray-600 mb-8">
              Click <strong>"Yes, it's me"</strong> in the email we sent you.
            </p>

            <div className="mb-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            </div>

            <p className="text-sm text-gray-500">
              This page will automatically redirect once verified.
            </p>
            <p className="text-xs text-gray-400 mt-4">
              Expires in 15 minutes • Check your spam folder if needed
            </p>
          </>
        )}

        {status === "authenticated" && (
          <div className="py-8">
            <h2 className="text-2xl text-green-600 font-semibold mb-2">
              ✅ Success!
            </h2>
            <p>Redirecting to dashboard...</p>
          </div>
        )}

        {status === "denied" && (
          <div className="py-8">
            <h2 className="text-2xl text-red-600 font-semibold mb-2">
              ❌ Request Denied
            </h2>
            <p>You can close this tab.</p>
          </div>
        )}
      </div>
    </div>
  );
}