export interface TMDBMovie {
  id: number;
  title: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

export interface TMDBMovieResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TMDBMovieDetail extends TMDBMovie {
  genres: TMDBGenre[];
  runtime: number | null;
  tagline: string;
  status: string;
  credits?: {
    cast: TMDBCastMember[];
  };
  videos?: {
    results: TMDBVideo[];
  };
}

export interface TMDBMovieChange {
  id: number;
  adult: boolean;
}

export interface TMDBMovieChangesResponse {
  page: number;
  results: TMDBMovieChange[];
  total_pages: number;
  total_results: number;
}

export interface Movie {
  id: number;
  title: string;
  backdrop: string;
  poster: string;
  rating: number;
  releaseDate: string;
  overview: string;
  youtubeKey?: string;
  youtubeUrl?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  avatar: string;
}

export interface MovieDetail extends Movie {
  genres: Genre[];
  runtime: number | null;
  tagline: string;
  status: string;
  cast: CastMember[];
}
