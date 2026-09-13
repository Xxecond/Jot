/*global crypto */

"use client";

import { Button, Spinner } from "@/components/ui";
import useMagicLink from "../hooks/useMagicLink";

export default function LoginForm() {
  // router handled inside useMagicLink; no local router needed

  const {
    email,
    setEmail,
    loading,
    message,
    error,
    countdown,
    canResend,
    handleSubmit,
  } = useMagicLink("login", "/dashboard/home");

  // useMagicLink.handleSubmit is used directly as the form submit handler

  return (
    <form
      className="flex flex-col gap-4 mt-9 max-[350px]:gap-3 max-[350px]:mt-7"
      onSubmit={handleSubmit}
    >
      <label className="text-sm md:text-base">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3  focus:outline-none ring ring-black dark:ring-white focus:ring-2 rounded-full dark:bg-white/10 bg-black/10 max-[350px]:placeholder:text-sm max-[350px]:p-2"
        placeholder="andrewsampadu9@gmail.com"
        required
      />

      {error  &&  <p className="text-red-500 text-center ">{error}</p>}
      {message && <p className="text-green-500 text-center ">{message}</p>
      }

      <Button type="submit" disabled={loading || !canResend} variant="special">
        {loading ? (
          <>
            Sending <Spinner size="sm" />
          </>
        ) : !canResend ? (
          `Resend ${countdown}s`
        ) : (
          "Send Email"
        )}
      </Button>
    </form>
  );
}
