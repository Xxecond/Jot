"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useGuest } from "@/contexts/GuestContext";

export default function LandingPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { isGuest, enterGuestMode, exitGuestMode } = useGuest();

  useEffect(() => {
    if (isGuest) exitGuestMode();
  }, []);

  const handleTryJot = () => {
    exitGuestMode();
    enterGuestMode();
    router.push("/dashboard/home");
  };

  return (
    <div>
      <nav className="bg-white dark:bg-black/90 shadow-xl dark:shadow-white/10 px-6 md:px-16 py-4 flex justify-end ">
        <div className="flex items-center gap-6 text-gray-700 dark:text-gray-100 font-medium">
          <Link href="/auth/login" className={(pathname, "/auth/login")}>
            Log in
          </Link>
          <Link href="/auth/signup" className={(pathname, "/auth/signup")}>
            Sign Up
          </Link>
        </div>
      </nav>
      <section className=" flex h-dvh justify-center items-center text-center dark:text-white text-black bg-white dark:bg-black/90">
        <main className="flex w-full h-150 pb-35">
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h1 className="text-[40px] sm:text-5xl font-light leading-loose text-nowrap">
              Capture ideas✨,
              <br />
              Stay Organised 📁,
              <br /> Be JotFul✍️{" "}
            </h1>
            <div className="flex pt-15 gap-4 justify-center flex-wrap">
              <Button variant="special" onClick={handleTryJot}>
                Try App
              </Button>
              <Link href="/auth/login">
                <Button variant="outline">Log In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline">Create Account</Button>
              </Link>
            </div>
          </div>
          <div className="w-1/2 relative md:block hidden ">
          <Image 
            src="/assets/bok.png"
            alt="book"
            fill 
            priority
            className="object-contain"/>
          </div>
        </main>
      </section>
      <footer className="relative  h-50 md:h-60  bg-cyan-700 dark:bg-cyan-950 dark:text-gray-100 text-gray-200">
        <section className="flex pt-5 py-9 gap-8 ">
          <div className="relative  ml-6 ">
            <Image 
            src="/assets/bok.png"
            alt="book"
            width={120}
            height={120}
            className="object-contain"/>
          </div>
          <p className="flex md:items-center items-end mr-3  h-20">
            Jot is a simple space designed to jot thoughts, capture moments
            what matters through notes not photos.
          </p>
           <div className=" absolute w-full  bottom-0 border-t bg-cyan-600 dark:bg-cyan-950 border-t-white flex items-center justify-end  border-b-0">
          <span className=" py-4 text-sm font-light pr-5 pt-3">
            ©{new Date().getFullYear()} Jot. All rights reserved.
          </span>
        </div>
        </section>
       
      </footer>
    </div>
  );
}
