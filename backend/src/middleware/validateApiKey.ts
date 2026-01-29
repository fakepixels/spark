import { Request, Response, NextFunction } from 'express';
import Anthropic from '@anthropic-ai/sdk';

export async function validateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    res.status(401).json({
      error: {
        code: 'MISSING_API_KEY',
        message: 'Anthropic API key is required',
      },
    });
    return;
  }

  try {
    // Test the API key with a minimal request
    const client = new Anthropic({ apiKey });

    await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'test' }],
    });

    // If successful, store the key in the request for later use
    req.apiKey = apiKey;
    next();
  } catch (error: any) {
    console.error('API key validation failed:', error.message);
    res.status(401).json({
      error: {
        code: 'INVALID_API_KEY',
        message: 'Invalid Anthropic API key',
      },
    });
  }
}

// Extend Express Request type to include apiKey
declare global {
  namespace Express {
    interface Request {
      apiKey?: string;
    }
  }
}
