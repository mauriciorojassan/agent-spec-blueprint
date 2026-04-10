// src/types/blueprint.ts
import { z } from 'zod';

export type InputSource = 'user' | 'api' | 'db' | 'file' | 'other';

export interface AgentInput {
  name: string;
  type: string;
  source: InputSource;
  description?: string;
}

export interface AgentOutput {
  name: string;
  type: string;
  description?: string;
}

export interface AgentToolSchema {
  // Usa string | number | boolean | object para mantenerlo simple al inicio
  [key: string]: unknown;
}

export interface AgentTool {
  name: string;
  description: string;
  input_schema: AgentToolSchema;
  output_schema: AgentToolSchema;
}

export interface AgentTestCase {
  name: string;
  input: Record<string, unknown>;
  expected_behavior: string;
}

export interface AgentBlueprint {
  name: string;
  version: string;
  problem_statement: string;
  assumptions: string[];
  inputs: AgentInput[];
  outputs: AgentOutput[];
  tools: AgentTool[];
  constraints: string[];
  non_goals: string[];
  acceptance_criteria: string[];
  test_cases: AgentTestCase[];
}

// ---------- Zod Schemas ----------

export const AgentInputSchema = z.object({
  name: z.string(),
  type: z.string(),
  source: z.enum(['user', 'api', 'db', 'file', 'other']),
  description: z.string().optional(),
});

export const AgentOutputSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string().optional(),
});

export const AgentToolSchemaZ = z.object({
  name: z.string(),
  description: z.string(),
  input_schema: z.record(z.unknown()),
  output_schema: z.record(z.unknown()),
});

export const AgentTestCaseSchema = z.object({
  name: z.string(),
  input: z.record(z.unknown()),
  expected_behavior: z.string(),
});

export const AgentBlueprintSchema = z.object({
  name: z.string(),
  version: z.string(),
  problem_statement: z.string(),
  assumptions: z.array(z.string()),
  inputs: z.array(AgentInputSchema),
  outputs: z.array(AgentOutputSchema),
  tools: z.array(AgentToolSchemaZ),
  constraints: z.array(z.string()),
  non_goals: z.array(z.string()),
  acceptance_criteria: z.array(z.string()),
  test_cases: z.array(AgentTestCaseSchema),
});

export type AgentBlueprintZod = z.infer<typeof AgentBlueprintSchema>;
