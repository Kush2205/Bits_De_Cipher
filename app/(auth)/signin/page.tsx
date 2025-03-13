"use client";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Pixelify_Sans } from "next/font/google";
import { TbBrandOnlyfans } from "react-icons/tb";
import { FiLogIn } from "react-icons/fi";
import { signIn } from "next-auth/react";
import Image from "../../../images/Poster.jpg"
const pixelify = Pixelify_Sans({ subsets: ["latin"] });

export default function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await signIn("credentials", {
      username,
      password,
      redirect: true,
      callbackUrl: "/"
    });
  };

  const handleGoogleSignin = async () => {
    await signIn("google", {
      redirect: false,
      callbackUrl: "/"
    });
  };

  return (
    <div className="flex">
      <div className="w-[50%] h-screen bg-neutral-800 flex items-center justify-center">
        <div className="w-[450px] h-[470px] bg-neutral-700 rounded-xl">
          <div>
            <h1
              style={{ fontFamily: `${pixelify.style.fontFamily}` }}
              className="text-5xl text-white font-Pixelify_Sans text-center mt-5"
            >
              Sign In
            </h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="w-full flex flex-col items-center p-8 rounded-lg">
              <input
                type="text"
                placeholder="Username"
                className="mb-4 p-3 w-[90%] bg-neutral-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="mb-4 p-3 w-[90%] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="bg-purple-600 w-[90%] h-[40px] rounded-xl flex justify-center items-center text-white text-xl hover:bg-purple-700 transition-all"
              >
                <span style={{ fontFamily: pixelify.style.fontFamily }}>
                  Sign In
                </span>
                <FiLogIn />
              </button>
            </div>
          </form>

          <div className="flex w-full justify-between items-center gap-x-4 p-3">
            <div
              onClick={handleGoogleSignin}
              className="w-[100%] hover:bg-[#2c2c2c] transition-all hover:cursor-pointer border border-white flex justify-center items-center rounded-lg py-2"
            >
              <FcGoogle className="w-[50px] h-[30px]" />
              <h1
                style={{ fontFamily: `${pixelify.style.fontFamily}` }}
                className="text-white text-sm px-1"
              >
                Sign In with Google
              </h1>
            </div>

            {/* <div className="w-[80%] hover:hover:bg-[#2c2c2c] transition-all hover:cursor-pointer border border-white flex justify-center items-center rounded-lg py-2">
              <TbBrandOnlyfans className="w-[50px] h-[30px] text-blue-400" />
              <h1
                style={{ fontFamily: `${pixelify.style.fontFamily}` }}
                className="text-white text-sm px-1"
              >
                Sign In with OnlyFans
              </h1>
            </div> */}
          </div>

          <div className="flex justify-center gap-x-1 mt-5">
            <h1
              style={{ fontFamily: `${pixelify.style.fontFamily}` }}
              className="text-white font-Roboto"
            >
              Don&apos;t have an account ?
            </h1>
            <h1
              style={{ fontFamily: `${pixelify.style.fontFamily}` }}
              className="text-blue-300 font-semibold hover:cursor-pointer hover:underline"
            >
              Sign up
            </h1>
          </div>
        </div>
      </div>
      <div  style={{
        backgroundImage: `url(${Image.src})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover", 
      }} className="w-[50%] h-screen">


      </div>
    </div>
  );
}