import React from 'react';
import { Wand2 } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative overflow-hidden mb-12 rounded-2xl bg-gradient-to-r from-sky-600/90 to-navy-800/90 text-white p-12 shadow-xl backdrop-blur-sm">
      <div className="relative z-10 max-w-3xl">
        <h2 className="text-5xl font-bold mb-6 animate-fade-in">
          Transform Your Ideas Into Reality
        </h2>
        <p className="text-xl text-sky-100 mb-8 animate-slide-up">
          Create compelling content, develop rich characters, and build immersive worlds with the power of AI.
        </p>
        <div className="flex space-x-4 animate-fade-in">
          <button className="px-6 py-3 bg-white text-navy-800 rounded-lg font-semibold hover:bg-sky-100 transition-colors flex items-center space-x-2">
            <Wand2 className="w-5 h-5" />
            <span>Start Creating</span>
          </button>
          <button className="px-6 py-3 border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
            Learn More
          </button>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-sky-600/20 to-navy-800/20 backdrop-blur-sm" />
      <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-sky-400 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute -left-24 -top-24 w-96 h-96 bg-navy-600 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
    </div>
  );
}