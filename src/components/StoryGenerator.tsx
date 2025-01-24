import React, { useEffect, useState } from 'react';
import { Wand2, Loader2, Key } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { APIKeyModal } from './APIKeyModal';
import { AI_SERVICES, type AIServiceId } from '../lib/aiServices';
import type { GenerationCount } from '../types';

// Define categories at the top level of the file
const CONTENT_CATEGORIES = {
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
} as const;

const WORD_COUNTS = {
  short: '1000 words',
  medium: '2500 words',
  long: '5000 words'
} as const;

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

  useEffect(() => {
    generateNewCaptcha();
    checkAvailableServices();
    loadGenerationCount();
  }, []);

  const generateNewCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operation = Math.random() < 0.5 ? '+' : '-';
    setCaptchaNum1(num1);
    setCaptchaNum2(num2);
    setCaptchaOperation(operation);
    setCaptchaAnswer('');
    setIsCaptchaValid(false);
  };

  const validateCaptcha = (value: string) => {
    const expectedResult = captchaOperation === '+' 
      ? captchaNum1 + captchaNum2 
      : captchaNum1 - captchaNum2;
    const isValid = parseInt(value) === expectedResult;
    setIsCaptchaValid(isValid);
    return isValid;
  };

  const checkAvailableServices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: apiKeys } = await supabase
        .from('user_api_keys')
        .select('service_id')
        .eq('user_id', user.id)
        .eq('is_active', true);

      const services = apiKeys?.map(key => key.service_id as AIServiceId) || [];
      setAvailableServices(services);
    } catch (err) {
      console.error('Error checking available services:', err);
    }
  };

  const loadGenerationCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      
      // First try to insert a new record for today if it doesn't exist
      const { error: upsertError } = await supabase
        .from('generation_counts')
        .upsert({
          user_id: user.id,
          date: today,
          count: 0,
        }, {
          onConflict: 'user_id,date'
        });

      if (upsertError) throw upsertError;

      // Then fetch the current count
      const { data: counts, error: fetchError } = await supabase
        .from('generation_counts')
        .select('count, last_updated')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (fetchError) throw fetchError;

      if (counts) {
        setGenerationCount({
          count: counts.count,
          lastUpdated: new Date(counts.last_updated)
        });
      }
    } catch (err) {
      console.error('Error loading generation count:', err);
      // Set default values if there's an error
      setGenerationCount({
        count: 0,
        lastUpdated: new Date()
      });
    }
  };

  const updateGenerationCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase
        .from('generation_counts')
        .upsert({
          user_id: user.id,
          date: today,
          count: generationCount.count + 1,
        }, {
          onConflict: 'user_id,date'
        });

      if (error) throw error;
      await loadGenerationCount();
    } catch (err) {
      console.error('Error updating generation count:', err);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please provide a prompt');
      return;
    }

    if (!isCaptchaValid) {
      setError('Please solve the captcha correctly');
      return;
    }

    if (generationCount.count >= 5 && availableServices.length === 0) {
      setError('You have reached your daily free generation limit. Please add an API key to continue.');
      return;
    }

    setIsLoading(true);
    setError('');
    let apiKey = '';
    let service = AI_SERVICES.GEMINI;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to generate content');

      // Use free Gemini API for first 5 generations
      if (generationCount.count < 5) {
        apiKey = 'AIzaSyBVWiD5DJxtHDLVgeJ_e7wCXK9AVf-L-Bs';
      } else {
        // Get user's API key for selected service
        const { data: apiKeyData } = await supabase
          .from('user_api_keys')
          .select('api_key')
          .eq('user_id', user.id)
          .eq('service_id', selectedService)
          .eq('is_active', true)
          .single();

        if (!apiKeyData) throw new Error('No valid API key found');
        apiKey = apiKeyData.api_key;
        service = AI_SERVICES[selectedService];
      }

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

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (service.headerName === 'Authorization') {
        headers[service.headerName] = `Bearer ${apiKey}`;
      } else {
        headers[service.headerName] = apiKey;
      }

      const requestBody = selectedService === 'GEMINI' 
        ? {
            contents: [{
              parts: [{ text: promptTemplate }]
            }]
          }
        : selectedService === 'ANTHROPIC'
        ? {
            messages: [{
              role: 'user',
              content: promptTemplate
            }],
            model: service.modelParam
          }
        : {
            model: service.modelParam,
            messages: [{
              role: 'user',
              content: promptTemplate
            }]
          };

      const response = await fetch(service.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to generate content');
      }

      const data = await response.json();
      let content = '';

      // Handle different API response formats
      if (selectedService === 'GEMINI') {
        content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      } else if (selectedService === 'ANTHROPIC') {
        content = data.content?.[0]?.text;
      } else {
        content = data.choices?.[0]?.message?.content;
      }

      if (!content) {
        throw new Error('No content generated');
      }

      setGeneratedArticle(content);
      setDisplayedArticle('');

      // Simulate typing effect
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < content.length) {
          setDisplayedArticle(prev => prev + content[i]);
          i++;
        } else {
          clearInterval(typeInterval);
        }
      }, 10);

      await updateGenerationCount();
      generateNewCaptcha();
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
        {availableServices.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AI Service
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value as AIServiceId)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(AI_SERVICES)
                .filter(([id]) => availableServices.includes(id as AIServiceId))
                .map(([id, service]) => (
                  <option key={id} value={id}>
                    {service.name}
                  </option>
                ))}
            </select>
          </div>
        )}

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
              {Object.entries(CONTENT_CATEGORIES).map(([category, types]) => (
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
              {Object.entries(WORD_COUNTS).map(([key, value]) => (
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

        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verify you're human: What's {captchaNum1} {captchaOperation} {captchaNum2}?
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={captchaAnswer}
              onChange={(e) => {
                setCaptchaAnswer(e.target.value);
                validateCaptcha(e.target.value);
              }}
              className="w-24 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Answer"
            />
            <button
              onClick={generateNewCaptcha}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              New Captcha
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt || !isCaptchaValid}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Generate Content</span>
            </>
          )}
        </button>

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