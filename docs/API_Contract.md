# API Contract
 
Defines the shape of data passed between frontend and backend, and between each step of the backend pipeline.
 
## Open decision — affects the search step below
 
How parsed fields (artist, year, etc.) feed into search is **not decided yet**. Two options:
 
- **Option A — fold into text.** Parsed fields are kept for logging/display but don't change search behavior. The full query text gets embedded as-is.
- **Option B — metadata filter.** Parsed fields are used to filter Pinecone results (e.g. only consider songs where `artist` matches) before/while ranking by similarity.
Option B only works for fields that actually exist as metadata in whichever dataset gets chosen — it can't filter on a field that isn't stored. This contract documents **Option A** as the current default since it's simpler and doesn't require dataset-specific filter logic. If the team decides on Option B later, only the search step's internal request to Pinecone changes — the frontend-facing contract below stays the same either way.
 
Structured Outputs has real value independent of this decision — it's used for logging/debugging visibility and as the foundation Option B would build on later, even if Option A ships for MVP.
 
## Frontend → Backend
 
**POST `/api/search`**
 
Request:
```json
{
  "query": "something calming for a rainy day"
}
```
 
Response:
```json
{
  "recommendation": "string — GPT's written recommendation with reasoning",
  "songs": [
    {
      "title": "string",
      "artist": "string",
      "year": "string | null",
      "score": "number — Pinecone similarity score"
    }
  ]
}
```
 
If the request fails:
```json
{
  "error": "string — human-readable message"
}
```
 
## Internal pipeline shapes (backend only, not exposed to frontend)
 
**Step 1 — queryParseController**
 
Input: raw query string
 
Output:
```json
{
  "userQuery": "string — original full query",
  "title": "string | null",
  "artist": "string | null",
  "year": "string | null"
}
```
 
**Step 2 — searchController (embed)**
 
Input: the parsed object above (Option A: uses `userQuery` text; Option B would also use `artist`/`year` here)
 
Output: a vector (number array)
 
**Step 2 — searchController (Pinecone query)**
 
Input: the vector from above
 
Output:
```json
[
  {
    "id": "string",
    "score": "number",
    "metadata": {
      "title": "string",
      "artist": "string",
      "lyrics": "string",
      "year": "string | null"
    }
  }
]
```
 
**Step 3 — recommendationController**
 
Input: the Pinecone results above
 
Output:
```json
{
  "recommendation": "string"
}
```
This, combined with a trimmed version of the Pinecone results, becomes the final response sent back to the frontend.
 
**Logging (not part of the response, written to a log file)**
 
```json
{
  "timestamp": "string",
  "userQuery": "string",
  "parsedFields": { "title": null, "artist": null, "year": null },
  "retrievedSongs": ["..."],
  "recommendation": "string"
}
```