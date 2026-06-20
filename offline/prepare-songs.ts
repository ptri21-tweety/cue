// stream raw CSV
// collect 5 songs per genre
// write processed sample file

import fs from 'node:fs';
import { parse } from 'csv-parse';
import { TARGET_GENRES } from './types.ts';
import type { Genre, SongMetadata } from './types.ts';

const RAW_CSV_PATH = './offline/raw_data/song_lyrics.csv';
const OUTPUT_PATH = './offline/processed_songs.json';
const SONGS_PER_GENRE = 5;
const MIN_LYRICS_LENGTH = 50;

const selectedSongs: SongMetadata[] = [];
const genreCounts: Record<Genre, number> = {
  rap: 0,
  rb: 0,
  rock: 0,
  pop: 0,
  misc: 0,
  country: 0,
};

function isTargetGenre(value: string): value is Genre {
  return TARGET_GENRES.includes(value as Genre);
}

function hasEnoughSongs(): boolean {
  return TARGET_GENRES.every((genre) => genreCounts[genre] >= SONGS_PER_GENRE);
}

function isEnglish(row: any): boolean {
  return row.language?.trim().toLowercase() === 'en';
}

function hasCompleteLyrics(row: any): boolean {
  return typeof row.lyrics === 'string' && row.lyrics.trim().length >= MIN_LYRICS_LENGTH;
}

function buildSongMetadata(row: any): SongMetadata {
  return {
    id: row.id,
    title: row.title.trim(),
    artist: row.artist.trim(),
    genre: row.tag.trim() as Genre,
    year: row.year.trim(),
    lyrics: row.lyrics.trim(),
    language: row.language,
  };
}

function writeProcessedSongs() {
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(selectedSongs, null, 2));
  console.table(genreCounts);
  console.log(`Wrote ${selectedSongs.length} songs to ${OUTPUT_PATH}`);
}

const readStream = fs.createReadStream(RAW_CSV_PATH);

readStream
  .pipe(
    parse({
      columns: true,
      relax_quotes: true,
      relax_column_count: true,
      skip_empty_lines: true,
    })
  )
  .on('data', (row: any) => {
    const genre = row.tag?.trim();

    if (!genre || !isTargetGenre(genre)) return;
    if (genreCounts[genre] >= SONGS_PER_GENRE) return;
    if (!isEnglish(row)) return;
    if (!row.id?.trim() || !row.title?.trim() || !row.artist?.trim() || !row.year?.trim()) return;
    if (!hasCompleteLyrics(row)) return;

    const song = buildSongMetadata(row);

    selectedSongs.push(song);
    genreCounts[genre] += 1;

    if (hasEnoughSongs()) {
       writeProcessedSongs(); 
      readStream.destroy();
    }
  })
  .on('error', (error) => {
    console.error('Failed to parse CSV:');
    console.error(error);
  })
  .on('end', () => {
    console.log('Made it to the END of the CSV file');
  });