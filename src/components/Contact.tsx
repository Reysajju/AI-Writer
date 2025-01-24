import React, { useState } from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-sky-600 to-navy-800 bg-clip-text text-transparent">
          Get in Touch
        </h2>
        <p className="text-gray-700 mb-8">
          Have questions or feedback? We'd love to hear from you. Our team is here to help.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="flex items-center space-x-4 p-4 bg-sky-50/50 rounded-lg">
            <Mail className="w-6 h-6 text-sky-600" />
            <div>
              <h3 className="font-semibold text-navy-800">Email Us</h3>
              <p className="text-gray-600">support@magnatesempire.com</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-sky-50/50 rounded-lg">
            <MessageSquare className="w-6 h-6 text-sky-600" />
            <div>
              <h3 className="font-semibold text-navy-800">Live Chat</h3>
              <p className="text-gray-600">Available 24/7</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/50 backdrop-blur-sm transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/50 backdrop-blur-sm transition-all"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/50 backdrop-blur-sm transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-600 to-navy-800 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-sky-700 hover:to-navy-900 transition-all transform hover:-translate-y-1"
          >
            <Send className="w-5 h-5" />
            <span>Send Message</span>
          </button>
        </form>
      </div>
    </div>
  );
}