//// filepath: /d:/Projects/TypeScript Projects/Bits_De_Cipher/components/Popup.tsx
"use client";
import React, { useState } from "react";
import { Pixelify_Sans } from "next/font/google";

const pixelify = Pixelify_Sans({ subsets: ["latin"] });

function Popup(props: {
  content: string;
  closePopup: () => void;
}) {
  const { content, closePopup } = props;
  const [closing, setClosing] = useState(false);

  
  const splitted = content.split(" ");
  const message = splitted[0];
  console.log(message);
 
  const handleClose = () => {
    setClosing(true);
   
    setTimeout(() => {
      closePopup();
    }, 200);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-10 flex items-center justify-center">
    
      <div className="absolute w-full h-full bg-black bg-opacity-50 backdrop-blur-sm"></div>

      
      <div
        style={{ fontFamily: pixelify.style.fontFamily }}
        className={`relative z-10 w-[600px] h-fit py-10 text-white border-2 
                    border-black rounded-lg bg-neutral-800 flex flex-col 
                    justify-center 
                    ${closing ? "animate-slideUp" : "animate-slideDown"}`}
      >
        <div className="flex justify-center mt-4">
          <h1 className="text-5xl font-bold underline">Message</h1>
        </div>
        <div
          style={{ color: message === "Correct" ? "green" : message === "Wrong" ? "red" : "" }}
          className="p-5 text-center text-2xl"
        >
          {content}
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleClose}
            className="bg-blue-500 text-white p-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;