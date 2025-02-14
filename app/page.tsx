
"use client";

import React, { useEffect, useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getWebSocket } from "../lib/WebSocket";
import axios from "axios";

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
    
      const ws = getWebSocket();
      if (ws) {
        console.log("WebSocket instance:", ws);
      }
     
      (async () => {
        try {
          const res = await axios.post("api/db/users", {
            email: session.user.email,
            name: session.user.name,
          });
     
          if (res.data.message === "User already exists") {
            setUserExists(true);
          } else {
            setUserExists(false);
          }
        } catch (error) {
          console.error("Error checking user:", error);
          setUserExists(false);
        }
      })();
    }
  }, [status, session, router]);


  if (status === "loading" || userExists === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

 
  if (userExists) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="mb-4">Welcome, {session?.user?.email}</h1>
        <button className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
          Rejoin
        </button>
      </div>
    );
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
     
     
      <h1 className="mb-4">Rules Page</h1>
      <p>Please read and accept the following rules to proceed.</p>
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