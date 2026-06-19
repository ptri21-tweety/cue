# Cue

## What it is

Cue is a mood-aware music recommendation web app. A user describes what they want in natural language, and Cue returns a song recommendation with a short explanation of why that song fits the moment.

Instead of forcing users to start with a genre, playlist category, or preset mood, Cue lets them describe the actual context they care about:

- "something warm and nostalgic for a rainy Sunday"
- "an anxious late-night drive"
- "a 70s Bowie song"
- "music that feels like leaving a party early"
- "something upbeat for cleaning the apartment"

The core experience is intentionally simple: one text input, a few recomendations, and a reason the recommendations makes sense.

## How it works

Cue combines structured query parsing, semantic search, and GPT-generated reasoning.

At a high level:

```text
User writes a music request
  -> Cue parses the request into structured fields
  -> Cue embeds the query for semantic search
  -> Pinecone returns similar songs from the dataset
  -> GPT chooses a recommendation from the retrieved songs
  -> Cue returns the recommendation and explanation
```

The query parsing step uses OpenAI Structured Outputs to extract specific details that might otherwise get blurred inside a vibe-based search. For example:

```json
{
  "userQuery": "something rainy from the 70s by Bowie",
  "title": null,
  "artist": "Bowie",
  "year": "1970s"
}
```

That structured output gives the backend a clearer view of what the user asked for. The app can use those fields for logging, debugging, search constraints, or metadata-aware retrieval depending on the dataset.

## Why this exists

Picking music for a specific moment is often more emotional than categorical. A person usually knows the scene, feeling, or activity they want music for before they know the exact song.

Traditional music apps are powerful, but they often make users translate their intent into app-shaped categories: genre, artist radio, playlist title, chart, or algorithmic mood bucket. Cue explores a more direct interaction model:

> Describe the moment in your own words. Get a song that fits.

The MVP is built around proving that one loop before adding account features, playlists, or library organization.

## MVP

The MVP includes:

- A songs dataset with lyrics and useful metadata
- An offline embedding script for preparing the dataset
- A Pinecone index containing embedded song records
- A single search endpoint
- Structured parsing of the user's raw query into:
  - `userQuery`
  - `title`
  - `artist`
  - `year`
- Semantic search over the embedded song dataset
- GPT-generated recommendation and reasoning based on retrieved songs
- Structured logging of the query, parsed fields, retrieved songs, and recommendation
- A small golden dataset for retrieval evaluation
- A minimal frontend with one search input and one results display

The MVP does not include:

- User accounts
- Authentication
- Saved songs
- Saved playlists
- Weather or calendar integrations
- Multi-page dashboards
- Recommendation history

## Architecture highlights

Cue is organized as a small retrieval-augmented generation pipeline.

Backend request flow:

```text
POST /api/search
  -> queryParseController
  -> searchController.embedQuery
  -> searchController.searchSongs
  -> recommendationController
  -> loggingMiddleware
  -> response
```

Important backend ideas:

- Controllers are Express middleware functions.
- Pipeline data is passed through `res.locals`.
- Prompt-building logic lives outside controller code.
- Embedding and upsert scripts live outside the running app.
- Pinecone stores song vectors and metadata.
- GPT only recommends from the retrieved song context, keeping the explanation tied to the search results.

The backend is split into focused steps so each part can be tested and improved independently:

- Query parsing answers: "What did the user explicitly mention?"
- Embedding answers: "How do we represent this request numerically?"
- Vector search answers: "Which songs are semantically close?"
- Recommendation generation answers: "Which retrieved song should we present, and why?"
- Logging answers: "What happened during this request?"

## Tech stack

- Frontend: React, TypeScript
- Backend: Node.js, Express, TypeScript
- AI models:
  - OpenAI Embeddings API using `text-embedding-3-small`
  - OpenAI Responses API for recommendation generation
  - OpenAI Structured Outputs for query parsing
- Vector database: Pinecone
- Testing: Jest
- Evaluation: custom golden-dataset retrieval script



## Project structure

```text
cue/
  client/       React frontend
  server/       Express backend
  offline/      one-time dataset, embedding, and Pinecone upsert scripts
  docs/         architecture, contracts, workflow, and planning docs
```

Backend structure:

```text
server/
  app.ts
  controllers/
    queryParseController.ts
    searchController.ts
    recommendationController.ts
    loggingMiddleware.ts
  prompts/
    recommendationPrompt.ts
```

Documentation:

```text
docs/
  AGENTS.md
  API_Contract.md
  Backend_Architecture.md
  CONTRIBUTING.md
  Research_links.md
  Task_Breakdown.md
  ToDo.md
```

## Environment variables

The MVP requires API keys for OpenAI and Pinecone.

Example `server/.env`:

```bash
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
```

Real `.env` files should never be committed.

## Local development

Common commands:

```bash
npm install
npm start
npm test
```

Offline scripts for embedding and Pinecone upsert should be run manually from `offline/`. They prepare the dataset and vector index, but they are not part of the live request/response app.

## Evaluation

Music recommendation quality is subjective, so Cue uses a small golden dataset rather than expecting one exact answer for every query.

The evaluation set should include prompts that test different user intents:

- Mood-based requests
- Scene-based requests
- Activity-based requests
- Artist-specific requests
- Title-specific requests
- Year or decade-specific requests

The evaluation script should check whether retrieved songs are directionally appropriate and whether the final recommendation is grounded in the retrieved context.

## Roadmap

After the MVP recommendation loop is working well, possible stretch goals include:

- User accounts
- Saved songs
- Auth
- Saved playlists
- Add-to-playlist from search results
- Delete and move songs across saved locations
- Weather integration
- Calendar integration
- Regenerate and feedback controls

## Contributing

Project workflow, branch naming, pull request expectations, and task ownership are documented in:

- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
- [docs/Task_Breakdown.md](docs/Task_Breakdown.md)
- [docs/ToDo.md](docs/ToDo.md)


