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
    <div className="p-5 w-[70vw] bg-neutral-800 min-h-fit">
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
          className={`w-[1000px] h-[500px] mb-4 object-contain ${questionId === 13 ? 'flex justify-center items-center h-[80vh]' : ''}`}
        />
      </div>

      {(questionId !== 13 &&<div
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
      </div>)}
    <div>
    {(questionId !== 13 && <form
        onSubmit={(e) => {
          e.preventDefault();
          onClick(answer, questionId);
          setAnswer('');
        }}
      >
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer"
          className="p-2 w-[1000px] text-black border border-gray-300 rounded"
        />
        
          
            <div className='flex justify-center items-center'>
              <button
              type="submit"
              className='bg-green-500 mt-5 w-[100px] h-[40px] rounded-xl flex justify-center items-center text-white text-xl hover:bg-green-700 transition-all'
              style={{
                fontFamily: pixelifySans.style.fontFamily,
              }}
              >
              Submit
              </button>
            </div>
            
       
      </form>)}
    </div>
      
    </div>
  );
};

export default QuestionLayout;