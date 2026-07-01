import {
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "@/services/tmdb";
import { useQuery } from "@tanstack/react-query";

export function useHeroMovies() {
  return useQuery({
    queryKey: ["hero-movies"],
    queryFn: getNowPlayingMovies,
  });
}

export function usePopularMovies() {
  return useQuery({
    queryKey: ["popular-movies"],
    queryFn: getPopularMovies,
  });
}

export function useTopRatedMovies() {
  return useQuery({
    queryKey: ["top-rated-movies"],
    queryFn: getTopRatedMovies,
  });
}

export function useUpcomingMovies() {
  return useQuery({
    queryKey: ["upcoming-movies"],
    queryFn: getUpcomingMovies,
  });
}
