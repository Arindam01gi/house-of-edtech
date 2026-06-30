import { getMovieDetails, getSimilarMovies } from "@/services/tmdb";
import { useQuery } from "@tanstack/react-query";

export function useMovieDetails(movieId: number) {
  return useQuery({
    queryKey: ["movie-details", movieId],
    queryFn: () => getMovieDetails(movieId),
    enabled: Number.isFinite(movieId) && movieId > 0,
  });
}

export function useSimilarMovies(movieId: number) {
  return useQuery({
    queryKey: ["similar-movies", movieId],
    queryFn: () => getSimilarMovies(movieId),
    enabled: Number.isFinite(movieId) && movieId > 0,
  });
}
