import OpenAI from 'openai'
import { Pinecone } from '@pinecone-database/pinecone'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'
import type { SongMetadata } from '../server/types.ts'

// Needed to use __dirname in ES module files (import/export syntax)
// Without this, __dirname doesn't exist and file paths break
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Initialize OpenAI and Pinecone clients using API keys from .env
const openai = new OpenAI()
const pinecone = new Pinecone()

// Connect to our specific Pinecone index where songs are stored
// <SongMetadata> tells TypeScript what shape each stored record has
const index = pinecone.index<SongMetadata>('songs')

// TypeScript type defining the shape of each entry in golden_dataset.json
interface GoldenEntry {
  id: string
  query: string
  tests: string[]
  acceptable_song_ids: string[]
  acceptable_songs: string[]
  acceptable_genres: string[]
  acceptable_artists: string[]
  should_not_return_song_ids: string[]
  should_not_return_songs: string[]
  notes: string
}

const runEval = async () => {
  // Load the golden dataset JSON file from disk
  const filePath = path.resolve(__dirname, '../evaluation/golden_dataset.json')
  const raw = await fs.readFile(filePath, 'utf-8')
  const dataset: GoldenEntry[] = JSON.parse(raw)

  // Track how many test cases pass and fail
  let passed = 0
  let failed = 0

  // Loop through each test case in the golden dataset one at a time
  for (const entry of dataset) {
    console.log(`\n--- Running: ${entry.id} ---`)
    console.log(`Query: "${entry.query}"`)

    // embed the query
    // Step 1: Turn the query into a vector (list of 1536 numbers)
    // This is the same embedding step that happens in searchController
    // We need the vector so we can search Pinecone by semantic similarity
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: entry.query,
      encoding_format: 'float'
    })
    const vector = embeddingResponse.data[0].embedding

    // search pinecone
    // Step 2: Search Pinecone for the 5 most similar songs
    // includeMetadata: true means we get the song's title, artist, genre etc back
    // not just the vector IDs
    const results = await index.query({
      vector,
      topK: 5,
      includeMetadata: true,
      includeValues: false
    })

    const matches = results.matches

    // check results
    // Extract the IDs, genres, and artists from the returned songs
    // so we can check them against the golden dataset's acceptable/banned lists
    const returnedIds = matches.map(m => m.id)
    const returnedGenres = matches.map(m => m.metadata?.genre)
    const returnedArtists = matches.map(m => m.metadata?.artist)

    // Pass criteria - at least one of these must be true:
    // did we get a song with an acceptable ID, genre, or artist?
    const hitAcceptableId = returnedIds.some(id => entry.acceptable_song_ids.includes(id))
    const hitAcceptableGenre = returnedGenres.some(g => entry.acceptable_genres.includes(g as string))
    const hitAcceptableArtist = returnedArtists.some(a => entry.acceptable_artists.includes(a as string))
     // Fail criteria - this must NOT be true:
    // did we get a song that's explicitly banned for this query?
    const hitBannedId = returnedIds.some(id => entry.should_not_return_song_ids.includes(id))

    // Final pass/fail decision:
    // PASS = at least one acceptable result AND no banned results
    // FAIL = no acceptable results OR a banned result came back
    const pass = (hitAcceptableId || hitAcceptableGenre || hitAcceptableArtist) && !hitBannedId

    if (pass) {
      passed++
      console.log(`PASS`)
    } else {
      failed++
      console.log(`FAIL`)
    }

    // Print what actually came back so the team can see and judge quality
    console.log(`Returned songs:`)
    matches.forEach(m => {
      console.log(`  - ${m.metadata?.title} by ${m.metadata?.artist} (${m.metadata?.genre}) [id: ${m.id}]`)
    })
  }

  // Final summary after all test cases have run
  console.log(`\n=== RESULTS: ${passed} passed, ${failed} failed out of ${dataset.length} ===`)
}

runEval().catch(console.error)