import { Router, Request, Response } from 'express';
import { validateApiKey } from '../middleware/validateApiKey.js';
import { sessionService } from '../services/sessionService.js';

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

// Send message (SSE streaming) - will be implemented in Phase 2
router.post('/sessions/:sessionId/message', (req: Request, res: Response) => {
  res.status(501).json({
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Message streaming will be implemented in Phase 2',
    },
  });
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
