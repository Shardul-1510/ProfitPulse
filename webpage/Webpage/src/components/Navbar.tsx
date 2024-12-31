import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import axios from 'axios';
import Hero from './Hero';
import Features from './Features';
import Stats from './Stats';
import CTA from './CTA';


interface User {
  uname: string;
  fname: string;
  lname: string;
}

const Navbar: React.FC = () => {
  const [user, setUser ] = useState<User | null>(null); // State to hold user data

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<User>('http://localhost:4000/getusername')
        setUser(response.data); // Set user data if available
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);
  

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4000/logout');
      setUser (null); // Clear user data on logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
              ProfitPulse
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-slate-600 hover:text-indigo-600 transition-colors">Home</a>
            <a href="#features" className="text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#about" className="text-slate-600 hover:text-indigo-600 transition-colors">About</a>
            <a href="#contact" className="text-slate-600 hover:text-indigo-600 transition-colors">Contact</a>
            {/* Conditional rendering based on user state */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-slate-600">Welcome, {user.fname} {user.lname} </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <a href="http://localhost:5000/signin" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  Sign In
                </a>
                <a href="http://localhost:5000/signup" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;