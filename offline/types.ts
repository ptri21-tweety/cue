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
