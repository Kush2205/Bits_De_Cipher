"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import QuestionLayout from "../../components/QuestionLayout";
import LeaderBoard from "../../components/LeaderBoard";
import Popup from "../../components/Popup";
import { Pixelify_Sans } from "next/font/google";
import image from "../../images/404.png";

const pixelify = Pixelify_Sans({ subsets: ["latin"] });

interface Leaderboard {
  rank: number;
  name: string;
  points: number;
}

interface QuestionDetails {
  imageUrl: string;
  questionId: number;
  points: number;
}

function DashboardContent() {
  const [questionDetails, setQuestionDetails] = useState<QuestionDetails | null>(null);
  const [leaderboard, setLeaderboard] = useState<Leaderboard[] | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupContent, setPopupContent] = useState<string>("");
const [userPoints, setUserPoints] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const WS_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:808";
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const status = typeof window !== "undefined" ? localStorage.getItem("status") : null;
    setIsAuthenticated(status !== "unauthenticated");
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!email) {
      console.error("No email provided in query parameters.");
      return;
    }
    
    setLoading(true);
    
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;
    
    socket.onopen = () => {
      socket.send(JSON.stringify({ command: "connect", email }));
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.message) {
          setPopupContent(data.message);
          setShowPopup(true);
        }
        
        if (data.leaderboard) {
          setLeaderboard(data.leaderboard);
        }
        
        if (data.answerStatus === "correct") {
          if (typeof window !== "undefined") {
            localStorage.setItem("hint1", "false");
            localStorage.setItem("hint2", "false");
          }
          setPopupContent("Correct Answer");
          setShowPopup(true);
        } else if (data.answerStatus === "incorrect") {
          setPopupContent("Wrong Answer");
          setShowPopup(true);
        }
        
        if (data.question) {
          setQuestionDetails(data.question);
          setQuestion(data.question);
          setLoading(false); // Stop loading when question data is received
        }
        
        if (data.hint1) {
          setShowPopup(true);
          setPopupContent(data.hint1);
          if (data.points) {
            setQuestionDetails((prevDetails) =>
              prevDetails ? { ...prevDetails, points: data.points } : prevDetails
            );
          }
          if (typeof window !== "undefined") {
            localStorage.setItem("hint1", data.hint1);
          }
        }
        
        if (data.hint2) {
          setShowPopup(true);
          setPopupContent(data.hint2);
          if (data.points) {
            setQuestionDetails((prevDetails) =>
              prevDetails ? { ...prevDetails, points: data.points } : prevDetails
            );
          }
          if (typeof window !== "undefined") {
            localStorage.setItem("hint2", data.hint2);
          }
        }

        if(data.totalPoints) {
         
          setUserPoints(data.totalPoints);
        }
        
        setTimeout(() => {
          if (data.updatedQuestion) {
            setQuestionDetails(data.updatedQuestion);
            setQuestion(data.updatedQuestion);
          }
        }, 1500);
      } catch (error) {
        console.error("Error parsing message:", error, event.data);
      }
    };
    
    socket.onclose = (event) => {
      console.log("WebSocket closed. Code:", event.code, "Reason:", event.reason);
    };
    
    
    
    // Set a timeout to stop the loading state if it takes too long
    const timeout = setTimeout(() => {
      if (loading) setLoading(false);
    }, 10000); // 10 second timeout
    
    return () => {
      clearTimeout(timeout);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [email, WS_URL]);

  function handleAnswerSubmit(answer: string, id: string) {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ command: "answer", email, answer: { id, answer } }));
    }
  }

  const getHint1 = () => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ command: "hint1", email }));
    }
  };

  const getHint2 = () => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ command: "hint2", email }));
    }
  };

  if (email === "geeksforgeeks@rgipt.ac.in") {
    return (
      <div className="flex justify-center w-full h-[100vh] bg-neutral-800">
        <div id="leaderboard" className="overflow-y-scroll overflow-x-hidden flex justify-center border-none bg-neutral-800 w-full">
          {loading ? (
            <div className="flex items-center justify-center w-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500" />
            </div>
          ) : (
            leaderboard && <LeaderBoard leaderboard={leaderboard} userPoints={userPoints}/>
          )}
        </div>
        {showPopup && <Popup content={popupContent} closePopup={() => setShowPopup(false)} />}
      </div>
    );
  }

  return (
    <div className="flex h-[100vh] bg-neutral-800">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-500 mb-4" />
            <p className="text-white text-xl" style={{ fontFamily: pixelify.style.fontFamily }}>
              Loading question...
            </p>
          </div>
        </div>
      ) : (
        questionDetails && (
          <QuestionLayout
            imageUrl={questionDetails.imageUrl}
            questionId={questionDetails.questionId}
            points={questionDetails.points}
            onClick={(answer: string) => handleAnswerSubmit(answer, questionDetails.questionId.toString())}
            onHint1={getHint1}
            onHint2={getHint2}
          />
        )
      )}
      <div id="leaderboard" className="overflow-y-scroll overflow-x-hidden border-none bg-neutral-800">
        {loading ? (
          <div className="flex items-center justify-center h-20 mt-5">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
          </div>
        ) : (
          leaderboard && <LeaderBoard leaderboard={leaderboard} userPoints={userPoints}/>
        )}
      </div>
      {showPopup && <Popup content={popupContent} closePopup={() => setShowPopup(false)} />}
    </div>
  );
}

function AuthCheck() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsClient(true);
    const status = localStorage.getItem("status");
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [router]);
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
      </div>
    );
  }
  if (isClient && localStorage.getItem("status") === "unauthenticated") {
    return (
      <div style={{ fontFamily: pixelify.style.fontFamily }} className="flex flex-col items-center justify-center min-h-screen bg-neutral-800 text-white text-5xl font-extralight">
        <h1>Please sign in first</h1>
        <button onClick={() => (window.location.href = "/signin")} className="px-8 py-4 mt-5 text-2xl text-white bg-blue-600 rounded hover:bg-blue-700">
          Sign In
        </button>
      </div>
    );
  }
  return <DashboardContent />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-neutral-800">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
        </div>
      }
    >
      <AuthCheck />
    </Suspense>
  );
}