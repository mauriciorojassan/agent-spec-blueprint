// src/lib/metrics.ts

type Provider = 'openai' | 'ollama' | 'unknown';

interface MetricsSnapshot {
  totalRequests: number;
  totalSuccess: number;
  totalFailures: number;
  byProvider: Record<Provider, number>;
}

const metrics: MetricsSnapshot = {
  totalRequests: 0,
  totalSuccess: 0,
  totalFailures: 0,
  byProvider: {
    openai: 0,
    ollama: 0,
    unknown: 0,
  },
};

export function recordRequest(provider: Provider) {
  metrics.totalRequests += 1;
  metrics.byProvider[provider] = (metrics.byProvider[provider] ?? 0) + 1;
}

export function recordSuccess() {
  metrics.totalSuccess += 1;
}

export function recordFailure() {
  metrics.totalFailures += 1;
}

export function getMetrics(): MetricsSnapshot {
  return { ...metrics };
}
