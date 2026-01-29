import { randomBytes } from 'crypto';
import type { Session, SessionState } from '../types/index.js';

class SessionService {
  private sessions: Map<string, Session> = new Map();
  private cleanupInterval: NodeJS.Timeout;
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  constructor() {
    // Run cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  createSession(apiKey: string): string {
    const sessionId = randomBytes(16).toString('hex');
    const session: Session = {
      id: sessionId,
      messages: [],
      apiKey,
      state: 'content_discovery',
      createdAt: Date.now(),
      lastActivity: Date.now(),
    };

    this.sessions.set(sessionId, session);
    console.log(`✓ Created session: ${sessionId}`);
    return sessionId;
  }

  getSession(sessionId: string): Session | null {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = Date.now();
    }
    return session || null;
  }

  updateSession(sessionId: string, updates: Partial<Session>): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      Object.assign(session, updates);
      session.lastActivity = Date.now();
    }
  }

  deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
    console.log(`✓ Deleted session: ${sessionId}`);
  }

  private cleanup(): void {
    const now = Date.now();
    let deletedCount = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity > this.SESSION_TIMEOUT) {
        this.sessions.delete(sessionId);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      console.log(`✓ Cleaned up ${deletedCount} expired sessions`);
    }
  }

  getStats() {
    return {
      activeSessions: this.sessions.size,
      sessions: Array.from(this.sessions.values()).map((s) => ({
        id: s.id,
        state: s.state,
        messageCount: s.messages.length,
        createdAt: s.createdAt,
        lastActivity: s.lastActivity,
      })),
    };
  }

  destroy() {
    clearInterval(this.cleanupInterval);
  }
}

export const sessionService = new SessionService();
