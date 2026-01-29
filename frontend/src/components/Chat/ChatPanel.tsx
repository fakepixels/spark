import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { usePresentationStore } from '../../stores/presentationStore';
import { useAuthStore } from '../../stores/authStore';
import { apiClient } from '../../lib/api';
import { useSSE } from '../../hooks/useSSE';
import { extractHTML, containsHTML } from '../../lib/htmlExtractor';
import { MessageBubble } from './MessageBubble';
import { InputArea } from './InputArea';
import { StylePreviewGrid } from '../StylePicker/StylePreviewGrid';
import type { StreamEvent } from '../../types';

export function ChatPanel() {
  const { messages, addMessage, appendToLastMessage, isStreaming, setStreaming } = useChatStore();
  const { sessionId, setSessionId } = usePresentationStore();
  const { apiKey } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const accumulatedContentRef = useRef<string>('');

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Create session on mount
  useEffect(() => {
    if (apiKey && !sessionId) {
      createSession();
    }
  }, [apiKey, sessionId]);

  const createSession = async () => {
    try {
      const newSessionId = await apiClient.createSession(apiKey!);
      setSessionId(newSessionId);
      console.log('✓ Session created:', newSessionId);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const { stylePreviews, setStylePreviews, setSessionState, setHTML } = usePresentationStore();

  const handleMessage = (event: StreamEvent) => {
    if (event.type === 'text') {
      if (isStreaming) {
        // Accumulate content in ref for immediate access
        accumulatedContentRef.current += event.content;

        // Append the new chunk to the last message
        appendToLastMessage(event.content);

        // Check if the accumulated content contains HTML
        const accumulated = accumulatedContentRef.current;
        console.log('Checking for HTML... length:', accumulated.length, 'contains:', containsHTML(accumulated));

        if (containsHTML(accumulated)) {
          const html = extractHTML(accumulated);
          console.log('Extract result:', html ? `SUCCESS (${html.length} chars)` : 'FAILED');
          if (html) {
            console.log('✓ HTML extracted, setting in preview');
            setHTML(html);
            setSessionState('complete');
          }
        }
      }
    } else if (event.type === 'style_previews') {
      // Received style previews
      setStylePreviews(event.data);
      setSessionState('style_selection');
    } else if (event.type === 'html_update') {
      // Direct HTML update from backend
      setHTML(event.data);
      setSessionState('complete');
    } else if (event.type === 'done') {
      // Final check when streaming is complete
      const accumulated = accumulatedContentRef.current;
      console.log('=== STREAM DONE ===');
      console.log('Total accumulated length:', accumulated.length);
      console.log('First 200 chars:', accumulated.substring(0, 200));
      console.log('Contains HTML?', containsHTML(accumulated));

      if (accumulated && containsHTML(accumulated)) {
        const html = extractHTML(accumulated);
        console.log('Final extract result:', html ? `SUCCESS (${html.length} chars)` : 'FAILED');
        if (html) {
          console.log('✓ Setting HTML in preview panel');
          setHTML(html);
          setSessionState('complete');
        } else {
          console.error('❌ containsHTML returned true but extractHTML returned null');
        }
      } else {
        console.log('❌ No HTML detected in accumulated content');
      }

      // Reset accumulated content
      accumulatedContentRef.current = '';
      setStreaming(false);
      setPendingMessage(null);
    } else if (event.type === 'error') {
      console.error('Stream error:', event.data);
      accumulatedContentRef.current = '';
      setStreaming(false);
      setPendingMessage(null);
    }
  };

  const handleStyleSelect = (styleId: string) => {
    // Send style selection as a message
    const selectedStyle = stylePreviews.find((p) => p.id === styleId);
    if (selectedStyle) {
      handleSend(`I'd like to use the "${selectedStyle.name}" style.`);
    }
  };

  const { startStream } = useSSE(
    pendingMessage && sessionId
      ? apiClient.getMessageStreamUrl(sessionId)
      : null,
    { message: pendingMessage },
    {
      onMessage: handleMessage,
      onComplete: () => {
        setStreaming(false);
        setPendingMessage(null);
      },
      onError: (error) => {
        console.error('SSE error:', error);
        setStreaming(false);
        setPendingMessage(null);
      },
    }
  );

  // Trigger stream when pendingMessage is set
  useEffect(() => {
    if (pendingMessage && sessionId) {
      startStream();
    }
  }, [pendingMessage, sessionId]);

  const handleSend = (message: string) => {
    if (!sessionId || isStreaming) return;

    // Reset accumulated content for new message
    accumulatedContentRef.current = '';

    // Add user message
    addMessage({
      role: 'user',
      content: message,
      timestamp: Date.now(),
    });

    // Add empty assistant message that will be filled by streaming
    addMessage({
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    });

    setStreaming(true);
    setPendingMessage(message);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Chat with Spark
        </h2>
        <p className="text-sm text-gray-500">
          {sessionId ? 'Connected' : 'Connecting...'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to Spark
              </h3>
              <p className="text-gray-600 max-w-md">
                Let's create an amazing presentation together! Tell me about
                what you'd like to build.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}

            {/* Show style previews if available */}
            {stylePreviews.length > 0 && (
              <StylePreviewGrid
                previews={stylePreviews}
                onSelect={handleStyleSelect}
              />
            )}

            <div ref={messagesEndRef} />
          </>
        )}

        {isStreaming && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <InputArea onSend={handleSend} disabled={isStreaming || !sessionId} />
    </div>
  );
}
