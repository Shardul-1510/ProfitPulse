import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  //onclicking Start Predicting go to localhost:5000/sigin
  const handleClick = () => {

    window.location.href = "http://localhost:5000/prediction";
  };
  return (
    <section id="home" className="section">
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              <span className="block">Predict Your</span>
              <span className="block text-indigo-600">Business Success</span>
            </h1>
            <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Transform your business decisions with AI-powered profit predictions. ProfitPulse analyzes your data to forecast future earnings with unprecedented accuracy.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700" onClick={handleClick}>
                Start Predicting
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
              <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
                  alt="Analytics Dashboard"
                  className="w-full rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 mix-blend-multiply" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}