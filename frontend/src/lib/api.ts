import axios, { type AxiosInstance } from 'axios';
import type { SessionResponse, ErrorResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  setApiKey(apiKey: string) {
    this.client.defaults.headers.common['X-API-Key'] = apiKey;
  }

  clearApiKey() {
    delete this.client.defaults.headers.common['X-API-Key'];
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      await this.client.post('/api/validate-key', {}, {
        headers: { 'X-API-Key': apiKey }
      });
      return true;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }

  async createSession(apiKey: string): Promise<string> {
    const response = await this.client.post<SessionResponse>('/api/sessions', {}, {
      headers: { 'X-API-Key': apiKey }
    });
    return response.data.sessionId;
  }

  // SSE endpoint for streaming - handled separately in useSSE hook
  getMessageStreamUrl(sessionId: string): string {
    return `${API_URL}/api/sessions/${sessionId}/message`;
  }

  async exportPresentation(sessionId: string): Promise<Blob> {
    const response = await this.client.get(`/api/sessions/${sessionId}/export`, {
      responseType: 'blob',
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
