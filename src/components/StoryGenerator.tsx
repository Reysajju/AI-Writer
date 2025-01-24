import React, { useState, useEffect } from 'react';
import { Wand2, Loader2, Key } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { APIKeyModal } from './APIKeyModal';
import { AI_SERVICES, type AIServiceId } from '../lib/aiServices';
import type { GenerationCount } from '../types';

export function StoryGenerator() {
  const [prompt, setPrompt] = useState('');
  const [topic, setTopic] = useState('blog-post');
  const [length, setLength] = useState('medium');
  const [tone, setTone] = useState('professional');
  const [audience, setAudience] = useState('general');
  const [generatedArticle, setGeneratedArticle] = useState('');
  const [displayedArticle, setDisplayedArticle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAPIModal, setShowAPIModal] = useState(false);
  const [selectedService, setSelectedService] = useState<AIServiceId>('GEMINI');
  const [availableServices, setAvailableServices] = useState<AIServiceId[]>([]);
  const [generationCount, setGenerationCount] = useState<GenerationCount>({ count: 0, lastUpdated: new Date() });

  // Simple Captcha State
  const [captchaNum1, setCaptchaNum1] = useState(0);
  const [captchaNum2, setCaptchaNum2] = useState(0);
  const [captchaOperation, setCaptchaOperation] = useState<'+' | '-'>('+');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  // ... (keep all the existing functions like checkAvailableServices, loadGenerationCount, etc.)

  const categories = {
    'Content Creation': [
      'Blog Post', 'Article', 'Newsletter', 'Product Description', 'Website Copy',
      'Landing Page', 'Email Campaign', 'Press Release', 'Social Media Post'
    ],
    'Video Content': [
      'YouTube Script', 'Short Reel Script', 'TikTok Script', 'Video Tutorial Script',
      'Product Demo Script', 'Documentary Script', 'Podcast Script', 'Interview Script',
      'Explainer Video Script', 'Course Content Script'
    ],
    'Marketing': [
      'Marketing Copy', 'Sales Page', 'Ad Copy', 'Brand Story',
      'Case Study', 'Customer Success Story', 'Value Proposition',
      'Feature Announcement', 'Campaign Brief', 'Marketing Strategy'
    ],
    'Academic': [
      'Research Paper', 'Literature Review', 'Case Study', 'Thesis',
      'Academic Essay', 'Scientific Report', 'Conference Paper',
      'Book Review', 'Methodology', 'Analysis'
    ],
    'Creative': [
      'Short Story', 'Poetry', 'Creative Essay', 'Personal Narrative',
      'Flash Fiction', 'Memoir', 'Travel Writing', 'Food Writing',
      'Nature Writing', 'Literary Journalism'
    ],
    'Business': [
      'Business Plan', 'Executive Summary', 'Project Proposal',
      'Business Report', 'Market Analysis', 'White Paper',
      'Technical Documentation', 'Industry Analysis', 'Financial Report',
      'Corporate Strategy'
    ]
  };

  const wordCounts = {
    short: '1000 words',
    medium: '2500 words',
    long: '5000 words'
  };

  const handleGenerate = async () => {
    // ... (keep existing validation logic)

    try {
      // ... (keep existing auth and API key logic)

      const promptTemplate = `Create a ${length} ${tone} ${topic} for a ${audience} audience with the following prompt: ${prompt}.

Instructions:
1. Format all headings with asterisks (*) at the start and end
2. Use proper structure with introduction, body, and conclusion
3. For word count:
   - Short: Aim for 1000 words
   - Medium: Aim for 2500 words
   - Long: Aim for 5000 words
4. Include appropriate subheadings and sections
5. For video scripts, include timestamps and scene descriptions
6. For social content, include hashtag suggestions and call-to-actions
7. Maintain consistent tone and style throughout`;

      const response = await fetch(service.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(
          selectedService === 'GEMINI' ? {
            contents: [{
              parts: [{ text: promptTemplate }]
            }]
          } : {
            model: service.modelParam,
            messages: [{
              role: 'user',
              content: promptTemplate
            }]
          }
        )
      });

      // ... (keep rest of the function the same)
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Content Generator</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Generations today: {generationCount.count}/5
            {generationCount.count >= 5 && availableServices.length === 0 && ' (Limit reached)'}
          </span>
          <button
            onClick={() => setShowAPIModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Key className="w-4 h-4" />
            <span>Manage APIs</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Keep existing API service selection */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe what you want to create..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content Type
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(categories).map(([category, types]) => (
                <optgroup label={category} key={category}>
                  {types.map(type => (
                    <option value={type.toLowerCase()} key={type}>
                      {type}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Length
            </label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(wordCounts).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="academic">Academic</option>
              <option value="conversational">Conversational</option>
              <option value="formal">Formal</option>
              <option value="technical">Technical</option>
              <option value="creative">Creative</option>
              <option value="journalistic">Journalistic</option>
              <option value="entertaining">Entertaining</option>
              <option value="humorous">Humorous</option>
              <option value="inspirational">Inspirational</option>
              <option value="educational">Educational</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Audience
            </label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="general">General</option>
              <option value="professional">Professional</option>
              <option value="technical">Technical</option>
              <option value="academic">Academic</option>
              <option value="student">Student</option>
              <option value="expert">Expert</option>
              <option value="beginner">Beginner</option>
              <option value="business">Business</option>
              <option value="creative">Creative</option>
              <option value="social-media">Social Media</option>
              <option value="youth">Youth</option>
              <option value="senior">Senior</option>
            </select>
          </div>
        </div>

        {/* Keep existing captcha, error handling, and generation button */}

        {displayedArticle && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Generated Content</h3>
            <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap">
              {displayedArticle}
            </div>
          </div>
        )}
      </div>

      <APIKeyModal
        isOpen={showAPIModal}
        onClose={() => setShowAPIModal(false)}
        onSuccess={() => {
          checkAvailableServices();
          setShowAPIModal(false);
        }}
      />
    </div>
  );
}