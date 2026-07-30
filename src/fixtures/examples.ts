// src/fixtures/examples.ts

export interface ExampleSpec {
  id: string;
  label: string;
  description: string;
  domain?: string;
}

export const EXAMPLES: ExampleSpec[] = [
  {
    id: 'support-triage',
    label: 'Support email triage agent',
    description:
      'I want an agent that reads customer support emails, classifies them by priority (high, medium, low), and creates tickets in my ticketing system.',
    domain: 'support',
  },
  {
    id: 'florist-backoffice',
    label: 'Florist backoffice agent',
    description:
      'I need an agent that reviews today’s orders, detects pending payments, and generates a daily summary with incidents for my flower shop.',
    domain: 'backoffice',
  },
  {
    id: 'data-pipeline-monitor',
    label: 'Data pipeline monitor',
    description:
      'I want an agent that monitors my daily ETL jobs, detects failures, and posts a concise report with failed steps and suggested remediation.',
    domain: 'data-pipeline',
  },
];
