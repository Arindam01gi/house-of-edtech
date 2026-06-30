import {
  CastMember,
  Movie,
  MovieDetail,
  TMDBCastMember,
  TMDBMovie,
  TMDBMovieDetail,
} from "@/types/movie";

export const BASE_URL = process.env.EXPO_PUBLIC_TMDB_BASE_URL!;
export const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY!;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

function mapMovie(movie: TMDBMovie): Movie {
  return {
    id: movie.id,
    title: movie.title,
    backdrop: movie.backdrop_path
      ? `${IMAGE_BASE_URL}/original${movie.backdrop_path}`
      : "",
    poster: movie.poster_path ? `${IMAGE_BASE_URL}/w500${movie.poster_path}` : "",
    rating: movie.vote_average,
    releaseDate: movie.release_date,
    overview: movie.overview,
  };
}

function mapCastMember(member: TMDBCastMember): CastMember {
  return {
    id: member.id,
    name: member.name,
    character: member.character,
    avatar: member.profile_path ? `${IMAGE_BASE_URL}/w185${member.profile_path}` : "",
  };
}

export async function getNowPlayingMovies(): Promise<Movie[]> {
  const url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.results) {
    return [];
  }

  return data.results.map(mapMovie);
}

export async function getMovieDetails(movieId: number): Promise<MovieDetail> {
  const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=credits`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }

  const movie = (await response.json()) as TMDBMovieDetail;

  return {
    ...mapMovie(movie),
    genres: movie.genres,
    runtime: movie.runtime,
    tagline: movie.tagline,
    status: movie.status,
    cast: movie.credits?.cast.slice(0, 8).map(mapCastMember) ?? [],
  };
}

export async function getSimilarMovies(movieId: number): Promise<Movie[]> {
  const url = `${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch similar movies");
  }

  const data = await response.json();

  if (!data.results) {
    return [];
  }

  return data.results.map(mapMovie);
}
