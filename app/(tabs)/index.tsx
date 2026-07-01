import Container from "@/components/common/Container";
import HeroSection from "@/components/home/HeroSection";
import HorizontalSection from "@/components/home/HorizontalSection";
import {
  usePopularMovies,
  useTopRatedMovies,
  useUpcomingMovies,
} from "@/hooks/useHeroMovies";
import { Movie } from "@/types/movie";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const popularMovies = usePopularMovies();
  const topRatedMovies = useTopRatedMovies();
  const upcomingMovies = useUpcomingMovies();

  const handleMoviePress = useCallback(
    (movie: Movie) => {
      router.push({
        pathname: "/movie/[id]",
        params: { id: movie.id.toString() },
      });
    },
    [router],
  );

  return (
    <Container edges={["bottom", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <HeroSection />

        <HorizontalSection
          title="Popular"
          data={popularMovies.data}
          isLoading={popularMovies.isLoading}
          isError={popularMovies.isError}
          onRetry={() => popularMovies.refetch()}
          onMoviePress={handleMoviePress}
        />

        <HorizontalSection
          title="Top Rated"
          data={topRatedMovies.data}
          isLoading={topRatedMovies.isLoading}
          isError={topRatedMovies.isError}
          onRetry={() => topRatedMovies.refetch()}
          onMoviePress={handleMoviePress}
        />

        <HorizontalSection
          title="Upcoming"
          data={upcomingMovies.data}
          isLoading={upcomingMovies.isLoading}
          isError={upcomingMovies.isError}
          onRetry={() => upcomingMovies.refetch()}
          onMoviePress={handleMoviePress}
        />
      </ScrollView>
    </Container>
  );
}
