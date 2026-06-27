export type ServerError = {
  log: string;
  status: number;
  message: { err: string };
};
export type CsvRow = {
  tag: string;
  id: string;
  title: string;
  artist: string;
  year: string;
  lyrics: string;
  language: string;
};
export type Genre = 'rap' | 'rb' | 'rock' | 'pop' | 'country';

export const TARGET_GENRES: Genre[] = ['rap', 'rb', 'rock', 'pop', 'country'];

export type SongMetadata = {
  id: string;
  title: string;
  artist: string;
  genre: Genre;
  year: string;
  lyrics: string;
  language: string;
};

export type ParsedQuery = {
  userQuery: string;
  title: string | null;
  artist: string | null;
  year: string | null;
};
