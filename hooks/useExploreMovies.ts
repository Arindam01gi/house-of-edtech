import { getChangedMovies } from "@/services/tmdb";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useChangedMovies() {
  return useInfiniteQuery({
    queryKey: ["changed-movies"],
    queryFn: ({ pageParam }) => getChangedMovies(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;

      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
  });
}
