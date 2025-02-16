
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import QuestionLayout from "../../components/QuestionLayout";
import LeaderBoard from "../../components/LeaderBoard";
export default function Page() {
  const [questionDetails, setQuestionDetails] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any>(null);

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

     
        if (data.question) {
          setQuestionDetails(data.question);
        }

     
        if (data.updatedQuestion) {
          setQuestionDetails(data.updatedQuestion);
        }
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
  }, [email, WS_URL]);

  return (
    <div className="flex">
      
      {questionDetails && (
        <QuestionLayout
          imageUrl={questionDetails.imageUrl}
          questionId={questionDetails.questionId}
          points = {questionDetails.points}
        />
      )}

      {leaderboard && (
        <LeaderBoard leaderboard={leaderboard} />
      )}

    </div>
  );
}