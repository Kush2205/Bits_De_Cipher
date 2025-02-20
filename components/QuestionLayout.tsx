//// filepath: /d:/Projects/TypeScript Projects/Bits_De_Cipher/components/QuestionLayout.tsx
import React, { useState } from 'react';
import { Pixelify_Sans } from 'next/font/google';
import Image from 'next/image';
const pixelifySans = Pixelify_Sans({ subsets: ['latin'] });

interface QuestionProps {
  imageUrl: string;
  questionId: number;
  points: number;
  onClick: (answer: string, questionId: number) => void;
  onHint1: (questionId: number) => void;
  onHint2: (questionId: number) => void;
}

const QuestionLayout: React.FC<QuestionProps> = ({
  imageUrl,
  questionId,
  points,
  onClick,
  onHint1,
  onHint2
}) => {
  const [answer, setAnswer] = useState('');
  let deduction = 0;
  if (localStorage.getItem('hint1') === 'true') {
    deduction = 10;
  }
  if (localStorage.getItem('hint2') === 'true') {
    deduction = 20;
  }

  return (
    <div className="p-5 w-[70vw] bg-neutral-800 h-[90%]">
      <div className="w-full flex justify-around">
        <h2
          style={{
            fontFamily: pixelifySans.style.fontFamily,
          }}
          className="text-2xl font-semibold mb-4 text-white w-[50%]"
        >
          Question {questionId}
        </h2>
        <h2
          style={{
            fontFamily: pixelifySans.style.fontFamily,
          }}
          className="text-2xl font-semibold mb-4 text-white w-[50%] flex justify-end"
        >
          Points : {Math.floor(points - (points * deduction) / 100)}
        </h2>
      </div>

      <div>
        <img
          src={imageUrl}
          alt={`Question ${questionId}`}
          className="w-[1000px] h-[500px] mb-4 object-contain"
        />
      </div>

      <div
        style={{ fontFamily: pixelifySans.style.fontFamily }}
        className="flex gap-5 my-5 w-full justify-center gap-x-10"
      >
        <button
          onClick={() => onHint1(questionId)}
          className="px-4 py-2 bg-blue-500 text-gray-200 rounded hover:bg-gray-300"
        >
          Hint 1
        </button>
        <button
          onClick={() => onHint2(questionId)}
          className="px-4 py-2 bg-blue-500 text-gray-200 rounded hover:bg-gray-300"
        >
          Hint 2
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onClick(answer, questionId);
        }}
      >
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer"
          className="p-2 w-[1000px] mb-3 border border-gray-300 rounded"
        />
        <div className="w-full flex justify-center">
          <button
            type="submit"
            className="w-[200px] h-[50px] bg-green-600 text-white rounded hover:bg-green-700 transition-all flex items-center justify-center text-3xl mt-3"
            style={{
              fontFamily: pixelifySans.style.fontFamily,
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionLayout;