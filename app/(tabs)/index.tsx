import Container from "@/components/common/Container";
import CategoryChip from "@/components/home/CategoryChip";
import HeroSection from "@/components/home/HeroSection";
import HorizontalSection from "@/components/home/HorizontalSection";
import { useHeroMovies } from "@/hooks/useHeroMovies";
import { Category } from "@/types/category";
import { Movie } from "@/types/movie";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";

const categories: Category[] = [
  { id: "all", title: "All", icon: "apps-outline" },
  { id: "movies", title: "Movies", icon: "film-outline" },
  { id: "series", title: "Web Series", icon: "tv-outline" },
  { id: "action", title: "Action", icon: "flash-outline" },
  { id: "drama", title: "Drama", icon: "sparkles-outline" },
  { id: "scifi", title: "Sci-Fi", icon: "planet-outline" },
];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useHeroMovies();

  const movies = useMemo(() => data ?? [], [data]);

  const trending = useMemo(
    () => [...movies].sort((a, b) => b.rating - a.rating).slice(0, 10),
    [movies],
  );

  const newReleases = useMemo(
    () =>
      [...movies]
        .sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
        )
        .slice(0, 10),
    [movies],
  );

  const recommended = useMemo(() => movies.slice(5, 15), [movies]);

  const handleMoviePress = useCallback((movie: Movie) => {
    router.push({
      pathname: "/movie/[id]",
      params: { id: movie.id.toString() },
    });
  }, [router]);

  const renderCategory = useCallback(
    ({ item }: { item: Category }) => (
      <CategoryChip
        category={item}
        selected={selectedCategory === item.id}
        onPress={(category) => setSelectedCategory(category.id)}
      />
    ),
    [selectedCategory],
  );

  return (
    <Container edges={["bottom", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <HeroSection />

        <View className="mt-2">
          <FlatList
            data={categories}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={renderCategory}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          />
        </View>

        <HorizontalSection
          title="Trending"
          data={trending}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          onMoviePress={handleMoviePress}
        />

        <HorizontalSection
          title="New Releases"
          data={newReleases}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          onMoviePress={handleMoviePress}
        />

        <HorizontalSection
          title="Recommended"
          data={recommended}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          onMoviePress={handleMoviePress}
        />
      </ScrollView>
    </Container>
  );
}
