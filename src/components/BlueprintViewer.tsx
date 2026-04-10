// src/components/BlueprintViewer.tsx
'use client';

import { useState } from 'react';
import type { AgentBlueprint } from '@/types/blueprint';
import type { RunSummary } from '@/types/api';

interface Props {
  blueprint: AgentBlueprint;
  raw?: string | null;
  summary?: RunSummary | null;
}

type TabId = 'sections' | 'json' | 'raw';

export function BlueprintViewer({ blueprint, raw, summary }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('sections');

  function handleCopyJson() {
    const text = JSON.stringify(blueprint, null, 2);
    navigator.clipboard
      .writeText(text)
      .catch(() => {
        // ignore errors for now
      });
  }

  function handleCopyRaw() {
    if (!raw) return;
    navigator.clipboard
      .writeText(raw)
      .catch(() => {
        // ignore errors for now
      });
  }

  return (
    <section className="space-y-4 mt-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Generated blueprint</h2>
        {summary && (
          <div className="text-xs text-slate-300 flex flex-col items-end">
            <span>
              Provider: <span className="font-mono">{summary.provider}</span>
            </span>
            <span>
              Duration: <span className="font-mono">{summary.durationMs} ms</span>
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-md border border-slate-800 bg-slate-900 p-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`px-3 py-1 rounded ${
            activeTab === 'sections'
              ? 'bg-slate-800 text-slate-50'
              : 'text-slate-300 hover:bg-slate-800/60'
          }`}
        >
          Sections
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('json')}
          className={`px-3 py-1 rounded ${
            activeTab === 'json'
              ? 'bg-slate-800 text-slate-50'
              : 'text-slate-300 hover:bg-slate-800/60'
          }`}
        >
          JSON
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('raw')}
          className={`px-3 py-1 rounded ${
            activeTab === 'raw'
              ? 'bg-slate-800 text-slate-50'
              : 'text-slate-300 hover:bg-slate-800/60'
          }`}
        >
          Raw model output
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'sections' && (
        <div className="space-y-4 text-xs">
          <Section title="Meta">
            <KeyValue label="Name" value={blueprint.name} />
            <KeyValue label="Version" value={blueprint.version} />
            <KeyValue label="Problem statement" value={blueprint.problem_statement} />
          </Section>

          <Section title="Assumptions">
            <ul className="list-disc list-inside space-y-1">
              {blueprint.assumptions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </Section>

          <Section title="Inputs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800">
                  <Th>Name</Th>
                  <Th>Type</Th>
                  <Th>Source</Th>
                  <Th>Description</Th>
                </tr>
              </thead>
              <tbody>
                {blueprint.inputs.map((input, i) => (
                  <tr key={i} className="border-b border-slate-900">
                    <Td>{input.name}</Td>
                    <Td>{input.type}</Td>
                    <Td>{input.source}</Td>
                    <Td>{input.description}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="Outputs">
            <ul className="space-y-1">
              {blueprint.outputs.map((out, i) => (
                <li key={i}>
                  <span className="font-mono">{out.name}</span>{' '}
                  <span className="text-slate-400">({out.type})</span>
                  {out.description && <> - {out.description}</>}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Tools">
            <ul className="space-y-2">
              {blueprint.tools.map((tool, i) => (
                <li key={i} className="border border-slate-800 rounded p-2">
                  <div className="font-mono text-sky-300">{tool.name}</div>
                  <div className="text-slate-300">{tool.description}</div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Constraints">
            <ul className="list-disc list-inside space-y-1">
              {blueprint.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </Section>

          <Section title="Non-goals">
            <ul className="list-disc list-inside space-y-1">
              {blueprint.non_goals.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </Section>

          <Section title="Acceptance criteria">
            <ul className="list-disc list-inside space-y-1">
              {blueprint.acceptance_criteria.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </Section>

          <Section title="Test cases">
            <ol className="list-decimal list-inside space-y-2">
              {blueprint.test_cases.map((t, i) => (
                <li key={i}>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-slate-300 text-[11px]">
                    <span className="font-mono">input:</span>{' '}
                    <code>{JSON.stringify(t.input)}</code>
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    <span className="font-mono">expected:</span> {t.expected_behavior}
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        </div>
      )}

      {activeTab === 'json' && (
        <div className="space-y-2">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCopyJson}
              className="text-[11px] px-2 py-1 rounded border border-slate-700 hover:bg-slate-800"
            >
              Copy JSON
            </button>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-900 p-4 text-xs overflow-auto max-h-[400px]">
            <pre>{JSON.stringify(blueprint, null, 2)}</pre>
          </div>
        </div>
      )}

      {activeTab === 'raw' && raw && (
        <div className="space-y-2">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCopyRaw}
              className="text-[11px] px-2 py-1 rounded border border-slate-700 hover:bg-slate-800"
            >
              Copy raw
            </button>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-900 p-4 text-xs overflow-auto max-h-[400px]">
            <pre className="whitespace-pre-wrap break-words">{raw}</pre>
          </div>
        </div>
      )}
    </section>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-2 py-1 text-[11px] font-semibold text-slate-300">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-2 py-1 text-[11px] text-slate-200 align-top">
      {children}
    </td>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col text-xs">
      <span className="text-slate-400">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}
