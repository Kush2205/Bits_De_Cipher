"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import React from "react";
import gfg from "../images/logo.png";
import { useRouter } from "next/navigation";
import { Pixelify_Sans } from "next/font/google";


const pixelify = Pixelify_Sans({ subsets: ["latin"] });
function NavBarContent() {
  const router = useRouter();
  const { data: session } = useSession();
   const imgUrl = session?.user?.image;
  return (
    <nav className="w-full flex items-center justify-between  bg-neutral-800 text-white border-gray-400 border-b-[1px]">
      <div className="flex items-center gap-x-4 mx-2 mt-2 mb-2">
        <img src={gfg.src}  alt="Logo" className="h-10 w-10 " />
        <span className={`${pixelify.className} text-2xl`}>GFG RGIPT SC</span>
      </div>
      <div>
        {session ? (
          <div className="flex items-center justify-center gap-x-6 mr-3">
            <img className="w-10 h-10 rounded-full" src={imgUrl} alt="User Image" />
            <button onClick={() => {router.push("/rules")}} className="px-3 py-1 bg-green-600 text-white rounded-lg">
              <span className="text-lg">Rules</span>
            </button>
            <button
              className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
              onClick={() => signOut({callbackUrl : "/signin"})}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <span></span>
        )}
      </div>
    </nav>
  );
}

export function Navbar() {
  return (
    <SessionProvider>
      <NavBarContent />
    </SessionProvider>
  );
}