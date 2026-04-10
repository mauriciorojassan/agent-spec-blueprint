// src/lib/llm/provider.ts

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
    const { OpenAIClient } = require('./openaiClient') as typeof import('./openaiClient');
    return new OpenAIClient();
  }

  if (provider === 'ollama') {
    const { OllamaClient } = require('./ollamaClient') as typeof import('./ollamaClient');
    return new OllamaClient();
  }

  throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
}