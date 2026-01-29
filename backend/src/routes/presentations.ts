import { Router, Request, Response } from 'express';
import { validateApiKey } from '../middleware/validateApiKey.js';
import { sessionService } from '../services/sessionService.js';
import { claudeService } from '../services/claudeService.js';
import { getSystemPrompt } from '../prompts/systemPrompt.js';
import type { Message } from '../types/index.js';

const router = Router();

// Validate API key endpoint
router.post('/validate-key', validateApiKey, (req: Request, res: Response) => {
  res.json({ valid: true });
});

// Create new session
router.post('/sessions', validateApiKey, (req: Request, res: Response) => {
  const sessionId = sessionService.createSession(req.apiKey!);
  res.json({ sessionId });
});

// Get session info
router.get('/sessions/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = sessionService.getSession(sessionId);

  if (!session) {
    res.status(404).json({
      error: {
        code: 'SESSION_NOT_FOUND',
        message: 'Session not found or expired',
      },
    });
    return;
  }

  res.json({
    sessionId: session.id,
    state: session.state,
    messageCount: session.messages.length,
  });
});

// Send message (SSE streaming)
router.post('/sessions/:sessionId/message', async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { message } = req.body;

  const session = sessionService.getSession(sessionId);

  if (!session) {
    res.status(404).json({
      error: {
        code: 'SESSION_NOT_FOUND',
        message: 'Session not found or expired',
      },
    });
    return;
  }

  if (!message || typeof message !== 'string') {
    res.status(400).json({
      error: {
        code: 'INVALID_MESSAGE',
        message: 'Message is required and must be a string',
      },
    });
    return;
  }

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    // Add user message to session
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };
    session.messages.push(userMessage);

    // Get system prompt based on current state
    const systemPrompt = getSystemPrompt(session.state);

    // Stream Claude's response
    let fullResponse = '';

    for await (const chunk of claudeService.streamConversation(
      session.apiKey,
      session.messages,
      systemPrompt
    )) {
      fullResponse += chunk;

      // Send chunk as SSE event
      res.write(`data: ${JSON.stringify({ type: 'text', content: chunk })}\n\n`);
    }

    // Add assistant message to session
    const assistantMessage: Message = {
      role: 'assistant',
      content: fullResponse,
      timestamp: Date.now(),
    };
    session.messages.push(assistantMessage);

    // Update session
    sessionService.updateSession(sessionId, { messages: session.messages });

    // Send done event
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Error streaming message:', error);
    res.write(
      `data: ${JSON.stringify({
        type: 'error',
        data: { message: error.message || 'An error occurred' },
      })}\n\n`
    );
    res.end();
  }
});

// Export presentation - will be implemented in Phase 6
router.get('/sessions/:sessionId/export', (req: Request, res: Response) => {
  res.status(501).json({
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Export will be implemented in Phase 6',
    },
  });
});

// Admin: Get session stats (for debugging)
router.get('/admin/stats', (req: Request, res: Response) => {
  res.json(sessionService.getStats());
});

export default router;
