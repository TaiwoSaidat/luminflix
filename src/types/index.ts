export interface Movie {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  backdrop: string;
  genre: string;
  rating: string;
  year: number;
  duration: string;
  videoUrl?: string;
}

export interface Category {
  name: string;
  movies: Movie[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
