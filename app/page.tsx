
"use client";

import React, { useEffect, useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Pixelify_Sans } from "next/font/google";
import { Poppins } from "next/font/google";

import Rules from "../components/Rules";
const pixelify = Pixelify_Sans({ subsets: ["latin"] });
const PoppinsFont = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

function PageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userExists, setUserExists] = useState<boolean | null>(null);
  

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }
    if (status === "authenticated" && session?.user) {
      
      (async () => {
        try {
          const res = await axios.post("api/db/users", {
            email: session.user.email,
            name: session.user.name,
          });

          if (res.data.message === "User already exists") {
            setUserExists(true);
            localStorage.setItem("status", "authenticated");
          } else {
            setUserExists(false);
            localStorage.setItem("status", "authenticated");
          }
        } catch (error) {
          console.error("Error checking user existence:", error);
        }
      })();
    }
  }, [status, session, router]);

  if (status === "loading" || userExists === null) {
    return (
      <div  className="flex items-center justify-center min-h-screen bg-neutral-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
      </div>
    );
  }

  const handleRejoin = () => {
    return router.push("/dashboard?email=" + session?.user?.email);
  };

  if (userExists) {
    return (
      <div
        style={{ fontFamily: pixelify.style.fontFamily }}
        className="flex flex-col items-center justify-center min-h-screen bg-neutral-800 text-white text-5xl font-extralight"
      >
        <h1 className="mb-4">
          Had your break, {session?.user?.name} , Time to kill it.
        </h1>
        <button
          onClick={handleRejoin}
          style={{ fontFamily: PoppinsFont.style.fontFamily }}
          className="px-8 py-4 mt-5 text-2xl text-white bg-green-600 rounded hover:bg-green-700"
        >
          Rejoin
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral">
       <Rules/>
     <div className="w-full bg-neutral-800 flex flex-col items-center justify-center p-5">
     <button className="px-8 py-4 mt-5 text-2xl text-white bg-blue-600 rounded hover:bg-blue-700" onClick={handleRejoin}>Start</button>
     </div>
      
    </div>
  );
}

export default function Page() {
  return (
    <SessionProvider>
      <PageContent />
    </SessionProvider>
  );
}