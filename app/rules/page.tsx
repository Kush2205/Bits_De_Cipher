import React, { ReactNode } from 'react'
import { Pixelify_Sans } from 'next/font/google'
const pixelify = Pixelify_Sans({ subsets: ["latin"] });
interface RulesProps {
    children?: ReactNode;
}
function Rules({ children }: RulesProps) {
    return (
        <div style={{ fontFamily: pixelify.style.fontFamily }} className='h-fit p-8 bg-neutral-800 justify-center items-center w-full'>
            <h1 className='text-center text-7xl text-green-600 py-2 underline underline-offset-[10px] decoration-white'>  About Contest  </h1>
            <div className='flex flex-col justify-center items-center ml-4 space-y-4 w-full mt-9 text-3xl'>
                <div className='flex flex-col gap-y-3 w-[70%]'>
                    <h1 className='text-white font-extralight'>1. There are a total of 11 questions in this contest.</h1>
                    <h1 className='text-white font-extralight'>2. There is no time limit on any question. Take your time 😉</h1>
                    <h1 className='text-white font-extralight'>3. The points of question will be indicated at the top right.</h1>
                    <h1 className='text-white font-extralight'>4. The LeaderBoard will be displayed on the right side of the screen.</h1>
                    <h1 className='text-white font-extralight'>5. This website is only designed for devices with screen size greater than 1200px [laptops, tablets etc.] . Any inconvenience caused is not regretted.</h1>
                    <h1 className='text-white font-extralight'>6. In case of technical failure do not worry we have used extensive databases to steal your data . If you encounter any issue mail us at geeksforgeeks@rgipt.ac.in.</h1>
                </div>
            </div>
            <h1 className='text-center text-7xl text-green-600 py-2 underline underline-offset-[10px] mt-4 decoration-white'>  Rules  </h1>
            <div className='flex flex-col justify-center items-center ml-4 space-y-4 w-full mt-9 text-3xl'>
                <div className='flex flex-col gap-y-3 w-[70%]'>
                    <h1 className='text-white font-extralight'>1. The points of each question is relative to how many people have answered it. Whenever a contestant answers a question correctly the points of the particular question are reduced by 5%.</h1>
                    <h1 className='text-white font-extralight'>2. You are provided with two hints. Using Hint 1 reduces your points by 10% and using Hint 2 reduces your points by 20%. You can only use Hint 2 after using Hint 1</h1>
                    <h1 className='text-white font-extralight'>3. In case of any dispute decision of organizers will be final.</h1>
                    <h1 className='text-white font-extralight'>4. Keep the first letter of your answer in capital.<br/> Ex 1: If answer is cat please type Cat.<br/>Ex 2: If your answer is cat dog please enter Cat Dog </h1>
                    <h1 className='text-white font-extralight'>5. Ensure proper whitespace in your answer.<br/> Ex: If answer is Cat1 please type Cat 1.</h1>
                    <h1 className='text-white font-extralight'>6. We regret any physical or emotional trauma you may suffer during this contest. 😔</h1>
                </div>
            </div>
           
            
        </div>
    )
}
export default Rules;