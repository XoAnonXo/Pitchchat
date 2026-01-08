# LLM Prompt and Model Routing Audit

## Scope
- Server-side prompt templates, model routing logic, and model selection exposure.
- Chat flows for authenticated project chat and public investor chat.

## Evidence overview
- Multi-provider routing and system prompt template: `server/aiModels.ts`.
- OpenAI-only prompt templates for embeddings, chat, and summarization: `server/openai.ts`.
- Authenticated project chat endpoint with client-supplied model: `server/routes.ts`.
- Public investor chat endpoint with fixed model: `server/routes/chatRoutes.ts`.
- Client-side model picker values: `client/src/components/ui/ai-model-selector.tsx`.
- Client chat uses model prop when calling chat endpoint: `client/src/components/ChatInterface.tsx`.
- Available model list served by API: `server/routes.ts`.

## Prompt inventory
- Investor-facing system prompt (multi-provider):
  - Role: system, perspective: "knowledgeable team member" representing the startup.
  - Instruction to avoid referencing context and to pivot when outside knowledge.
  - Source: `server/aiModels.ts`.
- OpenAI-only investor prompt (legacy chat handler):
  - Role: system, investor-focused, asks to admit when info is missing.
  - Source: `server/openai.ts`.
- Summarization prompt for document intake:
  - Role: system, summarizes business documents for investor relevance.
  - Source: `server/openai.ts`.

## Model routing map
- `/api/projects/:projectId/chat` accepts `model` from request body and casts to `AIModel` without allowlist validation: `server/routes.ts`.
- `chatWithAI` routes by string prefix (gpt/o3/claude/gemini) and then calls provider SDKs: `server/aiModels.ts`.
- Public investor chat always uses `gpt-4o` regardless of project settings: `server/routes/chatRoutes.ts`.
- Server model catalog contains `gpt-*`, `o3-mini`, `claude-*`, `gemini-*`: `server/routes.ts`.
- Client model selector uses ids that do not match server model catalog: `client/src/components/ui/ai-model-selector.tsx`.

## Findings
### 1) Prompt encourages confident answers and "pivot" behavior when knowledge is missing
- Evidence: system prompt instructs the assistant to "pivot to related strengths" instead of acknowledging missing info: `server/aiModels.ts`.
- Impact: High risk of investor-facing hallucination and misrepresentation, especially when the vector search context is thin or missing.
- Recommendation: Replace pivot guidance with explicit refusal/uncertainty policy, and add a requirement to cite source snippets or state "I don't have that" when context is absent.

### 2) Model identifiers are inconsistent across API, UI, and routing layer
- Evidence: `/api/ai-models` returns `claude-3-sonnet`, `gemini-pro`, etc., while UI uses `claude-3-5-sonnet-20241022`, `gemini-2.0-flash-exp`, `grok-2-1212`: `server/routes.ts`, `client/src/components/ui/ai-model-selector.tsx`.
- Impact: Users can select models the backend does not support, resulting in provider errors or unsupported model exceptions, and inconsistent cost tracking.
- Recommendation: Use the API model list to populate the selector, validate incoming models against an allowlist, and reject unsupported values with a clear 400 response.

### 3) Client-supplied model is accepted without enforcement
- Evidence: `/api/projects/:projectId/chat` takes `model` from the request body and casts to `AIModel` without validation: `server/routes.ts`.
- Impact: Untrusted model strings can reach provider SDK calls, leading to runtime errors or unintended model usage.
- Recommendation: Add a server-side allowlist (shared enum) and validate the request before calling `chatWithAI`.

### 4) Divergent prompts across chat implementations can create inconsistent behavior
- Evidence: `server/aiModels.ts` and `server/openai.ts` use different system prompts and citation behavior, while both are used in different flows (`chatWithAI`, `summarizeDocument`, `generateEmbedding`): `server/aiModels.ts`, `server/openai.ts`.
- Impact: Responses differ between public chat and project chat, and some responses lack citations or explicit limits, reducing auditability and consistency.
- Recommendation: Consolidate prompts in a single template and share citation/uncertainty policies across providers.

## Typecheck status
- `npm run check` failed: `server/openai.ts(108,28): error TS18047: 'openai' is possibly 'null'.`
