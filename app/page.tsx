"use client";

import React, { useEffect, useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Pixelify_Sans } from "next/font/google";
import { Poppins } from "next/font/google";
import { motion } from "framer-motion";
import Link from "next/link";
import Rules from "../components/Rules";

const pixelify = Pixelify_Sans({ subsets: ["latin"] });
const PoppinsFont = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

function PageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [isFirstYear, setIsFirstYear] = useState<boolean | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [eventStarted, setEventStarted] =  useState(true);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  
  const EVENT_DATE = new Date("April 5, 2025 13:38:00").getTime();
  const gradients = ["linear-gradient(to right bottom, #0f172a, #134e4a)"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex(prev => (prev + 1) % gradients.length);
    }, 20000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const registered = localStorage.getItem('registered');
      setIsRegistered(registered === 'true');
    }
  }, []);
  
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
    if (!eventStarted) return;
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }
    if (status === "authenticated" && session?.user) {
      (async () => {
         const email = session.user.email;
         const year = email.split("24")[0];
        
        if (year !== "24" && email!="geeksforgeeks@rgipt.ac.in" && email!= "23cs3037@rgipt.ac.in" && email!="kr.kushagra2205@gmail.com") {
           setIsFirstYear(false);
          return;
       } else  {
         setIsFirstYear(true);
        }

        
        try {
          const res = await axios.post("api/db/users", {
            email: session.user.email,
            name: session.user.name
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
  
  if (isFirstYear === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-800 text-white">
        <h1 className="text-7xl" style={{ fontFamily: pixelify.style.fontFamily }}>
          Event only for 1st year
        </h1>
      </div>
    );
  }
  
  if (!eventStarted && timeRemaining) {
    return (
      <div 
        className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden text-white"
        style={{ background: gradients[currentBgIndex], transition: "background 2s ease-in-out" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] left-[-200px] top-[-200px] rounded-full bg-green-500/20 blur-[100px]"></div>
          <div className="absolute w-[500px] h-[500px] right-[-200px] bottom-[-200px] rounded-full bg-blue-500/20 blur-[100px]"></div>
          <div className="absolute w-[300px] h-[300px] left-[60%] top-[20%] rounded-full bg-purple-500/20 blur-[100px]"></div>
        </div>
        <div className="z-10 flex flex-col items-center max-w-5xl px-4">
          <motion.h1 
            className="text-4xl md:text-6xl mb-8 text-center"
            style={{ fontFamily: pixelify.style.fontFamily }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Bits De Cipher
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-12 text-center text-green-300"
            style={{ fontFamily: pixelify.style.fontFamily }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Event starts in:
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="w-[140px] h-[140px] bg-black/30 backdrop-blur-lg rounded-xl flex flex-col items-center justify-center border border-white/10 shadow-lg">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-300 to-blue-400 bg-clip-text text-transparent" style={{ fontFamily: pixelify.style.fontFamily }}>
                {timeRemaining.days}
              </div>
              <div className="text-lg mt-2 text-white/70">Days</div>
            </div>
            <div className="w-[140px] h-[140px] bg-black/30 backdrop-blur-lg rounded-xl flex flex-col items-center justify-center border border-white/10 shadow-lg">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-300 to-blue-400 bg-clip-text text-transparent" style={{ fontFamily: pixelify.style.fontFamily }}>
                {timeRemaining.hours}
              </div>
              <div className="text-lg mt-2 text-white/70">Hours</div>
            </div>
            <div className="w-[140px] h-[140px] bg-black/30 backdrop-blur-lg rounded-xl flex flex-col items-center justify-center border border-white/10 shadow-lg">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-300 to-blue-400 bg-clip-text text-transparent" style={{ fontFamily: pixelify.style.fontFamily }}>
                {timeRemaining.minutes}
              </div>
              <div className="text-lg mt-2 text-white/70">Minutes</div>
            </div>
            <div className="w-[140px] h-[140px] bg-black/30 backdrop-blur-lg rounded-xl flex flex-col items-center justify-center border border-white/10 shadow-lg">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-300 to-blue-400 bg-clip-text text-transparent" style={{ fontFamily: pixelify.style.fontFamily }}>
                {timeRemaining.seconds}
              </div>
              <div className="text-lg mt-2 text-white/70">Seconds</div>
            </div>
          </motion.div>
          <motion.p 
            className="text-xl md:text-2xl text-center mb-12 max-w-2xl"
            style={{ fontFamily: PoppinsFont.style.fontFamily }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Come back on April 5, 2025 at 4:00 PM to participate in the ultimate coding challenge!
          </motion.p>
          {isRegistered === false && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
              <Link href="/register">
                <button className="px-8 py-4 text-xl md:text-2xl text-white bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl" style={{ fontFamily: pixelify.style.fontFamily }}>
                  Register Now
                </button>
              </Link>
            </motion.div>
          )}
          {isRegistered === true && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }} className="bg-white/10 backdrop-blur-md rounded-lg p-6 max-w-2xl border border-white/20">
              <p className="text-xl text-center" style={{ fontFamily: PoppinsFont.style.fontFamily }}>
                You're all set! You've already registered for the event. We'll notify you when the challenge begins.
              </p>
            </motion.div>
          )}
        </div>
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
  
  const handleRejoin = () => router.push("/dashboard?email=" + session?.user?.email);
  
   if (userExists) {
    return (
     <div style={{ fontFamily: pixelify.style.fontFamily }} className="flex flex-col items-center justify-center min-h-screen bg-neutral-800 text-white text-5xl font-extralight">
        <h1 className="mb-4 text-center">Had your break, {session?.user?.name}, Time to kill it.</h1>
        <button onClick={handleRejoin} style={{ fontFamily: PoppinsFont.style.fontFamily }} className="px-8 py-4 mt-5 text-2xl text-white bg-blue-600 rounded hover:bg-blue-700">
          Rejoin
      </button>
      </div>
   );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral">
      <Rules>
        <button className="px-8 py-4 mt-5 text-2xl text-white  bg-blue-600 rounded hover:bg-blue-700" onClick={handleRejoin}>
          Rejoin
        </button>
      </Rules>
     
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