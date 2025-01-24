import React from 'react';
import { Users, Lightbulb, Shield } from 'lucide-react';

export function About() {
  return (
    <div className="space-y-12 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-sky-600 to-navy-800 bg-clip-text text-transparent">
          About Magnates Empire
        </h2>
        <p className="text-gray-700 leading-relaxed">
          We are a pioneering force in AI-powered content creation, dedicated to empowering writers, creators, and storytellers with cutting-edge tools that enhance their creative process.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: Users,
            title: "Our Team",
            description: "A diverse group of AI experts, writers, and developers working together to push the boundaries of creative technology."
          },
          {
            icon: Lightbulb,
            title: "Our Mission",
            description: "To democratize content creation by making professional-grade AI tools accessible to creators worldwide."
          },
          {
            icon: Shield,
            title: "Our Values",
            description: "Commitment to innovation, user privacy, and ethical AI development guide everything we do."
          }
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <item.icon className="w-12 h-12 text-sky-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-navy-800">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}