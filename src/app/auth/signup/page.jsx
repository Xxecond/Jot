"use client";
import Link from "next/link";
import Image from "next/image";
import { SignupForm } from "@/features/auth/components";
import { FcGoogle } from "react-icons/fc";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from "@/components/ui";
import { BackwardIcon } from "@heroicons/react/24/solid";

export default function SignupPage() {
  return (
    <div
      className="flex h-dvh items-center justify-center
       relative bg-cyan-600 dark:bg-cyan-950"
    >
      <main className="flex rounded-4xl overflow-hidden h-117 w-[87%] max-w-4xl dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <section className="relative py-10 space-y-10  mx-auto w-1/2 dark:bg-black bg-white dark:text-white text-black hidden md:block">
          <Button
            variant="secondary"
            className="absolute left-4  dark:text-white top-5 z-20 w-5 md:w-12 hidden md:block"
          >
            <Link href="/">
              <BackwardIcon />
            </Link>
          </Button>
          <h2 className="pt-3 text-3xl font-bold text-center ">
            Join JotFul✍️
          </h2>
          <p className="text-sm dark:text-gray-300 text-gray-800 text-center leading-relaxed w-4/5 mx-auto">
            Create your account, share your stories, and inspire your readers —
            all in one place.
          </p>
          <div className="absolute translate-x-1/2 right-1/2 h-48 w-70 ">
            <Image
              src="/assets/bok.png"
              alt="book"
              fill
              className="object-fill"
            />
          </div>
        </section>

        <section className="relative md:w-1/2 w-full bg-white dark:bg-black/90 text-gray-900 dark:text-white p-10 ">
          <Button
            variant="secondary"
            className="absolute left-4  dark:text-white top-5 z-20 w-5 md:w-12 md:hidden"
          >
            <Link href="/">
              <BackwardIcon />
            </Link>
          </Button>
          <h1 className="md:text-3xl text-2xl font-semibold text-center mt-3 ">
            Create Account
          </h1>
          <SignupForm />
          <div className="text-white dark:text-black pt-12 flex flex-col justify-center text-sm space-y-4">
            <a href="/api/auth/google">
              <button className="w-full cursor-pointer h-9 bg-cyan-600 dark:bg-cyan-950 hover:bg-cyan-500 text-white dark:text-slate-100 rounded-xl text-sm md:text-base xl:text-lg justify-center items-center flex">
                <FcGoogle className="mr-3 text-lg" />
                Sign up using Google
                <FcGoogle className="ml-3 text-lg" />
              </button>
            </a>
            <a href="/api/auth/twitter">
              <button className="w-full cursor-pointer h-9 bg-cyan-600 dark:bg-cyan-950 hover:bg-cyan-500 text-white dark:text-slate-100 rounded-xl text-sm md:text-base xl:text-lg justify-center items-center flex">
                <FaXTwitter className="mr-3 text-lg" />
                Sign up using X
                <FaXTwitter className="ml-3 text-lg" />
              </button>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
