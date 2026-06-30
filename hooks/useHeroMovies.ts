import { getNowPlayingMovies } from "@/services/tmdb";
import { useQuery } from "@tanstack/react-query";


export function useHeroMovies () {
    return useQuery({
        queryKey: ["hero-movies"],
        queryFn: getNowPlayingMovies,
    })
}
