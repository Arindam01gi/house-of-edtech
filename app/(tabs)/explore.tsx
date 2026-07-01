import Container from "@/components/common/Container";
import CategoryChip from "@/components/home/CategoryChip";
import MovieCard from "@/components/home/MovieCard";
import SearchBar from "@/components/ui/SearchBar";
import { AppText } from "@/components/ui/AppText";
import {
  usePopularMovies,
  useTopRatedMovies,
  useUpcomingMovies,
} from "@/hooks/useHeroMovies";
import { useAppTheme } from "@/providers/AppThemeProvider";
import { Category } from "@/types/category";
import { Movie } from "@/types/movie";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  View,
} from "react-native";

const exploreCategories: Category[] = [
  { id: "all", title: "All", icon: "apps-outline" },
  { id: "popular", title: "Popular", icon: "flame-outline" },
  { id: "top-rated", title: "Top Rated", icon: "star-outline" },
  { id: "upcoming", title: "Upcoming", icon: "calendar-outline" },
];

function uniqueMovies(movies: Movie[]) {
  const byId = new Map<number, Movie>();

  movies.forEach((movie) => {
    byId.set(movie.id, movie);
  });

  return Array.from(byId.values());
}

export default function ExploreScreen() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const { colors } = useAppTheme();
  const router = useRouter();

  const popularMovies = usePopularMovies();
  const topRatedMovies = useTopRatedMovies();
  const upcomingMovies = useUpcomingMovies();

  const selectedMovies = useMemo(() => {
    if (selectedCategory === "popular") {
      return popularMovies.data ?? [];
    }

    if (selectedCategory === "top-rated") {
      return topRatedMovies.data ?? [];
    }

    if (selectedCategory === "upcoming") {
      return upcomingMovies.data ?? [];
    }

    return uniqueMovies([
      ...(popularMovies.data ?? []),
      ...(topRatedMovies.data ?? []),
      ...(upcomingMovies.data ?? []),
    ]);
  }, [
    popularMovies.data,
    selectedCategory,
    topRatedMovies.data,
    upcomingMovies.data,
  ]);

  const filteredMovies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return selectedMovies;
    }

    return selectedMovies.filter((movie) => {
      const title = movie.title.toLowerCase();
      const overview = movie.overview.toLowerCase();

      return (
        title.includes(normalizedSearch) || overview.includes(normalizedSearch)
      );
    });
  }, [search, selectedMovies]);

  const isLoading =
    selectedCategory === "all"
      ? popularMovies.isLoading ||
        topRatedMovies.isLoading ||
        upcomingMovies.isLoading
      : selectedCategory === "popular"
        ? popularMovies.isLoading
        : selectedCategory === "top-rated"
          ? topRatedMovies.isLoading
          : upcomingMovies.isLoading;

  const isError =
    selectedCategory === "all"
      ? popularMovies.isError ||
        topRatedMovies.isError ||
        upcomingMovies.isError
      : selectedCategory === "popular"
        ? popularMovies.isError
        : selectedCategory === "top-rated"
          ? topRatedMovies.isError
          : upcomingMovies.isError;

  const handleRetry = useCallback(() => {
    if (selectedCategory === "popular") {
      popularMovies.refetch();
      return;
    }

    if (selectedCategory === "top-rated") {
      topRatedMovies.refetch();
      return;
    }

    if (selectedCategory === "upcoming") {
      upcomingMovies.refetch();
      return;
    }

    popularMovies.refetch();
    topRatedMovies.refetch();
    upcomingMovies.refetch();
  }, [popularMovies, selectedCategory, topRatedMovies, upcomingMovies]);

  const handleMoviePress = useCallback(
    (movie: Movie) => {
      router.push({
        pathname: "/movie/[id]",
        params: { id: movie.id.toString() },
      });
    },
    [router],
  );

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

  const renderMovie: ListRenderItem<Movie> = useCallback(
    ({ item }) => <MovieCard movie={item} onPress={handleMoviePress} />,
    [handleMoviePress],
  );

  const renderHeader = useCallback(
    () => (
      <View className="px-5 pb-5 pt-4">
        <View className="mb-5">
          <AppText
            className="text-3xl font-bold"
            style={{ color: colors.text }}
          >
            Explore
          </AppText>
          <AppText
            className="mt-1 text-sm font-semibold"
            style={{ color: colors.mutedText }}
          >
            Search and filter movies
          </AppText>
        </View>

        <SearchBar
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />

        <View className="mt-5">
          <FlatList
            data={exploreCategories}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={renderCategory}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View className="mt-5 flex-row items-center justify-between">
          <AppText className="text-lg font-bold" style={{ color: colors.text }}>
            {filteredMovies.length} results
          </AppText>
        </View>
      </View>
    ),
    [colors, filteredMovies.length, renderCategory, search],
  );

  const renderListState = useCallback(() => {
    if (isLoading) {
      return (
        <View className="mt-20 items-center">
          <ActivityIndicator color={colors.primary} />
          <AppText
            className="mt-4 font-semibold"
            style={{ color: colors.mutedText }}
          >
            Loading movies...
          </AppText>
        </View>
      );
    }

    if (isError) {
      return (
        <View
          className="mx-5 mt-12 items-center rounded-3xl border px-6 py-8"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
          <AppText
            className="mt-4 text-center text-lg font-bold"
            style={{ color: colors.text }}
          >
            Could not load explore
          </AppText>
          <AppText
            className="mt-2 text-center text-sm leading-5"
            style={{ color: colors.mutedText }}
          >
            Check your connection and try again.
          </AppText>
          <Pressable
            onPress={handleRetry}
            className="mt-5 rounded-2xl px-5 py-3"
            style={{ backgroundColor: colors.primary }}
          >
            <AppText className="text-sm font-bold text-white">Retry</AppText>
          </Pressable>
        </View>
      );
    }

    return (
      <View
        className="mx-5 mt-12 items-center rounded-3xl border px-6 py-8"
        style={{ backgroundColor: colors.surface, borderColor: colors.border }}
      >
        <Ionicons name="search-outline" size={40} color={colors.mutedText} />
        <AppText
          className="mt-4 text-center text-lg font-bold"
          style={{ color: colors.text }}
        >
          No movies found
        </AppText>
        <AppText
          className="mt-2 text-center text-sm leading-5"
          style={{ color: colors.mutedText }}
        >
          Try another search or filter.
        </AppText>
      </View>
    );
  }, [
    colors.border,
    colors.mutedText,
    colors.primary,
    colors.surface,
    colors.text,
    handleRetry,
    isError,
    isLoading,
  ]);

  return (
    <Container edges={["top", "left", "right"]}>
      <FlatList
        data={isLoading || isError ? [] : filteredMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovie}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderListState}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
        contentContainerStyle={{ paddingBottom: 96 }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={50}
        windowSize={7}
        removeClippedSubviews
      />
    </Container>
  );
}
