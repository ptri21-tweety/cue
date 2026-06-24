import type { ScoredPineconeRecord } from "@pinecone-database/pinecone";
import type { SongMetadata } from "../../offline/types";

type ParsedQuery = { 
  userQuery: string; 
  title: string | null;
  artist: string | null;
  year: string | null;
}; 

const role = `You are a knowledgeable music recommendation assistant with a deep understanding of songs, lyrics, genre, mood, and listening context.`;

const task = `Given the user's music request and the retrieved songs below, recommend the most relevant songs from the provided context.`;

const requirements = `
- Only recommend songs from the retrieved song list provided - do not invent or suggest songs outside the list
- Recommend 1-5 songs, depending on how many retrieved songs are relevant to the user's request
- Be sure each song matches the user's request
- Do not explain why each song was chosen
- Do not include summaries, lyrics, or commentary
- If no songs are a perfect match, recommend the closest song or songs from the retrieved list
- Do not add any extra text, labels, or commentary outside the output format defined
`;

const outputFormat = `
Return your response in EXACTLY this format for each recommendation, with each field on its own line:

**Title:** [song title]
**Artist:** [artist]
**Year:** [year]
**Genre:** [genre]

---

Separate each song recommendation with ---. No extra text outside this format.
`;


export const buildRecommendationPrompt = (
    parsedQuery: ParsedQuery,
    pineconeResults: ScoredPineconeRecord<SongMetadata>[]
): string => `
${role}
${task}
${requirements}
${outputFormat}

User request: 
${parsedQuery.userQuery}

Parsed fields:
${JSON.stringify(parsedQuery, null, 2)}

Retrieved songs: 
${JSON.stringify(pineconeResults, null, 2)}
`;