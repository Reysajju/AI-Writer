import React, { useState } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function CharacterCreator() {
  const [name, setName] = useState('');
  const [personality, setPersonality] = useState('');
  const [backstory, setBackstory] = useState('');
  const [motivation, setMotivation] = useState('');
  const [physicalDescription, setPhysicalDescription] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async () => {
    if (!physicalDescription) {
      setError('Please provide a physical description first');
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
              text: `Create a detailed character portrait based on this description: ${physicalDescription}. 
                     The character's name is ${name}. Make it realistic and detailed.`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        setError('Image generation is not available. Here is a description of how your character would look:\n\n' + 
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
      if (!user) throw new Error('Please sign in to create characters');

      const { error: insertError } = await supabase
        .from('characters')
        .insert({
          user_id: user.id,
          name,
          personality,
          backstory,
          motivation,
          physical_description: physicalDescription,
          generated_image: generatedImage
        });

      if (insertError) throw insertError;

      // Reset form
      setName('');
      setPersonality('');
      setBackstory('');
      setMotivation('');
      setPhysicalDescription('');
      setGeneratedImage('');

      alert('Character created successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Character Creator</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4" data-netlify="true" name="character-creator">
        <input type="hidden" name="form-name" value="character-creator" />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Character Name
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter character name..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Personality Traits
          </label>
          <textarea
            name="personality"
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe personality traits..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Backstory
          </label>
          <textarea
            name="backstory"
            value={backstory}
            onChange={(e) => setBackstory(e.target.value)}
            className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write character backstory..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Motivation
          </label>
          <textarea
            name="motivation"
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe character motivation..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Physical Description
          </label>
          <textarea
            name="physical-description"
            value={physicalDescription}
            onChange={(e) => setPhysicalDescription(e.target.value)}
            className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe physical appearance..."
            required
          />
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
            disabled={isLoading || !physicalDescription}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-purple-700 hover:to-indigo-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Generate Portrait</span>
              </>
            )}
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-green-700 hover:to-teal-700 transition-colors disabled:opacity-50"
          >
            <UserPlus className="w-5 h-5" />
            <span>Create Character</span>
          </button>
        </div>
      </form>
    </div>
  );
}