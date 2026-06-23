/*
  - Read processed_songs.json into an array of songs ojects
  - Send array of stringified song objects to Open AI
  - Open AI returns an array of embeddings
  - Create a new array of Pinecone records following the (id, values, metadata) required shape
  - As a safe guard, batch records into groups of 200
  - Uploads to Pinecone in batches.

*/

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promises as fs } from 'node:fs';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import type { PineconeRecord } from '@pinecone-database/pinecone';
import 'dotenv/config';

import type { SongMetadata } from './types.ts';

// ES module equivalent of __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create API clients.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

// The index should look for the 'songs' index in pincone (create that before running script)
// Tell TypeScript that metadata stored in this index has the shape SongMetadata.
const index = pinecone.index<SongMetadata>('songs');

// Reads and parses a JSON file.
const loadVariableFromJSON = async <T>(filename: string): Promise<T> => {
  const filePath = path.resolve(__dirname, filename);
  const data = await fs.readFile(filePath, 'utf-8');

  console.log(`Loaded data from ${filePath}`);

  return JSON.parse(data) as T;
};

// Split records into batches because we shouldn't upload thousands at once.
const createPineconeBatches = (
  records: PineconeRecord<SongMetadata>[],
  batchSize = 200,
): PineconeRecord<SongMetadata>[][] => {
  const batches: PineconeRecord<SongMetadata>[][] = [];

  for (let i = 0; i < records.length; i += batchSize) {
    batches.push(records.slice(i, i + batchSize));
  }

  return batches;
};

// Upload each batch to Pinecone.
const upsertBatchesToPinecone = async (
  batches: PineconeRecord<SongMetadata>[][],
): Promise<void> => {
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];

    console.log(
      `Upserting batch ${i + 1} of ${batches.length}: IDs ${
        batch[0].id
      } through ${batch[batch.length - 1].id}`,
    );

    await index.upsert({
      records: batch,
    });

    console.log(`Batch ${i + 1} uploaded successfully.`);
  }
};

const main = async (): Promise<void> => {
  // Load songs from disk.
  const songs = await loadVariableFromJSON<SongMetadata[]>(
    'processed_songs.json',
  );

  if (songs.length === 0) {
    throw new Error('No songs found.');
  }

  // Convert each song object into a string.
  const songInputs = songs.map(song =>
    `
Title: ${song.title}
Artist: ${song.artist}
Genre: ${song.genre}
Year: ${song.year}

Lyrics: ${song.lyrics}
`.trim(),
  );

  console.log(`Creating embeddings for ${songs.length} songs...`);

  // Create one embedding for each song.
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: songInputs,
    encoding_format: 'float',
  });

  // Combine songs and embeddings into Pinecone records.
  const pineconeRecords: PineconeRecord<SongMetadata>[] = songs.map(
    (song, i) => ({
      id: song.id,
      values: response.data[i].embedding,
      metadata: song,
    }),
  );

  // Split records into batches and upload them.
  const batches = createPineconeBatches(pineconeRecords);

  await upsertBatchesToPinecone(batches);

  console.log('Finished uploading songs to Pinecone.');
};

main().catch(error => {
  console.error('Error running offline upload script:', error);
  process.exit(1);
});
