import type { LLMClient, LLMGenerateOptions } from './provider';
import { logger } from '@/lib/logger';

export class OpenAIClient implements LLMClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor() {
    this.apiKey = process.env.AI_API_KEY ?? '';
    this.baseUrl = process.env.AI_BASE_URL ?? 'https://api.openai.com/v1';
    this.model = process.env.AI_MODEL ?? 'gpt-4o-mini';

    if (!this.apiKey) {
      throw new Error('AI_API_KEY is not set');
    }
  }

  async generate(prompt: string, options?: LLMGenerateOptions): Promise<string> {
    const temperature = options?.temperature ?? 0.3;
    const startedAt = Date.now();

    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          temperature,
          messages: [
            {
              role: 'system',
              content:
                'You are an AI that generates JSON blueprints for AI agents. Always respond with VALID JSON only.',
            },
            { role: 'user', content: prompt },
          ],
        }),
      });

      const durationMs = Date.now() - startedAt;

      if (!res.ok) {
        const text = await res.text();
        logger.error('LLM (OpenAI) request failed', {
          provider: 'openai',
          model: this.model,
          status: res.status,
          durationMs,
          bodyPreview: text.slice(0, 500),
        });
        throw new Error(`LLM request failed: ${res.status} ${text}`);
      }

      const data = (await res.json()) as any;
      const content = data.choices?.[0]?.message?.content;
      const outputLength = typeof content === 'string' ? content.length : 0;

      logger.info('LLM (OpenAI) request succeeded', {
        provider: 'openai',
        model: this.model,
        durationMs,
        promptLength: prompt.length,
        outputLength,
      });

      if (!content || typeof content !== 'string') {
        throw new Error('LLM response missing content');
      }
      return content.trim();
    } catch (err) {
      logger.error('LLM (OpenAI) generate() threw', {
        provider: 'openai',
        model: this.model,
        error: (err as Error).message,
      });
      throw err;
    }
  }
}