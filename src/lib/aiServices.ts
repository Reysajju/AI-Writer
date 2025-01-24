export const AI_SERVICES = {
  GEMINI: {
    id: 'gemini',
    name: 'Google Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    headerName: 'x-goog-api-key'
  },
  OPENAI: {
    id: 'openai',
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    headerName: 'Authorization',
    modelParam: 'gpt-4'
  },
  ANTHROPIC: {
    id: 'anthropic',
    name: 'Anthropic Claude',
    endpoint: 'https://api.anthropic.com/v1/messages',
    headerName: 'x-api-key',
    modelParam: 'claude-3-opus-20240229'
  },
  DEEPSEEK: {
    id: 'deepseek',
    name: 'DeepSeek',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    headerName: 'Authorization',
    modelParam: 'deepseek-chat'
  }
} as const;

export type AIServiceId = keyof typeof AI_SERVICES;