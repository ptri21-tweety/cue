import type { RequestHandler } from 'express';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import type { SongMetadata, ParsedQuery } from '../types';

// Create API clients.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.index<SongMetadata>('songs');

export const searchController: RequestHandler = async (req, res, next) => {
  try {
    const parsedQuery = res.locals.parsedQuery as ParsedQuery | undefined;
    const rawQuery = req.body.query;

    const userQuery = parsedQuery?.userQuery || rawQuery;

    if (!userQuery) {
      res.status(400).json({ error: 'Missing search query.' });
      return;
    }

    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: userQuery,
      encoding_format: 'float',
    });

    const vector = embeddingResponse.data[0].embedding;

    const filter: Record<string, unknown> = {};

    if (parsedQuery?.title) {
      filter.title = { $eq: parsedQuery.title };
    }

    if (parsedQuery?.artist) {
      filter.artist = { $eq: parsedQuery.artist };
    }

    if (parsedQuery?.year) {
      filter.year = { $eq: parsedQuery.year };
    }

    const queryResponse = await index.query({
      vector,
      topK: 5,
      includeValues: false,
      includeMetadata: true,
      filter: Object.keys(filter).length ? filter : undefined,
    });

    res.locals.retrievedSongs = queryResponse.matches;

    return next();
  } catch (error) {
    return next(error);
  }
};
