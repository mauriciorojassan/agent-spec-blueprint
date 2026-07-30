# ADR 001 — Schema-First Agent SDK Specification

## Status

Accepted

## Context

Agent SDK projects tend to accumulate capabilities, RPC methods, and lifecycle hooks without a consistent contract. Consumers need a stable, machine-readable spec to generate clients, docs, and bindings. The goal was to encode the contract as data, validate it before release, and version it automatically.

## Decision

Define a schema-first specification format using Zod. Every spec is validated against the schema in CI; only valid specs are packaged and released. The schema is the single source of truth for capabilities, methods, state, and lifecycle hooks.

## Consequences

### Positive

- Consumers can trust that released specs parse and validate.
- Schema validation catches breaking changes before they reach a release.
- Automated releases remove manual packaging and version-tagging steps.

### Negative

- Adding a new concept requires updating the shared schema first.
- Strict validation can reject experimental changes that a human reviewer might accept.

## Alternatives Considered

- **Free-form markdown specs**: flexible for authors, but impossible to validate programmatically or generate clients from.
- **JSON Schema without TypeScript wrappers**: widely supported, but loses type safety and ergonomic DX inside a TypeScript codebase.
