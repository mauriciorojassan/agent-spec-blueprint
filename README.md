# Agent Spec Blueprint

[![CI](https://github.com/nocti/agent-spec-blueprint/actions/workflows/ci.yml/badge.svg)](https://github.com/nocti/agent-spec-blueprint/actions/workflows/ci.yml)
Generates **structured blueprints for AI agents** from natural language descriptions.

The goal of this tool is to facilitate the initial design of agent-based architectures. It transforms abstract ideas and requirements into a **formal, verifiable technical specification** (inputs, outputs, tools, constraints, and test cases), maintaining neutrality across specific providers or platforms.

> OSS first. Self-host first. AI Provider agnostic.

---

## ✨ Features

- 🧠 Transforms agent descriptions into a consistent **blueprint JSON**.
- 🧩 Defines inputs, outputs, tools, constraints, non-goals, and acceptance criteria.
- 🧪 Includes **test cases** to validate the expected behavior of the agent.
- 🌐 Minimalist web UI built with Next.js + TypeScript.
- 🛠️ Built-in CLI to generate blueprints directly from the terminal.
- 🐳 Native support for self-hosting via Docker and `docker-compose`.
- 🔌 Agnostic and extensible LLM layer (OpenAI by default, ready for local providers like Ollama).

---

## 🧱 Tech Stack

- **Frontend / Backend**: Next.js (App Router) + TypeScript.
- **Styling**: Tailwind CSS.
- **CLI**: Node.js + TypeScript (executed via `tsx`).
- **Containerization**: Docker (multi-stage build).
- **LLM Provisioning**: Configurable abstraction via environment variables.

---

## UI Preview

![Agent Spec Blueprint UI](./docs/screenshot.png)

---

## 🚀 Quickstart (Local)

### 1. Clone the repository

```bash
git clone https://github.com/your-user/agentx-hackathon.git
cd agentx-hackathon
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example configuration file and set your values:

```bash
cp .env.example .env
```

Minimum required configuration:

```env
AI_PROVIDER=openai
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
```

> **Note:** The architecture allows swapping `AI_PROVIDER` and `AI_BASE_URL` to integrate self-hosted services in future updates (e.g., Ollama).

### 4. Development Environment

Start the local server:

```bash
npm run dev
```

The application will be available at: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Command Line Interface (CLI)

You can automate or generate blueprints without relying on the web UI:

```bash
AI_API_KEY=sk-... \
AI_BASE_URL=https://api.openai.com/v1 \
AI_MODEL=gpt-4o-mini \
npm run agent:generate -- "I want an agent that reads support emails, prioritizes them, and creates Jira tickets."
```

The resulting JSON will be printed to standard output (`stdout`), making it ideal for CI/CD pipeline integrations.

---

## 🐳 Self-hosting via Docker

### Image Build

```bash
docker build -t agent-spec-blueprint .
```

### Run the Container (App Only)

```bash
docker run --env-file .env -p 3000:3000 agent-spec-blueprint
```

### Orchestration with `docker-compose` (App + Local LLM)

The repository includes a `docker-compose.yml` file that provisions the complete environment considering *Offline-First* scenarios:

- **`app`** Service: Core API and UI.
- **`ollama`** Service: Local LLM environment (native provider compatibility will be included in future revisions).

To initialize the entire stack:

```bash
docker-compose up -d
```

---

## 🧠 Output Structure (Schema)

Based on the initial instruction, the system composes a JSON object following the structure defined in `src/types/blueprint.ts` (useful as a foundation for frameworks like LangGraph, CrewAI, Autogen, etc.):

```json
{
  "name": "string",
  "version": "string",
  "problem_statement": "string",
  "assumptions": ["string"],
  "inputs": [
    { "name": "string", "type": "string", "source": "user|api|db|file|other", "description": "string" }
  ],
  "outputs": [
    { "name": "string", "type": "string", "description": "string" }
  ],
  "tools": [
    {
      "name": "string",
      "description": "string",
      "input_schema": {},
      "output_schema": {}
    }
  ],
  "constraints": ["string"],
  "non_goals": ["string"],
  "acceptance_criteria": ["string"],
  "test_cases": [
    {
      "name": "string",
      "input": {},
      "expected_behavior": "string"
    }
  ]
}
```

---

## 🏗️ High-Level Architecture

For more details about design decisions and long-term goals, see [agents.md](./agents.md).

- **`src/app`**: Web routing structure and API (Next.js App Router).
- **`src/types`**: Interfaces and data contracts ensuring strict typing.
- **`src/lib/llm`**: Strategy pattern implementation for LLM clients (OpenAI, among others).
- **`src/lib/specAgent.ts`**: Prompt engineering logic and JSON metric validation.
- **`scripts/generate-blueprint.ts`**: Standalone CLI tool reusing modular `specAgent` logic.

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to get started.

To maintain and extend this project under OSS guidelines:

1. Fork the repository.
2. Create a semantic branch for your contribution (`feat/...`, `fix/...`, `docs/...`).
3. Submit a Pull Request detailing the technical context of your changes.

### Suggested Roadmap:
- Integration of the `OllamaClient` connector or other local endpoints.
- Automated export paths specific to agent frameworks (CrewAI, LangChain).
- Implementation of strict JSON schema validation (e.g., using [Zod](https://zod.dev/)).

---

## 📄 License

Published under the **MIT** License. See the `LICENSE` file for additional legal information and considerations.
