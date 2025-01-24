import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-sky-900/90 to-navy-900/90 text-white backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-4">Magnates Empire</h3>
            <p className="text-sky-100/80">
              Empowering creators with AI-powered tools for content creation and storytelling.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sky-100/80 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-sky-100/80 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-sky-100/80 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-sky-100/80 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Tools</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sky-100/80 hover:text-white transition-colors">AI Articles</a></li>
              <li><a href="#" className="text-sky-100/80 hover:text-white transition-colors">Character Creator</a></li>
              <li><a href="#" className="text-sky-100/80 hover:text-white transition-colors">World Builder</a></li>
              <li><a href="#" className="text-sky-100/80 hover:text-white transition-colors">API Access</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-sky-400 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-sky-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-sky-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-sky-400 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-sky-700/50 mt-8 pt-8 text-center text-sky-100/60">
          <p>&copy; {new Date().getFullYear()} Magnates Empire. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}