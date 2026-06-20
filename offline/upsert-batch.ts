// read processed sample file
// embed songs
// upsert to Pinecone

/*
  PURPOSE 
  reads pre-generated embeddings from a JSON file
  converts them into Pinecone records and uploads them to Pinecone
  this is the OFFLINE phase — run once to build the searchable library
*/

import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import OpenAI from 'openai';
import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import 'dotenv/config';

import { SongMetadata } from './types.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//create the Pinecone client 
//automatically connects finds the PINE_API_KEY from .env
const pinecone = new Pinecone();

//connect to the specific 'song' index we created in Pinecone
//<SongMetadata> tells TypeScript what shape the stored data will be
//so it knows each record has title, plot, genre, director etc
const index = pinecone.index<SongMetadata>('songs');

//define the shape of each item in embeddings_data.json
interface EmbeddingData {
  song: SongMetadata;
  embedding: OpenAI.Embedding['embedding'];
}

/**
 * Generate Pinecone records from embeddings data.
 */

//converts the raw embeddings data into the format Pinecone expects 
//each record needs: an id, a vector (values), and metadata (song data)
const generatePineconeRecords = (
  embeddingsData: EmbeddingData[]
): PineconeRecord<SongMetadata>[] => {
  const pineconeRecords: PineconeRecord<SongMetadata>[] = [];
  for (const { song, embedding } of embeddingsData) {
    pineconeRecords.push({
      id: song.id,
      values: embedding,
      metadata: song,
    });
  }
  return pineconeRecords;
};

/**
 * Create batches of Pinecone records for upserting.
 * Refer to the Pinecone documentation: https://docs.pinecone.io/guides/data/upsert-data
 */

//splits the records into smaller groups of 200
//you cant send thousands of records to Pinecone all at once
const createPineconeBatches = (
  vectors: PineconeRecord<SongMetadata>[],
  batchSize = 200
): PineconeRecord<SongMetadata>[][] => {
  const batches: PineconeRecord<SongMetadata>[][] = [];
  for (let i = 0; i < vectors.length; i += batchSize) {
    batches.push(vectors.slice(i, i + batchSize));
  }
  return batches;
};

/**
 * Upsert batches of Pinecone records to Pinecone.
 * Provide logging for each batch you try to, including the IDs of the first and last records in the batch.
 * Log the success or failure of each batch upsert.
 */
const upsertBatchesToPinecone = async (
  pineconeBatches: PineconeRecord<SongMetadata>[][]
): Promise<void> => {
  const delayBatch = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const upsertResults = await Promise.allSettled(
    pineconeBatches.map(async (batch, i) => {
      // await delayBatch(1000 * i); // Uncomment if you're getting Pinecone network errors
      console.log(
        `Upserting batch ${i + 1} of ${pineconeBatches.length}: IDs ${
          batch[0].id
        } through ${batch[batch.length - 1].id}`
      );
      return index.upsert({ records: batch });
    })
  );

  // Iterates through the results and checks status.
  // Will retry the upsert if the status from the original attempt fails
  for (let i = 0; i < upsertResults.length; i++) {
    if (upsertResults[i].status === 'rejected') {
      console.log(`Retrying upsert of batch ${i + 1}`);
      try {
        await index.upsert({ records: pineconeBatches[i] });
        console.log(`Retry for batch ${i + 1} successful!`);
      } catch (err) {
        console.error(`Failed to upsert batch ${i + 1} after retry:`, err);
      }
    } else {
      console.log(`Batch ${i + 1} upserted successfully.`);
    }
  }
};

const loadVariableFromJSON = async <T>(filename: string): Promise<T | null> => {
  const filePath = path.resolve(__dirname, filename);

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    console.log(`Data loaded from ${filePath}`);
    return JSON.parse(data) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn(`File ${filePath} does not exist.`);
      return null;
    } else {
      console.error(`Failed to load data from ${filePath}:`, error);
      return null;
    }
  }
};

const main = async (): Promise<void> => {
  const embeddingsData = await loadVariableFromJSON<EmbeddingData[]>(
    'embeddings_songs.json'
  );
  if (!embeddingsData) {
    throw new Error('Embeddings data not found.');
  }

  const pineconeRecords = generatePineconeRecords(embeddingsData);
  const pineconeBatches = createPineconeBatches(pineconeRecords);
  await upsertBatchesToPinecone(pineconeBatches);
};

main().catch((error) => {
  console.error('An error occurred in main:', error);
  process.exit(1);
});
