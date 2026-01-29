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

  // Basic format validation for Anthropic API keys
  // Keys should start with 'sk-ant-' and be at least 20 characters
  if (!apiKey.startsWith('sk-ant-') || apiKey.length < 20) {
    res.status(401).json({
      error: {
        code: 'INVALID_API_KEY',
        message: 'Invalid Anthropic API key format',
      },
    });
    return;
  }

  // If format is valid, store the key in the request for later use
  // Actual validation will happen when the key is first used
  req.apiKey = apiKey;
  next();
}

// Extend Express Request type to include apiKey
declare global {
  namespace Express {
    interface Request {
      apiKey?: string;
    }
  }
}
