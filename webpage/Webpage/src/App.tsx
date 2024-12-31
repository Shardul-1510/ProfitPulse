import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Stats from './components/Stats';
import CTA from './components/CTA';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <CTA />
      
    </div>
    
  );
}

export default App;