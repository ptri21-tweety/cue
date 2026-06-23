// clear-index.ts

import { Pinecone } from '@pinecone-database/pinecone';
import 'dotenv/config';

const pinecone = new Pinecone();
const index = pinecone.index('songs');

await index.deleteAll();

console.log('Index cleared.');
