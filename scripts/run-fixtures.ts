// scripts/run-fixtures.ts

import { EXAMPLES } from '@/fixtures/examples';
import { generateBlueprintFromDescription } from '@/lib/specAgent';

async function main() {
  console.log('Running blueprint generation over fixtures...');

  const results = await Promise.all(
    EXAMPLES.map(async (ex) => {
      const startedAt = Date.now();
      try {
        const { blueprint } = await generateBlueprintFromDescription(
          ex.description,
          ex.domain,
        );
        const durationMs = Date.now() - startedAt;

        return {
          id: ex.id,
          ok: true,
          durationMs,
          error: null as string | null,
          inputsCount: blueprint.inputs.length,
          toolsCount: blueprint.tools.length,
          testCasesCount: blueprint.test_cases.length,
        };
      } catch (err) {
        const durationMs = Date.now() - startedAt;
        return {
          id: ex.id,
          ok: false,
          durationMs,
          error: (err as Error).message,
          inputsCount: 0,
          toolsCount: 0,
          testCasesCount: 0,
        };
      }
    }),
  );

  let allOk = true;
  for (const r of results) {
    if (r.ok) {
      console.log(
        `[OK] ${r.id} - ${r.durationMs} ms, inputs=${r.inputsCount}, tools=${r.toolsCount}, tests=${r.testCasesCount}`,
      );
    } else {
      allOk = false;
      console.error(`[FAIL] ${r.id} - ${r.durationMs} ms - ${r.error}`);
    }
  }

  if (!allOk) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('Unexpected error while running fixtures:', (err as Error).message);
  process.exitCode = 1;
});
