// src/app/examples/page.tsx
'use client';

import Link from 'next/link';
import { EXAMPLES } from '@/fixtures/examples';

export default function ExamplesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">Ejemplos de agentes</h1>
          <p className="text-sm text-slate-300">
            Elige un ejemplo para copiar la descripción y pegarla en la página principal.
          </p>
        </header>

        <div className="space-y-4">
          {EXAMPLES.map((ex) => (
            <article
              key={ex.id}
              className="rounded-md border border-slate-800 bg-slate-900 p-4 space-y-2"
            >
              <h2 className="text-sm font-semibold">{ex.label}</h2>
              <p className="text-xs text-slate-300 whitespace-pre-wrap">
                {ex.description}
              </p>
              <p className="text-[11px] text-slate-400">
                Dominio sugerido: <code>{ex.domain}</code>
              </p>
            </article>
          ))}
        </div>

        <p className="text-xs text-slate-400">
          Vuelve a la{' '}
          <Link href="/" className="underline text-sky-400 hover:text-sky-300">
            página principal
          </Link>{' '}
          para generar el blueprint.
        </p>
      </div>
    </main>
  );
}
