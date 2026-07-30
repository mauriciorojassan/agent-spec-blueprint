# Contributing

Thanks for considering contributing to Agent Spec Blueprint!

## Local setup

1. Fork and clone the repo.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the env file and configure a model:

   ```bash
   cp .env.example .env
   # set AI_PROVIDER / AI_BASE_URL / AI_API_KEY / AI_MODEL
   ```

4. Run in development:

   ```bash
   npm run dev
   ```

## Tests

Run the fixtures test harness:

```bash
npm run test:fixtures
```

## Guidelines

- Use TypeScript throughout.
- Keep the project self-host-first and provider-agnostic.
- For new features, update `agents.md` with any important design decisions.
- For breaking changes, update the version in `package.json` following SemVer.
