// src/app/page.tsx
'use client';

import { useState } from 'react';
import type { AgentBlueprint } from '@/types/blueprint';
import type { RunSummary } from '@/types/api';
import { BlueprintViewer } from '@/components/BlueprintViewer';
import Link from 'next/link';

interface GenerateState {
  loading: boolean;
  error: string | null;
  blueprint: AgentBlueprint | null;
  raw: string | null;
  summary: RunSummary | null;
}

export default function HomePage() {
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState<string>('');
  const [state, setState] = useState<GenerateState>({
    loading: false,
    error: null,
    blueprint: null,
    raw: null,
    summary: null,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const res = await fetch('/api/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          domain: domain || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate blueprint');
      }

      const data = await res.json();
      setState({
        loading: false,
        error: null,
        blueprint: data.blueprint,
        raw: data.rawModelOutput ?? null,
        summary: data.runSummary ?? null,
      });
    } catch (err) {
      setState({
        loading: false,
        error: (err as Error).message,
        blueprint: null,
        raw: null,
        summary: null,
      });
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl space-y-6">
        <header className="space-y-2 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Agent Spec Blueprint</h1>
            <p className="text-sm text-slate-300">
              Describe the AI agent you want to build and generate a JSON blueprint
              with inputs, outputs, tools, constraints, and test cases.
            </p>
          </div>
          <Link href="/examples" className="text-sm text-sky-400 hover:underline">
            View examples
          </Link>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Agent Description
            </label>
            <textarea
              className="w-full min-h-[160px] rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g. I want an agent that reads support emails, categorizes them by priority, and creates tickets in my system..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Domain (optional)
            </label>
            <input
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g. support, backoffice, data-pipeline..."
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={state.loading || !description.trim()}
            className="inline-flex items-center rounded-md bg-sky-600 hover:bg-sky-500 disabled:opacity-50 px-4 py-2 text-sm font-medium"
          >
            {state.loading ? 'Generating...' : 'Generate blueprint'}
          </button>

          {state.error && (
            <p className="text-sm text-red-400 mt-2">{state.error}</p>
          )}
        </form>

        {state.blueprint && (
          <BlueprintViewer 
            blueprint={state.blueprint} 
            raw={state.raw} 
            summary={state.summary} 
          />
        )}
      </div>
    </main>
  );
}
