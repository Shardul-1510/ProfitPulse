import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  const handleClick = () => {
    window.location.href = 'http://localhost:5000/signup';
  };
  return (
    <section id="contact" className="section">
      <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-700 rounded-2xl shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="block">Ready to transform</span>
                <span className="block">your business decisions?</span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-indigo-200">
                Start making data-driven decisions today with our AI-powered profit prediction platform.
              </p>
              <button className="mt-8 bg-white border border-transparent rounded-lg shadow px-6 py-3 inline-flex items-center text-base font-medium text-indigo-600 hover:bg-indigo-50" onClick={handleClick}>
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="-mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
            <img
              className="transform translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80"
              alt="App screenshot" />
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}