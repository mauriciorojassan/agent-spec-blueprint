import type { LLMClient, LLMGenerateOptions } from './provider';
import { logger } from '@/lib/logger';

export class OllamaClient implements LLMClient {
  private readonly baseUrl: string;
  private readonly model: string;

  constructor() {
    this.baseUrl = process.env.AI_BASE_URL ?? 'http://localhost:11434';
    this.model = process.env.AI_MODEL ?? 'llama3.1';

    if (!this.baseUrl) {
      throw new Error('AI_BASE_URL is not set for Ollama');
    }
  }

  async generate(prompt: string, options?: LLMGenerateOptions): Promise<string> {
    const temperature = options?.temperature ?? 0.2;
    const startedAt = Date.now();

    try {
      const res = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: 'You are an AI that returns ONLY JSON.' },
            { role: 'user', content: prompt },
          ],
          stream: false,
          options: {
            temperature,
          },
        }),
      });

      const durationMs = Date.now() - startedAt;

      if (!res.ok) {
        const text = await res.text();
        logger.error('LLM (Ollama) request failed', {
          provider: 'ollama',
          model: this.model,
          status: res.status,
          durationMs,
          bodyPreview: text.slice(0, 500),
        });
        throw new Error(`Ollama request failed: ${res.status} ${text}`);
      }

      const data = (await res.json()) as { message?: { content?: unknown } };
      const content = data?.message?.content;
      const outputLength = typeof content === 'string' ? content.length : 0;

      logger.info('LLM (Ollama) request succeeded', {
        provider: 'ollama',
        model: this.model,
        durationMs,
        promptLength: prompt.length,
        outputLength,
      });

      if (!content || typeof content !== 'string') {
        throw new Error('Ollama response missing message.content');
      }
      return content.trim();
    } catch (err) {
      logger.error('LLM (Ollama) generate() threw', {
        provider: 'ollama',
        model: this.model,
        error: (err as Error).message,
      });
      throw err;
    }
  }
}
