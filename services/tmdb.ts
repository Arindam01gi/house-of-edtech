export const BASE_URL = process.env.EXPO_PUBLIC_TMDB_BASE_URL!;
export const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY!;
import { Movie, TMDBMovie } from "@/types/movie";

export async function getNowPlayingMovies(): Promise<Movie[]> {
  const url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.results) {
    return [];
  }

  return data.results.map((movie: TMDBMovie): Movie => ({
    id: movie.id,
    title: movie.title,
    backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : "",
    poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "",
    rating: movie.vote_average,
    releaseDate: movie.release_date,
    overview: movie.overview,
  }));
}