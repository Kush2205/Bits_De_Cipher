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
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [eventStarted, setEventStarted] = useState(false);
  
  const EVENT_DATE = new Date("April 5,2025 16:00:00").getTime();

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const distance = EVENT_DATE - now;
      
      if (distance <= 0) {
        setEventStarted(true);
        return null;
      }
      
      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      };
    };
    
    setTimeRemaining(calculateTimeRemaining());
    
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      
      if (!remaining) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
    
  }, [EVENT_DATE]);


  useEffect(() => {
   
    if (!eventStarted) {
      return;
    }
    
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
  }, [status, session, router, eventStarted]);

  if (!eventStarted && timeRemaining) {
    return (
      <div style={{ fontFamily: pixelify.style.fontFamily }} className="flex flex-col items-center justify-center min-h-screen bg-neutral-800 text-white">
        <h1 className="text-5xl mb-8">Event starts in:</h1>
        <div className="flex gap-6 text-center">
          <div className="bg-neutral-700 p-6 rounded-lg min-w-[120px]">
            <div className="text-6xl">{timeRemaining.days}</div>
            <div className="text-xl mt-2">Days</div>
          </div>
          <div className="bg-neutral-700 p-6 rounded-lg min-w-[120px]">
            <div className="text-6xl">{timeRemaining.hours}</div>
            <div className="text-xl mt-2">Hours</div>
          </div>
          <div className="bg-neutral-700 p-6 rounded-lg min-w-[120px]">
            <div className="text-6xl">{timeRemaining.minutes}</div>
            <div className="text-xl mt-2">Minutes</div>
          </div>
          <div className="bg-neutral-700 p-6 rounded-lg min-w-[120px]">
            <div className="text-6xl">{timeRemaining.seconds}</div>
            <div className="text-xl mt-2">Seconds</div>
          </div>
        </div>
        <p className="mt-12 text-2xl">Come back on April 5, 2025 at 4:00 PM to participate!</p>
      </div>
    );
  }

  if (status === "loading" || userExists === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-800">
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
          Had your break, {session?.user?.name}, Time to kill it.
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