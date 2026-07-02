import { discoverMovies, searchMovies } from "@/services/tmdb";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useExploreMovies(searchQuery: string) {
  const query = searchQuery.trim();

  return useInfiniteQuery({
    queryKey: ["explore-movies", query],
    queryFn: ({ pageParam }) => {
      if (query) {
        return searchMovies(query, pageParam);
      }
      return discoverMovies(pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;

      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
  });
}
