// src/lib/llm/provider.ts
import { OpenAIClient } from './openaiClient';
import { OllamaClient } from './ollamaClient';

export interface LLMGenerateOptions {
  temperature?: number;
  maxTokens?: number;
}

export interface LLMClient {
  generate(prompt: string, options?: LLMGenerateOptions): Promise<string>;
}

export function getLLMClient(): LLMClient {
  const provider = process.env.AI_PROVIDER ?? 'openai';

  if (provider === 'openai') {
    return new OpenAIClient();
  }

  if (provider === 'ollama') {
    return new OllamaClient();
  }

  throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
}