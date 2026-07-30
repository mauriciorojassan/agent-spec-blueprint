// src/app/api/metrics/route.ts
import { NextResponse } from 'next/server';
import { getMetrics } from '@/lib/metrics';

export const dynamic = 'force-dynamic';

export async function GET() {
  const snapshot = getMetrics();

  return NextResponse.json(
    {
      ...snapshot,
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}
