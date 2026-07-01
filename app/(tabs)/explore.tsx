import Container from "@/components/common/Container";
import MovieCard from "@/components/home/MovieCard";
import { AppText } from "@/components/ui/AppText";
import SearchBar from "@/components/ui/SearchBar";
import { useChangedMovies } from "@/hooks/useExploreMovies";
import { useAppTheme } from "@/providers/AppThemeProvider";
import { Movie } from "@/types/movie";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  View,
} from "react-native";

type ExploreFilter = "all" | "top-rated" | "recent" | "underrated";

const exploreFilters: {
  id: ExploreFilter;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: "all", title: "All", icon: "grid-outline" },
  { id: "top-rated", title: "Top Rated", icon: "star-outline" },
  { id: "recent", title: "Recent", icon: "calendar-outline" },
  { id: "underrated", title: "Underrated", icon: "diamond-outline" },
];

function uniqueMovies(movies: Movie[]) {
  const byId = new Map<number, Movie>();

  movies.forEach((movie) => {
    byId.set(movie.id, movie);
  });

  return Array.from(byId.values());
}

function getReleaseYear(movie: Movie) {
  const year = Number(movie.releaseDate.split("-")[0]);

  return Number.isFinite(year) ? year : 0;
}

function ExploreFilterChip({
  filter,
  selected,
  onPress,
}: {
  filter: (typeof exploreFilters)[number];
  selected: boolean;
  onPress: (filter: ExploreFilter) => void;
}) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={() => onPress(filter.id)}
      className="mr-2 h-10 flex-row items-center rounded-full border px-4"
      style={({ pressed }) => ({
        backgroundColor: selected ? colors.primary : colors.surface,
        borderColor: selected ? colors.primary : colors.border,
        opacity: pressed ? 0.78 : 1,
      })}
    >
      <Ionicons
        name={filter.icon}
        size={15}
        color={selected ? "white" : colors.mutedText}
      />
      <AppText
        className="ml-2 text-xs font-bold"
        style={{ color: selected ? "white" : colors.text }}
      >
        {filter.title}
      </AppText>
    </Pressable>
  );
}

export default function ExploreScreen() {
  const [search, setSearch] = useState("");
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
  } = useChangedMovies();

  const movies = useMemo(
    () => uniqueMovies(data?.pages.flatMap((page) => page.movies) ?? []),
    [data?.pages],
  );

  const filteredByCategory = useMemo(() => {
    if (selectedFilter === "top-rated") {
      return movies.filter((movie) => movie.rating >= 7.5);
    }

    if (selectedFilter === "recent") {
      const currentYear = new Date().getFullYear();

      return movies.filter((movie) => getReleaseYear(movie) >= currentYear - 2);
    }

    if (selectedFilter === "underrated") {
      return movies.filter(
        (movie) =>
          movie.rating >= 6 &&
          movie.rating < 7.5 &&
          Boolean(movie.overview.trim()),
      );
    }

    return movies;
  }, [movies, selectedFilter]);

  const filteredMovies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return filteredByCategory;
    }

    return filteredByCategory.filter((movie) => {
      const title = movie.title.toLowerCase();
      const overview = movie.overview.toLowerCase();
      const releaseYear = movie.releaseDate.split("-")[0] ?? "";

      return (
        title.includes(normalizedSearch) ||
        overview.includes(normalizedSearch) ||
        releaseYear.includes(normalizedSearch)
      );
    });
  }, [filteredByCategory, search]);

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
    if (!hasNextPage || isFetchingNextPage || search.trim()) {
      return;
    }

    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, search]);

  const renderMovie: ListRenderItem<Movie> = useCallback(
    ({ item }) => <MovieCard movie={item} onPress={handleMoviePress} />,
    [handleMoviePress],
  );

  const renderFilter = useCallback(
    ({ item }: { item: (typeof exploreFilters)[number] }) => (
      <ExploreFilterChip
        filter={item}
        selected={selectedFilter === item.id}
        onPress={setSelectedFilter}
      />
    ),
    [selectedFilter],
  );

  const renderHeader = useCallback(
    () => (
      <View className="pb-5">
        <View className="px-5 pb-5 pt-4">
          <AppText
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: colors.primary }}
          >
            Discover
          </AppText>
          <AppText
            className="mt-2 text-3xl font-bold"
            style={{ color: colors.text }}
          >
            Explore Movies
          </AppText>
          <AppText
            className="mt-2 text-sm font-semibold leading-5"
            style={{ color: colors.mutedText }}
          >
            Fresh titles, ratings, and releases in one clean feed.
          </AppText>
        </View>

        <View className="px-5">
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search movies"
            returnKeyType="search"
          />
        </View>

        <FlatList
          data={exploreFilters}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={renderFilter}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18 }}
        />

        <View className="mt-6 flex-row items-end justify-between px-5">
          <View>
            <AppText
              className="text-xl font-bold"
              style={{ color: colors.text }}
            >
              Movies
            </AppText>
            <AppText
              className="mt-1 text-xs font-semibold"
              style={{ color: colors.mutedText }}
            >
              {filteredMovies.length} results
            </AppText>
          </View>
          {search.trim() ? (
            <Pressable
              onPress={() => setSearch("")}
              className="h-9 flex-row items-center rounded-full px-3"
              style={{ backgroundColor: colors.surface }}
            >
              <Ionicons name="close" size={14} color={colors.mutedText} />
              <AppText
                className="ml-1 text-xs font-bold"
                style={{ color: colors.text }}
              >
                Clear
              </AppText>
            </Pressable>
          ) : null}
        </View>
      </View>
    ),
    [
      colors.mutedText,
      colors.primary,
      colors.surface,
      colors.text,
      filteredMovies.length,
      renderFilter,
      search,
    ],
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
            Loading updated movies...
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
            Could not load updates
          </AppText>
          <AppText
            className="mt-2 text-center text-sm leading-5"
            style={{ color: colors.mutedText }}
          >
            Check your connection and try again.
          </AppText>
          <Pressable
            onPress={() => refetch()}
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
          Try another search.
        </AppText>
      </View>
    );
  }, [
    colors.border,
    colors.mutedText,
    colors.primary,
    colors.surface,
    colors.text,
    isError,
    isLoading,
    refetch,
  ]);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) {
      return <View className="h-8" />;
    }

    return (
      <View className="items-center py-6">
        <ActivityIndicator color={colors.primary} />
        <AppText
          className="mt-3 text-xs font-semibold"
          style={{ color: colors.mutedText }}
        >
          Loading more updates...
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
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderListState}
        ListFooterComponent={renderFooter}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
        contentContainerStyle={{ paddingBottom: 96 }}
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
