// src/lib/specAgent.ts

import { getLLMClient } from '@/lib/llm/provider';
import { AgentBlueprintSchema } from '@/types/blueprint';
import type { AgentBlueprint } from '@/types/blueprint';

export async function generateBlueprintFromDescription(
  description: string,
  domain?: string,
): Promise<{ blueprint: AgentBlueprint; raw: string }> {
  const client = getLLMClient();

  const prompt = buildPrompt(description, domain);
  const raw = await client.generate(prompt, { temperature: 0.2 });

  const blueprint = parseBlueprint(raw);
  return { blueprint, raw };
}

function buildPrompt(description: string, domain?: string): string {
  return [
    'You are an expert AI engineer.',
    'Given the following description of an AI agent, produce a JSON blueprint.',
    '',
    'The JSON MUST have this shape:',
    '{',
    '  "name": "string",',
    '  "version": "string",',
    '  "problem_statement": "string",',
    '  "assumptions": ["string"],',
    '  "inputs": [{ "name": "string", "type": "string", "source": "user|api|db|file|other", "description": "string" }],',
    '  "outputs": [{ "name": "string", "type": "string", "description": "string" }],',
    '  "tools": [{',
    '    "name": "string",',
    '    "description": "string",',
    '    "input_schema": {},',
    '    "output_schema": {}',
    '  }],',
    '  "constraints": ["string"],',
    '  "non_goals": ["string"],',
    '  "acceptance_criteria": ["string"],',
    '  "test_cases": [{',
    '    "name": "string",',
    '    "input": {},',
    '    "expected_behavior": "string"',
    '  }]',
    '}',
    '',
    'Rules:',
    '- Respond with JSON ONLY, no comments, no Markdown.',
    '- Use concise but clear text.',
    '',
    `Domain (optional): ${domain ?? 'general'}`,
    'Description:',
    description,
  ].join('\n');
}

function parseBlueprint(raw: string): AgentBlueprint {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to parse LLM JSON: ${(err as Error).message}`);
  }

  const result = AgentBlueprintSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Blueprint does not match schema: ${result.error.toString()}`);
  }

  return result.data as AgentBlueprint;
}