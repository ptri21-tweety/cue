// offline/check-genres.ts
import fs from 'fs';
import { parse } from 'csv-parse';
import type { CsvRow } from '../server/types.ts';

const genreCounts: Record<string, number> = {};

fs.createReadStream('./offline/raw_data/song_lyrics.csv')
  .pipe(parse({ columns: true, relax_quotes: true }))
  .on('data', (row: CsvRow) => {
    const genre = row.tag?.trim() || 'unknown';
    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
  })
  .on('end', () => {
    console.table(genreCounts);
    console.log('Total genres:', Object.keys(genreCounts).length);
  });
