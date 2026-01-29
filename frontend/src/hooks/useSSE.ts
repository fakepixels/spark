import { useEffect, useRef, useCallback } from 'react';
import type { StreamEvent } from '../types';

interface UseSSEOptions {
  onMessage: (event: StreamEvent) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
  apiKey?: string;
}

export function useSSE(url: string | null, body: any, options: UseSSEOptions) {
  const { onMessage, onError, onComplete, apiKey } = options;
  const abortControllerRef = useRef<AbortController | null>(null);

  const startStream = useCallback(async () => {
    if (!url) {
      console.warn('❌ startStream called with no URL');
      return;
    }

    console.log('🚀 Starting stream to:', url);
    console.log('📦 Body:', body);

    // Cancel any existing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (apiKey) {
        headers['X-API-Key'] = apiKey;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: abortController.signal,
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is null');
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              console.log('✓ Stream completed ([DONE])');
              onComplete?.();
              continue;
            }

            try {
              const event = JSON.parse(data) as StreamEvent;
              console.log('📨 Received event:', event.type, event.content?.substring(0, 50));
              onMessage(event);

              if (event.type === 'done') {
                console.log('✓ Stream completed (done event)');
                onComplete?.();
              }
            } catch (e) {
              console.error('Failed to parse SSE data:', e, 'Data:', data);
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('SSE error:', error);
        onError?.(error);
      }
    } finally {
      abortControllerRef.current = null;
    }
  }, [url, body, onMessage, onError, onComplete, apiKey]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return { startStream };
}
