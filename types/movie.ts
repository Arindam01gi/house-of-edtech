export interface TMDBMovie {
  id: number;
  title: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

export interface Movie {
  id: number;
  title: string;
  backdrop: string;
  poster: string;
  rating: number;
  releaseDate: string;
  overview: string;
}
