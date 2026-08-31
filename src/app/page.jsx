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
          <div className="w-full md:w-1/2 flex flex-col justify-center overflow-hidden">
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
            sizes="(max-width: 768px) 1px, 50vw" 
            priority
            className=" object-contain w"/>
          </div>
        </main>
      </section>
      <footer className="">
        <section className=" flex flex-col text-white bg-cyan-600 dark:bg-cyan-700 min-h-[30vh] items-center">
          <div className="w-full h-full p-5 flex items-center gap-5">
            <Image 
            src="/assets/bok.png"
            alt="book"
            width={120}
            height={120}
            className="object-contain w-auto h-auto"/>
          <p className="flex items-center">
            Jot is a simple space designed to turn passing thoughts into lasting memories with notes and photos. 
          </p>
          </div>
           <div className=" w-full border-t bg-cyan-600 dark:bg-cyan-950 border-t-white flex items-center justify-end  border-b-0">
          <span className=" py-4 text-sm font-light pr-5 pt-3">
            ©{new Date().getFullYear()} Jot. All rights reserved.
          </span>
        </div>
        </section>
       
      </footer>
    </div>
  );
}
