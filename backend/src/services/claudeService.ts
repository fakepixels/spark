import Anthropic from '@anthropic-ai/sdk';
import type { Message } from '../types/index.js';

export class ClaudeService {
  async *streamConversation(
    apiKey: string,
    messages: Message[],
    systemPrompt: string
  ): AsyncGenerator<string, void, unknown> {
    const client = new Anthropic({ apiKey });

    // Convert our message format to Anthropic format
    const anthropicMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const stream = await client.messages.stream({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 4096,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        yield chunk.delta.text;
      }
    }

    // Wait for the stream to complete
    await stream.finalMessage();
  }

  async sendMessage(
    apiKey: string,
    messages: Message[],
    systemPrompt: string
  ): Promise<string> {
    const client = new Anthropic({ apiKey });

    const anthropicMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const response = await client.messages.create({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 4096,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    // Extract text from the first content block
    const textContent = response.content.find((block) => block.type === 'text');
    return textContent && 'text' in textContent ? textContent.text : '';
  }
}

export const claudeService = new ClaudeService();
