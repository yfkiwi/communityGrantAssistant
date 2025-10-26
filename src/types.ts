export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

export interface Section {
  id: string;
  title: string;
  content: string;
  status: 'complete' | 'in-progress' | 'incomplete';
  aiGenerated: boolean;
  isCustom: boolean;
  canDelete: boolean;
  sources?: string[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  analyzed: boolean;
}

export interface ProjectInfo {
  name: string;
  fundingProgram: string;
  budget: string;
  description: string;
}

export type ViewType = 'welcome' | 'assistant' | 'review';
