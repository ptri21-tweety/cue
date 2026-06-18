# Task Breakdown

## Group session (everyone, time-boxed)

- Dataset sourcing + cleaning
- Decide language filtering approach (English-only vs multilingual)
- Decide genre/row-count filtering if dataset is large (e.g. Genius's 3M+ rows)
- Decide Option A vs Option B for how parsed fields (artist/year) feed into search — see API_contract.md
- Time-box this so it doesn't eat into pair work time

## Pair A

- Embedding script (offline)
- searchController — embed function
- searchController — Pinecone query function
- Upsert script (offline)

## Pair B

- queryParseController (Structured Outputs)
- recommendationController + prompt
- loggingMiddleware

## Unassigned — goes to whichever pair finishes first

- Frontend: search input + results display

## Week 2 — reassessed, not fixed

- Golden dataset + eval script
- Retrieval/prompt tuning based on eval results
- Reassign freely once real progress is visible

## Guidelines this split was checked against

- Low-medium merge conflicts — no file overlap between pairs in week 1
- Everyone touches something new — Pair A: embedding script, Pair B: Structured Outputs
- Everyone touches AI — both pairs own real AI-pipeline work, not one AI / one plumbing
- Fair workload — each pair has one substantial piece + lighter pieces around it