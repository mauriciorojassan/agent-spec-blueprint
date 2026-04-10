// scripts/generate-blueprint.ts

import { generateBlueprintFromDescription } from '@/lib/specAgent';

async function main() {
  const [, , ...args] = process.argv;

  const description = args.join(' ').trim();
  if (!description) {
    console.error('Usage: npm run agent:generate -- "Agent description..."');
    process.exit(1);
  }

  try {
    const { blueprint } = await generateBlueprintFromDescription(description);
    // Print clean JSON to stdout
    process.stdout.write(JSON.stringify(blueprint, null, 2) + '\n');
  } catch (err) {
    console.error('Error generating blueprint:', (err as Error).message);
    process.exit(1);
  }
}

main();
