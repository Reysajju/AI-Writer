export interface Story {
  id: string;
  title: string;
  content: string;
  genre: string;
  length: 'short' | 'medium' | 'long';
  tone: string;
  targetAudience: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Character {
  id: string;
  name: string;
  personality: string[];
  backstory: string;
  motivation: string;
  physicalDescription: string;
  relationships: Relationship[];
}

export interface Relationship {
  characterId: string;
  type: string;
  description: string;
}

export interface World {
  id: string;
  name: string;
  description: string;
  geography: string;
  culture: string;
  history: string;
  magicSystem?: string;
  technologyLevel: string;
}

export interface AIService {
  id: string;
  name: string;
  endpoint: string;
  headerName: string;
}

export interface UserAPIKey {
  id: string;
  userId: string;
  serviceId: string;
  apiKey: string;
  isActive: boolean;
  createdAt: Date;
}

export interface GenerationCount {
  count: number;
  lastUpdated: Date;
}