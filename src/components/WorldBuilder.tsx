import React, { useState } from 'react';
import { Globe2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function WorldBuilder() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [geography, setGeography] = useState('');
  const [culture, setCulture] = useState('');
  const [history, setHistory] = useState('');
  const [magicSystem, setMagicSystem] = useState('');
  const [technologyLevel, setTechnologyLevel] = useState('medieval');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async () => {
    if (!geography || !description) {
      setError('Please provide both a description and geography for the world');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to generate images');

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': 'AIzaSyBVWiD5DJxtHDLVgeJ_e7wCXK9AVf-L-Bs'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Create a detailed landscape visualization of this world: ${name}
                     Description: ${description}
                     Geography: ${geography}
                     Technology Level: ${technologyLevel}
                     Make it a detailed and immersive landscape view.`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        setError('Image generation is not available. Here is a description of how your world would look:\n\n' + 
                data.candidates[0].content.parts[0].text);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to create worlds');

      const { error: insertError } = await supabase
        .from('worlds')
        .insert({
          user_id: user.id,
          name,
          description,
          geography,
          culture,
          history,
          magic_system: magicSystem,
          technology_level: technologyLevel,
          generated_image: generatedImage
        });

      if (insertError) throw insertError;

      // Reset form
      setName('');
      setDescription('');
      setGeography('');
      setCulture('');
      setHistory('');
      setMagicSystem('');
      setTechnologyLevel('medieval');
      setGeneratedImage('');

      alert('World created successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">World Builder</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4" data-netlify="true" name="world-builder">
        <input type="hidden" name="form-name" value="world-builder" />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            World Name
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter world name..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your world..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Geography
            </label>
            <textarea
              name="geography"
              value={geography}
              onChange={(e) => setGeography(e.target.value)}
              className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the geography..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Culture
            </label>
            <textarea
              name="culture"
              value={culture}
              onChange={(e) => setCulture(e.target.value)}
              className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the culture..."
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            History
          </label>
          <textarea
            name="history"
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write the world's history..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Magic System
          </label>
          <textarea
            name="magic-system"
            value={magicSystem}
            onChange={(e) => setMagicSystem(e.target.value)}
            className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the magic system (if any)..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Technology Level
          </label>
          <select
            name="technology-level"
            value={technologyLevel}
            onChange={(e) => setTechnologyLevel(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="primitive">Primitive</option>
            <option value="medieval">Medieval</option>
            <option value="renaissance">Renaissance</option>
            <option value="industrial">Industrial</option>
            <option value="modern">Modern</option>
            <option value="futuristic">Futuristic</option>
          </select>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg whitespace-pre-wrap">
            {error}
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={generateImage}
            disabled={isLoading || !description || !geography}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-purple-700 hover:to-indigo-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Globe2 className="w-5 h-5" />
                <span>Generate Landscape</span>
              </>
            )}
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-green-700 hover:to-teal-700 transition-colors disabled:opacity-50"
          >
            <Globe2 className="w-5 h-5" />
            <span>Create World</span>
          </button>
        </div>
      </form>
    </div>
  );
}