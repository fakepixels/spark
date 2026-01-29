// Backend-specific types

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Session {
  id: string;
  messages: Message[];
  apiKey: string;
  state: SessionState;
  createdAt: number;
  lastActivity: number;
}

export type SessionState =
  | 'content_discovery'
  | 'style_selection'
  | 'generating'
  | 'complete'
  | 'iterating';

export interface ContentAnswers {
  purpose?: 'pitch' | 'teaching' | 'conference' | 'internal';
  length?: 'short' | 'medium' | 'long';
  contentReadiness?: 'ready' | 'notes' | 'topic';
}

export interface StylePreview {
  id: string;
  name: string;
  description: string;
  html: string;
}

export interface StreamEvent {
  type: 'text' | 'question' | 'style_previews' | 'html_update' | 'progress' | 'error' | 'done';
  data?: any;
}

export interface GenerationProgress {
  stage: string;
  currentSlide?: number;
  totalSlides?: number;
  message: string;
}
