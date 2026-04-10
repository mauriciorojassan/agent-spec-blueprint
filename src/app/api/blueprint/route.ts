import { NextRequest, NextResponse } from 'next/server';
import type { GenerateBlueprintRequest, GenerateBlueprintResponse } from '@/types/api';
import { generateBlueprintFromDescription } from '@/lib/specAgent';
import { logger } from '@/lib/logger';
import { recordRequest, recordSuccess, recordFailure } from '@/lib/metrics';

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const requestId = crypto.randomUUID();
  const providerEnv = (process.env.AI_PROVIDER ?? 'openai').toLowerCase();
  const provider =
    providerEnv === 'openai' || providerEnv === 'ollama' ? providerEnv : 'unknown';

  recordRequest(provider as 'openai' | 'ollama' | 'unknown');

  let body: GenerateBlueprintRequest;

  try {
    body = (await req.json()) as GenerateBlueprintRequest;
  } catch {
    logger.warn('Invalid JSON body on /api/blueprint', {
      requestId,
      method: req.method,
    });
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.description || typeof body.description !== 'string') {
    logger.warn('Missing description on /api/blueprint', {
      requestId,
      method: req.method,
    });
    return NextResponse.json({ error: 'description is required' }, { status: 400 });
  }

  logger.info('Start /api/blueprint', {
    requestId,
    method: req.method,
    domain: body.domain ?? null,
    descriptionLength: body.description.length,
  });

  try {
    const { blueprint, raw } = await generateBlueprintFromDescription(
      body.description,
      body.domain,
    );

    const durationMs = Date.now() - startedAt;
    recordSuccess();

    logger.info('Success /api/blueprint', {
      requestId,
      durationMs,
      provider,
      blueprintName: blueprint.name,
      inputsCount: blueprint.inputs.length,
      toolsCount: blueprint.tools.length,
      testCasesCount: blueprint.test_cases.length,
    });

    const response: GenerateBlueprintResponse = {
      blueprint,
      rawModelOutput: raw,
      runSummary: {
        provider,
        durationMs,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    const durationMs = Date.now() - startedAt;
    recordFailure();

    logger.error('Error in /api/blueprint', {
      requestId,
      durationMs,
      provider,
      error: (err as Error).message,
    });

    return NextResponse.json(
      { error: 'Failed to generate blueprint' },
      { status: 500 },
    );
  }
}