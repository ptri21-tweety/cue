# Todo

Everything needed for the MVP, all in one place, so the whole shape of the work is visible at a glance.

**Linear is the source of truth for who's doing what and current status.** This file isn't tracked task-by-task in real time — it's here so anyone (especially if you think better seeing the whole mountain than a per-person slice of it) can look at one list and see everything that has to happen.

## Group / Day Zero

- [ ] Repo scaffolding (folders, package.json, .env.example, configs)
- [ ] Dataset sourcing + cleaning
- [ ] Decide language filtering approach
- [ ] Decide genre/row-count filtering if dataset is large
- [ ] Decide Option A vs Option B for parsed fields feeding search

## Backend — retrieval side

- [ ] Embedding script (offline)
- [ ] Upsert script (offline)
- [ ] searchController — embed function
- [ ] searchController — Pinecone query function

## Backend — generation side

- [ ] queryParseController (Structured Outputs)
- [ ] recommendationController
- [ ] Recommendation prompt
- [ ] loggingMiddleware

## Integration

- [ ] Wire query parsing + search + recommendation into one chain in app.ts
- [ ] First end-to-end pass: query in, recommendation out

## Frontend

- [ ] Search input
- [ ] Results display
- [ ] Basic styling

## Testing + evaluation

- [ ] Golden dataset (5-8 entries)
- [ ] Evaluation script
- [ ] Retrieval/prompt tuning based on eval results

## Docs

- [x] Sprint plan
- [x] Research_Notes.md
- [x] Backend_Architecture.md
- [x] API_contract.md
- [x] AGENTS.md
- [x] CONTRIBUTING.md
- [ ] README.md
- [ ] Linear issues created

## Stretch (only if MVP is solid)

- [ ] User accounts + Saved Songs
- [ ] Real auth
- [ ] Saved Playlists
- [ ] Add to Playlist from results
- [ ] Delete/Move across saved locations
- [ ] Weather integration
- [ ] Calendar integration
- [ ] Regenerate/feedback