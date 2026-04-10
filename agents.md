# Agent Spec Blueprint – Arquitectura y Decisiones de Diseño

Este documento captura las decisiones de diseño fundacionales del proyecto **Agent Spec Blueprint** (nombre provisional), para que se mantengan estables en el tiempo y sean fáciles de entender por cualquier colaborador.

---

## 1. Objetivo del proyecto

- Proveer una herramienta de **código abierto**, **self‑host first**, que transforme una descripción en lenguaje natural de un agente IA en un **blueprint estructurado** (JSON/YAML) con:
  - Problem statement
  - Inputs / outputs
  - Tools
  - Constraints / non‑goals
  - Acceptance criteria
  - Test cases
- El foco es la **especificación** (spec) y la **verificabilidad**, no ejecutar el agente ni orquestar workflows complejos.

---

## 2. Principios de diseño

1. **OSS primero**
   - Código bajo licencia permisiva (MIT o Apache‑2).
   - Sin dependencias obligatorias en servicios cerrados (no Vercel, no DB gestionada obligatoria, etc.).

2. **Self‑host first**
   - Debe poder ejecutarse con:
     - `npm install && npm run build && npm start`, o
     - `docker build` + `docker run`.
   - Instrucciones claras para levantarlo en un VPS, homelab o entorno local.

3. **Proveedor de IA agnóstico**
   - El proyecto no se casa con un único proveedor de LLM.
   - La comunicación con el modelo se hace a través de una interfaz `LLMClient` y variables de entorno (`AI_BASE_URL`, `AI_MODEL`, `AI_API_KEY`, etc.).
   - Debe poder funcionar tanto con:
     - APIs de terceros (OpenAI / otros), como
     - Endpoints locales (ej. Ollama / servidor propio).

4. **Sin vendor lock en infraestructura**
   - El proyecto no depende de features específicas de un PaaS concreto.
   - Cualquier hosting que soporte Node.js o Docker es válido.

5. **Simplicidad y foco**
   - Resolver bien un problema pequeño (generar specs de agentes) antes de añadir features.
   - Mantener la arquitectura comprensible para un solo desarrollador en un fin de semana.

---

## 3. Arquitectura técnica (visión general)

### 3.1 Componentes principales

- **UI Web (Next.js + React + TypeScript)**
  - Página principal para introducir la descripción del agente y ver el blueprint generado.
  - Página de ejemplos para cargar casos predefinidos.

- **API interna (Next.js API Routes)**
  - Endpoint `POST /api/blueprint` que recibe la descripción y devuelve el blueprint.
  - Implementada sin dependencias específicas de Vercel (se ejecuta como app Node estándar).

- **Capa de IA (LLMClient)**
  - Interfaz TypeScript `LLMClient` con métodos genéricos (`generate(...)`).
  - Implementaciones concretas:
    - `OpenAIClient` (u otro proveedor HTTP compatible).
    - Futuras: `OllamaClient`, etc.
  - La UI y la API solo hablan con la interfaz, nunca directamente con el SDK de un proveedor.

- **Spec Agent**
  - Módulo `specAgent` que:
    - Construye el prompt a partir de la descripción.
    - Invoca a `LLMClient`.
    - Parsea el JSON y valida contra los tipos `AgentBlueprint`.

- **CLI (opcional, pero parte del diseño)**
  - Comando `agent-spec` que permite generar blueprints desde terminal y/o levantar la UI local.

### 3.2 Sin base de datos obligatoria

- MVP sin DB: todo se genera on‑the‑fly y se muestra/exporta al usuario.
- Persistencia (ej. guardar blueprints, favoritos) es opcional y deberá hacerse con:
  - Preferencia por soluciones embebidas/OSS (ej. SQLite) o Postgres auto‑hosteado.
  - Ningún servicio gestionado será obligatorio para correr el proyecto.

---

## 4. Stack y herramientas

- **Lenguaje:** TypeScript (fullstack).
- **Framework web:** Next.js (App Router), ejecutado como app Node.js estándar (`next start`).
- **UI:** React + TailwindCSS (o similar) para estilos básicos.
- **CLI:** Node.js (binario definido en `package.json`), distribuible vía npm.
- **Contenedores:** Docker (imagen única que contiene UI + API).
- **Orquestación opcional:** `docker-compose` para escenarios con LLM self‑hosted (ej. servicio Ollama + servicio Agent Spec Blueprint).

---

## 5. Despliegue y operación

### 5.1 Escenarios soportados

1. **Local Dev**
   - `npm install`
   - `cp .env.example .env`
   - `npm run dev` → UI disponible en `http://localhost:3000`.

2. **Producción sin Docker**
   - `npm install`
   - `npm run build`
   - `npm start`
   - Se recomienda usar un reverse proxy (Nginx, Caddy, Traefik) para HTTPS.

3. **Producción con Docker**
   - `docker build -t agent-spec-blueprinter .`
   - `docker run --env-file .env -p 3000:3000 agent-spec-blueprinter`

4. **Producción con docker-compose (full OSS)**
   - `docker-compose up -d`
   - Un servicio para la app y otro para el LLM self‑hosted (ej. Ollama).

### 5.2 Configuración por variables de entorno

Archivo `.env.example` (no exhaustivo):

- `AI_PROVIDER` – proveedor actual (`openai`, `ollama`, etc.).
- `AI_BASE_URL` – URL base del endpoint LLM.
- `AI_API_KEY` – clave para el proveedor (si aplica).
- `AI_MODEL` – nombre del modelo por defecto.
- (Otras variables que se vayan necesitando se añadirán aquí.)

Regla: **cualquier dependencia externa debe ser configurable vía env**, nunca hardcodeada.

---

## 6. Hoja de ruta conceptual (alto nivel)

1. **MVP**
   - UI mínima + endpoint `/api/blueprint` + integración con un proveedor de IA.
   - CLI con comando `agent-spec generate`.
   - Sin DB, sin auth, sin features extra.

2. **Self‑host refinado**
   - Dockerfile estable.
   - `docker-compose` con ejemplo de integración con un LLM self‑hosted.
   - Documentación completa de despliegue local y en VPS.

3. **Ecosistema y extensiones**
   - Soporte para múltiples proveedores de LLM.
   - Opcional: persistencia local (SQLite) para historial de blueprints.
   - Opcional: export directo a formatos de frameworks de agentes (LangGraph, CrewAI, etc.).

---

## 7. Regla de oro

> Cualquier nueva funcionalidad debe respetar estos principios: OSS primero, self‑host first, proveedor agnóstico y sin vendor lock duro.

Si una decisión futura entra en conflicto con este documento, debe discutirse explícitamente y, de ser necesario, actualizar aquí la decisión y su justificación.
