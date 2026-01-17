import { Movie } from "@/types";

const MOCK_MOVIES: Movie[] = [
  {
    id: 1,
    title: "The Cosmic Journey",
    description:
      "An epic space adventure that takes you beyond the known universe. Follow Captain Sarah Chen as she discovers ancient alien civilizations.",
    thumbnail:
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop",
    backdrop:
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920&h=1080&fit=crop",
    genre: "Sci-Fi",
    rating: "PG-13",
    year: 2024,
    duration: "2h 18m",
    triggers: ["Violence", "Mild Language"],
    cast: ["Actor A", "Actor B", "Actor C"],
    genres: ["Adventure", "Drama", "Sci-Fi"],
  },
  {
    id: 2,
    title: "Shadow Detective",
    description:
      "A noir thriller set in 1940s New York where a detective uncovers a conspiracy that goes deeper than he ever imagined.",
    thumbnail:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
    backdrop:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1920&h=1080&fit=crop",
    genre: "Thriller",
    rating: "R",
    year: 2023,
    duration: "1h 52m",
    triggers: ["Strong Language", "Violence"],
    cast: ["Actor D", "Actor E", "Actor F"],
    genres: ["Crime", "Drama", "Thriller"],
  },
  {
    id: 3,
    title: "Ocean's Heart",
    description:
      "A heartwarming story about a marine biologist who discovers a unique connection with ocean life and fights to protect it.",
    thumbnail:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=600&fit=crop",
    backdrop:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop",
    genre: "Drama",
    rating: "PG",
    year: 2024,
    duration: "2h 5m",
    triggers: ["Emotional Themes"],
    cast: ["Actor G", "Actor H", "Actor I"],
    genres: ["Drama", "Romance"],
  },
  {
    id: 4,
    title: "Neon Nights",
    description:
      "In a dystopian future, a hacker must navigate through corporate espionage to save what's left of humanity's freedom.",
    thumbnail:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop",
    backdrop:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=1080&fit=crop",
    genre: "Action",
    rating: "R",
    year: 2024,
    duration: "2h 30m",
    triggers: ["Violence", "Strong Language", "Drug Use"],
    cast: ["Actor J", "Actor K", "Actor L"],
    genres: ["Action", "Sci-Fi", "Thriller"],
  },
  {
    id: 5,
    title: "Mountain's Call",
    description:
      "An adventure documentary following climbers as they attempt to summit the world's most dangerous peaks.",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
    backdrop:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    genre: "Documentary",
    rating: "PG",
    year: 2023,
    duration: "1h 45m",
    triggers: ["Mild Danger"],
    cast: ["Narrator A"],
    genres: ["Adventure", "Documentary"],
  },
  {
    id: 6,
    title: "Love in Paris",
    description:
      "A romantic comedy about two strangers who keep running into each other in the most unexpected places around Paris.",
    thumbnail:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=600&fit=crop",
    backdrop:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&h=1080&fit=crop",
    genre: "Romance",
    rating: "PG-13",
    year: 2024,
    duration: "1h 38m",
    triggers: ["Mild Language", "Romantic Themes"],
    cast: ["Actor M", "Actor N"],
    genres: ["Romance", "Comedy"],
  },
];
export default MOCK_MOVIES;
