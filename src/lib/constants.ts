export const APP_NAME = 'LuminFlix';

export const ROUTES = {
  HOME: '/',
  BROWSE: '/browse',
  SEARCH: '/search',
  WATCH: '/watch',
  MY_LIST: '/my-list',
} as const;

export const MOVIE_GENRES = [
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'Documentary',
] as const;

export const RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17'] as const;