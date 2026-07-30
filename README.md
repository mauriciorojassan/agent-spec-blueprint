# Agent Spec Blueprint

[![CI](https://github.com/mauriciorojassan/agent-spec-blueprint/actions/workflows/ci.yml/badge.svg)](https://github.com/mauriciorojassan/agent-spec-blueprint/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Open in Codespaces](https://img.shields.io/badge/Open%20in-Codespaces-black?logo=github)](https://github.com/codespaces/new?repo=mauriciorojassan/agent-spec-blueprint&ref=main)

> Reusable specification blueprint for building agent SDK projects, with strict validation and CI-driven release automation.

## Quick Start

### Prerequisites

- Node.js 20+
- npm or pnpm

### Install and run

```bash
git clone https://github.com/mauriciorojassan/agent-spec-blueprint.git
cd agent-spec-blueprint
npm install
npm run validate
npm test
```

## Architecture

The blueprint defines a small, typed schema for agent capabilities, RPC methods, state shapes, and lifecycle hooks. A validation step checks every spec against the schema before it can be released. CI packages the validated spec as a versioned artifact and creates a GitHub release automatically on merges to `main`.

See [`docs/adr/001-initial-architecture.md`](docs/adr/001-initial-architecture.md) for the primary architectural decision and trade-offs.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Schema validation | Zod |
| Language | TypeScript |
| CI/CD | GitHub Actions |
| Package manager | npm |

## License

MIT
