# AGENTS.md

This file is read by AI coding assistants (Codex, Claude Code, and others) working in this repo. It explains how the project works and how we want AI tools to help us learn while building it.

## Project context

Cue is a music mood matcher. A user describes what they want in plain language and gets a song recommendation with reasoning, generated via semantic search over a songs dataset (Pinecone) plus GPT. See `docs/Backend_Architecture.md` and `docs/API_contract.md` for the real structure and data shapes — don't assume a generic pattern, this repo has a specific one.

## Commands

- Install: `npm install`
- Start: `npm start` (fill in once scaffolding is done)
- Test: `npm test`
- Offline scripts (embedding, upsert): run manually from `offline/`, not part of the live app

## Conventions

- TypeScript throughout, both `server/` and `client/`
- Controllers are Express middleware: `(req, res, next)`, data passed via `res.locals`, matching the pattern used in our Star Wars and Movie Rec unit challenges
- One controller file per pipeline step; see `docs/Backend_Architecture.md` for the exact file list and what each one does
- Prompts live in `server/prompts/`, separate from controller logic
- `.env` holds real keys, never commit it — `.env.example` lists which keys are needed
- PR review: cross-pair review required for anything touching AI/backend logic (controllers, prompts, offline scripts), not required for small frontend-only changes — see `docs/PR_reviewing.md`

## How to help us learn while building this

This project is a learning exercise, not just a deliverable. We're intentionally building this ourselves rather than having AI generate it wholesale. When acting as a coding assistant in this repo:

- Explain concepts in plain terms before using technical vocabulary for them — name the idea simply first, then attach the correct term, not the other way around
- Use a concrete analogy when introducing something new, especially for AI/RAG concepts (embeddings, vector search, Structured Outputs)
- Ask a clarifying question before assuming what we mean, especially when a request is ambiguous — don't guess and proceed
- Don't assume familiarity with a concept just because it's been mentioned before in the conversation — check understanding rather than assuming it stuck
- Re-read the relevant files in this repo before answering, not just the file currently open — context here matters more than in a typical project, since the codebase is small and tightly connected
- Before giving a final answer, check it against the actual files in the repo rather than a generic pattern for "how this is usually done"
- When relevant, point to real documentation (OpenAI docs, Pinecone docs, etc.) rather than only explaining from memory — see `docs/Research_Notes.md` for the links we've already collected
- Prefer asking "what should this do?" over silently picking an implementation when the answer isn't obvious from context
- If a chunk of code or a decision seems to contradict something documented in `docs/`, flag the mismatch rather than silently going with one or the other

## What this project is not

- Not a place to generate whole features unprompted — work in small, explained steps
- Not assuming the person you're helping already knows the jargon — assume bottom-up, concept-first understanding is the goal, not just working code