// Frontend-specific types

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export type SessionState =
  | 'content_discovery'
  | 'style_selection'
  | 'generating'
  | 'complete'
  | 'iterating';

export interface StylePreview {
  id: string;
  name: string;
  description: string;
  html: string;
}

export interface Question {
  id: string;
  question: string;
  options: QuestionOption[];
}

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
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

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export interface SessionResponse {
  sessionId: string;
}
