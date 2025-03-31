
import React from 'react';
import { Pixelify_Sans } from 'next/font/google';

const pixelify = Pixelify_Sans({ subsets: ['latin'] });

interface LeaderBoardEntry {
  rank: number;
  name: string;
  points: number;
}

interface LeaderBoardProps {
  
  leaderboard: LeaderBoardEntry[];
}

function LeaderBoard({ leaderboard }: LeaderBoardProps) {
  const displayPosition = (rank: number, name: string, points: number, index: number) => {
    const firstname = name.split(' ')[0];
    const formattedName = firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();
    return (
      <div
        key={index}
        style={{ fontFamily: pixelify.style.fontFamily }}
        className="relative mt-5  flex justify-around pb-2 after:content-[''] after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[1px] after:bg-neutral-800"
      >
        <div className='w-[33.33%]'> <h1 className="text-white text-2xl text-center">{rank}</h1></div>
        <div className='w-[33.33%]'><h1 className="text-white text-2xl text-center">{formattedName}</h1></div>
        <div className='w-[33.33%]'> <h1 className="text-white text-2xl text-center">{points}</h1></div>
       
        
       
      </div>
    );
  };

  return (
    <div >
      <div
      style={{ fontFamily: pixelify.style.fontFamily }}
      className="w-[30vw] h-[150vh] bg-neutral-800 border-gray-300  border-l-2 border-b-0 shadow-lg"
    >
      <div className="mt-3">
        <h1 className="text-green-400 text-5xl underline text-center">GeeksBoard</h1>
      </div>
      <div className="overflow-y-auto ">
        {leaderboard.map((entry, index) =>
          displayPosition(entry.rank, entry.name, entry.points, index)
        )}
      </div>
    </div>
    </div>
  );
}

export default LeaderBoard;