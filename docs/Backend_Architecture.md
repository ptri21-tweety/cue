# Backend Architecture
 
## Outside the codebase
 
- OpenAI account + API key
- Pinecone account + API key + an index created (dimension must match the embedding model — 1536 for text-embedding-3-small)
- No Postgres/Supabase for MVP — no user data exists yet
- No auth provider for MVP
## Top-level structure
 
```
cue/
  server/       backend code
  client/       frontend code
  offline/      one-time scripts (embedding + upsert), not part of the running app
  docs/         sprint plan, AGENTS.md, and the rest of the docs pile
```
 
## server/controllers/
 
**queryParseController.ts** — one function. Takes the user's raw text input, runs it through OpenAI Structured Outputs (Zod schema), returns structured fields: `userQuery`, `title`, `artist`, `year`. Does not touch embeddings.
 
**searchController.ts** — two functions:
- embeds the (structured) query text into a vector
- takes that vector, queries Pinecone, returns the matched songs
**recommendationController.ts** — one function. Takes the Pinecone results, builds the GPT call, returns the recommendation with reasoning.
 
**loggingMiddleware.ts** — one function. Captures the query, parsed fields, retrieved songs, and recommendation. Logs it.
 
## server/prompts/
 
**recommendationPrompt.ts** — exports `buildRecommendationPrompt()`, same pattern as Movie Rec's `moviePrompt.ts`.
 
## server/app.ts
 
Wires everything into one middleware chain on a single route:
 
```
parse query → embed query → search Pinecone → generate recommendation → log
```
 
Each function calls `next()` to hand off to the following one. Data passes along via `res.locals`, same chain pattern as both unit challenges.
 
## client/
 
One search input component, one results display component. No tabs, no dashboard, no save actions for MVP.
 
## Other project files
 
- `.env` — real keys, never committed
- `.env.example` — which keys are needed (`OPENAI_API_KEY`, `PINECONE_API_KEY`), no real values
- `package.json` — dependencies + scripts
- `jest.config.ts` + test files — same pattern as the unit challenges
## offline/
 
One-time scripts, run manually from the terminal, not part of the live app:
- embedding script — embeds the full songs dataset
- upsert script — batch-upserts the embedded dataset into Pinecone