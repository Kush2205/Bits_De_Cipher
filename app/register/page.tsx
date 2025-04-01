"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Pixelify_Sans } from "next/font/google";
import Image from 'next/image';
import { motion } from 'framer-motion';
import logo from "../../images/logo.png"
const pixelify = Pixelify_Sans({ subsets: ["latin"] });

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  
  const router = useRouter();

  const bgGradients = [
    'linear-gradient(to right bottom, #134e4a, #042f2e)',
  
  ];

  

  const validateForm = () => {
    if (!name.trim()) {
      setError('Name is required');
      return false;
    }
    
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
      
      const data = await response.json();
      
      // This is where you set localStorage based on the response
      if (response.status === 201 || response.status === 409) {
        // User was registered or already exists - either way they're now "registered"
        localStorage.setItem('registered', 'true');
        setSuccess(true);
        
        // Automatically redirect after successful registration
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        throw new Error(data.message || 'Registration failed');
      }
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex min-h-screen items-center justify-center overflow-hidden bg-black"
      style={{ 
        backgroundImage: bgGradients[currentBg],
        transition: 'background-image 2s ease-in-out'
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute w-[500px] h-[500px] left-[-250px] top-[-250px] rounded-full bg-green-500 blur-[150px]"></div>
          <div className="absolute w-[500px] h-[500px] right-[-250px] bottom-[-250px] rounded-full bg-blue-600 blur-[150px]"></div>
          <div className="absolute w-[300px] h-[300px] left-[50%] top-[20%] rounded-full bg-purple-700 blur-[150px]"></div>
          <div className="animate-pulse absolute w-[200px] h-[200px] right-[20%] top-[60%] rounded-full bg-teal-500 blur-[150px]"></div>
        </div>
      </div>

      {/* Content container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-[95%] max-w-5xl flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl shadow-green-900/20 backdrop-blur-lg bg-neutral-900/60 z-10"
      >
        {/* Form side */}
        <div className="w-full md:w-3/5 p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h1 
              className="text-4xl md:text-5xl text-green-400 mb-2 text-center md:text-left"
              style={{ fontFamily: pixelify.style.fontFamily }}
            >
              Join the Challenge
            </h1>
            <p className="text-neutral-400 text-center md:text-left mb-8">
              Register for Bits De Cipher and test your coding skills
            </p>
          </motion.div>
          
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-4 flex items-center justify-center"
              >
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h2 
                className="text-2xl text-green-400 mb-4"
                style={{ fontFamily: pixelify.style.fontFamily }}
              >
                Registration Successful!
              </h2>
              <p className="text-white mb-4">
                Thank you for registering for Bits De Cipher. We&apos;re excited to have you join us!
              </p>
              <p className="text-neutral-400 text-sm">
                Redirecting you to the home page...
              </p>
            </motion.div>
          ) : (
            <motion.form 
              onSubmit={handleSubmit} 
              className="bg-neutral-800/50 backdrop-blur rounded-xl shadow-lg p-8 border border-neutral-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-red-500/10 border border-red-500/30 text-white p-4 rounded-lg mb-6"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
              
              <div className="mb-5">
                <label 
                  htmlFor="name" 
                  className="block text-green-400 text-sm font-medium mb-2"
                  style={{ fontFamily: pixelify.style.fontFamily }}
                >
                  Your Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label 
                  htmlFor="email" 
                  className="block text-green-400 text-sm font-medium mb-2"
                  style={{ fontFamily: pixelify.style.fontFamily }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white transition-all duration-200"
                    placeholder="Your college email"
                  />
                </div>
              </div>
              
              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-center ${
                  loading 
                    ? 'bg-neutral-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
                } text-white font-medium transition duration-200`}
                style={{ fontFamily: pixelify.style.fontFamily }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Join the Challenge'
                )}
              </motion.button>
              
              <div className="mt-6 flex items-center justify-center space-x-4">
                <div className="h-px bg-neutral-700 flex-grow"></div>
                <p className="text-neutral-400 text-sm">Already registered?</p>
                <div className="h-px bg-neutral-700 flex-grow"></div>
              </div>
              
              <div className="mt-4 text-center">
                <a 
                  href="/signin" 
                  className="text-green-400 hover:text-green-300 font-medium transition-colors duration-200"
                  style={{ fontFamily: pixelify.style.fontFamily }}
                >
                  Sign in to your account
                </a>
              </div>
            </motion.form>
          )}
        </div>
        
        {/* Image/Graphics side */}
        <div className="hidden md:block md:w-2/5 bg-gradient-to-br from-black to-neutral-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full opacity-30">
              <div className="absolute w-[400px] h-[400px] right-[-100px] top-[-100px] rounded-full bg-green-500 blur-[80px]"></div>
              <div className="absolute w-[300px] h-[300px] left-[-50px] bottom-[-50px] rounded-full bg-teal-600 blur-[80px]"></div>
            </div>
          </div>
          
          <div className="relative h-full flex flex-col items-center justify-center p-10 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mb-8"
            >
              <Image
                src={logo} // Replace with your actual logo
                alt="Bits De Cipher Logo"
                width={180}
                height={180}
                className="object-contain"
              />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-3xl text-green-400 text-center mb-6"
              style={{ fontFamily: pixelify.style.fontFamily }}
            >
              Bits De Cipher
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <p className="text-white text-center mb-8">
                Join our Coding  and Puzzle challenge to compete with others and win prizes!
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="grid grid-cols-2 gap-4 w-full max-w-xs"
            >
              <div className="bg-neutral-800/50 backdrop-blur rounded-lg p-4 border border-neutral-700/50 flex flex-col items-center">
                <span className="text-green-400 text-xl font-bold">2</span>
                <span className="text-neutral-400 text-sm">Challenges</span>
              </div>
              <div className="bg-neutral-800/50 backdrop-blur rounded-lg p-4 border border-neutral-700/50 flex flex-col items-center">
                <span className="text-green-400 text-xl font-bold">100+ </span>
                <span className="text-neutral-400 text-sm">Past Participants</span>
              </div>
              <div className="bg-neutral-800/50 backdrop-blur rounded-lg p-4 border border-neutral-700/50 flex flex-col items-center">
                <span className="text-green-400 text-xl font-bold">30 Hrs</span>
                <span className="text-neutral-400 text-sm">Competition</span>
              </div>
              <div className="bg-neutral-800/50 backdrop-blur rounded-lg p-4 border border-neutral-700/50 flex flex-col items-center">
                <span className="text-green-400 text-xl font-bold">₹3000+</span>
                <span className="text-neutral-400 text-sm">In Prizes</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}