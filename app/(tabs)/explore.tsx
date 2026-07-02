import Container from "@/components/common/Container";
import { ExploreEmptyState } from "@/components/explore/ExploreEmptyState";
import { ExploreHeader } from "@/components/explore/ExploreHeader";
import { ExploreFilter } from "@/components/explore/exploreFilters";
import MovieCard from "@/components/home/MovieCard";
import { useDebounce } from "@/hooks/useDebounce";
import { useExploreMovies } from "@/hooks/useExploreMovies";
import { useAppTheme } from "@/providers/AppThemeProvider";
import { Movie } from "@/types/movie";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ListRenderItem,
  RefreshControl,
  View,
} from "react-native";
import { AppText } from "@/components/ui/AppText";

// ─── Layout constants ────────────────────────────────────────────────────────
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLUMN_GAP = 16;
const PADDING_HORIZONTAL = 20;
const CARD_WIDTH = (SCREEN_WIDTH - PADDING_HORIZONTAL * 2 - COLUMN_GAP) / 2;
const IMAGE_HEIGHT = Math.round(CARD_WIDTH * 1.48);

// ─── Helpers ─────────────────────────────────────────────────────────────────
function uniqueMovies(movies: Movie[]) {
  const byId = new Map<number, Movie>();
  movies.forEach((movie) => byId.set(movie.id, movie));
  return Array.from(byId.values());
}

function getReleaseYear(movie: Movie) {
  const year = Number(movie.releaseDate.split("-")[0]);
  return Number.isFinite(year) ? year : 0;
}

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function ExploreScreen() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [selectedFilter, setSelectedFilter] = useState<ExploreFilter>("all");
  const { colors } = useAppTheme();
  const router = useRouter();

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
    isRefetching,
  } = useExploreMovies(debouncedSearch);

  const movies = useMemo(
    () => uniqueMovies(data?.pages.flatMap((page) => page.movies) ?? []),
    [data?.pages],
  );

  const filteredMovies = useMemo(() => {
    if (selectedFilter === "top-rated") {
      return movies.filter((m) => m.rating >= 7.5);
    }
    if (selectedFilter === "recent") {
      const currentYear = new Date().getFullYear();
      return movies.filter((m) => getReleaseYear(m) >= currentYear - 2);
    }
    if (selectedFilter === "underrated") {
      return movies.filter(
        (m) => m.rating >= 6 && m.rating < 7.5 && Boolean(m.overview.trim()),
      );
    }
    return movies;
  }, [movies, selectedFilter]);

  const handleMoviePress = useCallback(
    (movie: Movie) => {
      router.push({
        pathname: "/movie/[id]",
        params: { id: movie.id.toString() },
      });
    },
    [router],
  );

  const handleEndReached = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderMovie: ListRenderItem<Movie> = useCallback(
    ({ item }) => (
      <MovieCard
        movie={item}
        width={CARD_WIDTH}
        imageHeight={IMAGE_HEIGHT}
        onPress={handleMoviePress}
      />
    ),
    [handleMoviePress],
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return <View className="h-8" />;
    return (
      <View className="items-center py-6">
        <ActivityIndicator color={colors.primary} />
        <AppText
          className="mt-3 text-xs font-semibold"
          style={{ color: colors.mutedText }}
        >
          Loading more...
        </AppText>
      </View>
    );
  }, [colors.mutedText, colors.primary, isFetchingNextPage]);

  return (
    <Container edges={["top", "left", "right"]}>
      <FlatList
        data={isLoading || isError ? [] : filteredMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovie}
        ListHeaderComponent={
          <ExploreHeader
            search={search}
            onSearchChange={setSearch}
            onClearSearch={() => setSearch("")}
            selectedFilter={selectedFilter}
            onFilterSelect={setSelectedFilter}
            resultCount={filteredMovies.length}
          />
        }
        ListEmptyComponent={
          <ExploreEmptyState
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
          />
        }
        ListFooterComponent={renderFooter}
        numColumns={2}
        columnWrapperStyle={{
          gap: COLUMN_GAP,
          paddingHorizontal: PADDING_HORIZONTAL,
        }}
        contentContainerStyle={{
          paddingBottom: 96,
          gap: COLUMN_GAP,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isFetchingNextPage}
            tintColor={colors.primary}
            onRefresh={() => refetch()}
          />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.8}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={50}
        windowSize={7}
        removeClippedSubviews
      />
    </Container>
  );
}
