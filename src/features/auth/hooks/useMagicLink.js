"use client";

import { useState, useEffect, useRef } from "react";
import useCountdown from "../hooks/useCountdown";
import { sendMagicLink } from "@/features/auth/services/authService";
import { checkSession } from "@/features/auth/services/authService";
import generateId from "@/lib/generateId";

export default function useMagicLink(
  action = "login", redirectTo = "/dashboard/home") {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { countdown, startCountdown, canResend } = useCountdown(60);
  const [pollingSessionId, setPollingSessionId] = useState(null);
  const intervalRef = useRef(null);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    setError("");
    setMessage("");

    
    if (!canResend) {
      setError(`Wait ${countdown}s before resending`);
      return;
    }

    setLoading(true);

    try {
      const newSessionId = generateId();

     await sendMagicLink(email, newSessionId, action);
      // Show immediate instruction and start background polling on this page
      setMessage("Email sent! Check your email.");
      startCountdown();
      setPollingSessionId(newSessionId);
    } catch (err) {
      setError(err?.message || "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  };

  // Background polling for the session created by this client
  useEffect(() => {
    if (!pollingSessionId) return;

    // avoid multiple intervals
    if (intervalRef.current) return;

    intervalRef.current = setInterval(async () => {
      try {
        const data = await checkSession(pollingSessionId);
        if (data.authenticated) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          if (data.token) {
            document.cookie = `access_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
          }
          window.location.href = redirectTo;
          setPollingSessionId(null);
        }

        if (data.denied) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setError("Login request denied");
          setPollingSessionId(null);
        }
      } catch (err) {
        // ignore errors and continue polling
      }
    }, 2500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [pollingSessionId, redirectTo, router]);

  return {
    email,
    setEmail,
    loading,
    message,
    error,
    countdown,
    canResend,
    handleSubmit,
  };
}





