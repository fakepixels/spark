// Daytona Service for secure sandbox execution
// For MVP, this uses a simple mock implementation
// TODO: Replace with actual Daytona SDK when ready for production

export class DaytonaService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.DAYTONA_API_KEY || '';
    this.apiUrl = process.env.DAYTONA_API_URL || '';

    if (!this.apiKey) {
      console.warn('⚠️  Daytona API key not configured - using mock execution');
    }
  }

  /**
   * Execute JavaScript code safely
   * MVP Implementation: Direct execution (for development only)
   * Production: Should use Daytona sandbox
   */
  async executeCode(code: string): Promise<any> {
    console.log('📦 Executing code in sandbox...');

    try {
      // For MVP: Use Function constructor for isolation
      // This is NOT secure for production - use Daytona in production
      const sandbox = {
        console: {
          log: (...args: any[]) => console.log('[Sandbox]', ...args),
        },
      };

      const func = new Function(
        ...Object.keys(sandbox),
        `
        "use strict";
        ${code}
      `
      );

      const result = func(...Object.values(sandbox));
      console.log('✓ Code executed successfully');

      return result;
    } catch (error: any) {
      console.error('❌ Sandbox execution failed:', error);
      throw new Error(`Sandbox execution failed: ${error.message}`);
    }
  }

  /**
   * Generate HTML previews by executing generation code
   */
  async generatePreviews(generationCode: string): Promise<string[]> {
    try {
      const result = await this.executeCode(generationCode);

      if (!Array.isArray(result)) {
        throw new Error('Generation code must return an array of HTML strings');
      }

      return result;
    } catch (error: any) {
      console.error('Failed to generate previews:', error);
      throw error;
    }
  }

  /**
   * Generate full presentation HTML
   */
  async generatePresentation(generationCode: string): Promise<string> {
    try {
      const result = await this.executeCode(generationCode);

      if (typeof result !== 'string') {
        throw new Error('Generation code must return an HTML string');
      }

      return result;
    } catch (error: any) {
      console.error('Failed to generate presentation:', error);
      throw error;
    }
  }

  /**
   * Check if Daytona is properly configured
   */
  isConfigured(): boolean {
    return !!this.apiKey && !!this.apiUrl;
  }
}

export const daytonaService = new DaytonaService();
