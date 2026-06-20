
export type Genre = 'rap' | 'rb' | 'rock' | 'pop' | 'misc' | 'country';

export const TARGET_GENRES: Genre[] = [
  'rap',
  'rb',
  'rock',
  'pop',
  'misc',
  'country',
];

export type SongMetadata = {
  id: string;
  title: string;
  artist: string;
  genre: Genre;
  year: string;
  lyrics: string;
  language: string;
};