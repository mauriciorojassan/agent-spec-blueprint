// src/types/api.ts

import type { AgentBlueprint } from '@/types/blueprint';

export interface GenerateBlueprintRequest {
  description: string;
  domain?: string;
}

export interface RunSummary {
  provider: string;
  durationMs: number;
}

export interface GenerateBlueprintResponse {
  blueprint: AgentBlueprint;
  rawModelOutput?: string;
  runSummary?: RunSummary;
}
