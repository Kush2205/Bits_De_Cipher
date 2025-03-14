"use client";
import React, { useState, useEffect, useRef, Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import QuestionLayout from "../../components/QuestionLayout";
import LeaderBoard from "../../components/LeaderBoard";
import Popup from "../../components/Popup";
import { useRouter } from "next/navigation";
import { Pixelify_Sans } from "next/font/google";

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
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const WS_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8080";
  const socketRef = useRef<WebSocket | null>(null);

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

   
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected to:", WS_URL);
      socket.send(JSON.stringify({
        command: "connect",
        email: email
      }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);

        if (data.leaderboard) {
          setLeaderboard(data.leaderboard);
        }

        if (data.answerStatus === "correct") {
          localStorage.setItem("hint1", "false");
          localStorage.setItem("hint2", "false");
          setShowPopup(true);
          setPopupContent("Correct Answer");
        } else if (data.answerStatus === "incorrect") {
          setShowPopup(true);
          setPopupContent("Wrong Answer");
        }

        if (data.question) {
          setQuestionDetails(data.question);
        }

        if (data.hint1) {
          setShowPopup(true);
          setPopupContent(data.hint1);
          if (data.points) {
            setQuestionDetails(prevDetails => prevDetails && ({
              ...prevDetails,
              points: data.points
            }));
          }
          localStorage.setItem("hint1", data.hint1);
        }
        if (data.hint2) {
          setShowPopup(true);
          setPopupContent(data.hint2);
          if (data.points) {
            setQuestionDetails(prevDetails => prevDetails && ({
              ...prevDetails,
              points: data.points
            }));
          }
          localStorage.setItem("hint2", data.hint2);
        }

        setTimeout(() => {
          if (data.updatedQuestion) {
            setQuestionDetails(data.updatedQuestion);
          }
        }, 1500);

      } catch (error) {
        console.error("Error parsing message:", error, event.data);
      }
    };

    socket.onclose = (event) => {
      console.log("WebSocket closed. Code:", event.code, "Reason:", event.reason);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [email, WS_URL , router]);

  function handleAnswerSubmit(answer: string, id: string) {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({
        command: "answer",
        email: email,
        answer: {
          id: id,
          answer: answer
        }
      }));
    }
  }

  const getHint1 = () => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({
        command: "hint1",
        email: email,
      }));
    }
  };

  const getHint2 = () => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({
        command: "hint2",
        email: email,
      }));
    }
  };

  return (
    <div className="flex h-[100vh] bg-neutral-800">
      {questionDetails && (
        <QuestionLayout
          imageUrl={questionDetails.imageUrl}
          questionId={questionDetails.questionId}
          points={questionDetails.points}
          onClick={(answer: string) =>
            handleAnswerSubmit(answer, questionDetails.questionId.toString())
          }
          onHint1={getHint1}
          onHint2={getHint2}
        />
      )}

      {leaderboard && (
        <LeaderBoard leaderboard={leaderboard} />
      )}

      {showPopup && (
        <Popup content={popupContent} closePopup={() => setShowPopup(false)} />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {localStorage.getItem("status") === "unauthenticated" && (
        <div style={{fontFamily: pixelify.style.fontFamily}} className="flex flex-col items-center justify-center min-h-screen bg-neutral-800 text-white text-5xl font-extralight">
          <h1>Please sign in first</h1>
          <button onClick={() => {window.location.href = "/signin"}} className="px-8 py-4 mt-5 text-2xl text-white bg-blue-600 rounded hover:bg-blue-700" >Sign In</button>

          </div>
      )}
      <DashboardContent />
    </Suspense>
  );
}