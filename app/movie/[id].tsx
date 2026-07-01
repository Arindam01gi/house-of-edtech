import HorizontalSection from "@/components/home/HorizontalSection";
import LoadingSkeleton from "@/components/home/LoadingSkeleton";
import { AppText } from "@/components/ui/AppText";
import { useMovieDetails, useSimilarMovies } from "@/hooks/useMovieDetails";
import { useAppTheme } from "@/providers/AppThemeProvider";
import { Movie } from "@/types/movie";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  FlatList,
  Linking,
  ListRenderItem,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

function formatRuntime(minutes: number | null) {
  if (!minutes) {
    return "N/A";
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) {
    return `${rest}m`;
  }

  return `${hours}h ${rest}m`;
}

function releaseYear(releaseDate: string) {
  return releaseDate ? releaseDate.split("-")[0] : "New";
}

function DetailStat({
  icon,
  label,
  value,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  colors: ReturnType<typeof useAppTheme>["colors"];
}) {
  return (
    <View
      className="flex-1 rounded-2xl border px-3 py-4"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <Ionicons name={icon} size={18} color={colors.primary} />
      <AppText
        className="mt-3 text-xs font-medium"
        style={{ color: colors.mutedText }}
      >
        {label}
      </AppText>
      <AppText
        className="mt-1 text-sm font-bold"
        style={{ color: colors.text }}
        numberOfLines={1}
      >
        {value}
      </AppText>
    </View>
  );
}

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const movieId = Number(id);

  const { data: movie, isLoading, isError, refetch } = useMovieDetails(movieId);

  const {
    data: similarMovies,
    isLoading: isSimilarLoading,
    isError: isSimilarError,
    refetch: refetchSimilar,
  } = useSimilarMovies(movieId);

  const genres = useMemo(
    () => movie?.genres.map((genre) => genre.name).join(" • ") ?? "",
    [movie?.genres],
  );

  const handleMoviePress = useCallback(
    (selectedMovie: Movie) => {
      router.push({
        pathname: "/movie/[id]",
        params: { id: selectedMovie.id.toString() },
      });
    },
    [router],
  );

  const handleWatchNow = useCallback(() => {
    if (!movie) {
      return;
    }

    const url =
      movie.youtubeUrl ??
      `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `${movie.title} official trailer`,
      )}`;

    void Linking.openURL(url);
  }, [movie]);

  const renderCast: ListRenderItem<NonNullable<typeof movie>["cast"][number]> =
    useCallback(
      ({ item }) => {
        return (
          <View className="mr-4 w-24">
            <View
              className="h-24 w-24 overflow-hidden rounded-2xl"
              style={{ backgroundColor: colors.surface }}
            >
              {item.avatar ? (
                <Image
                  source={{ uri: item.avatar }}
                  style={{ flex: 1 }}
                  contentFit="cover"
                  transition={180}
                />
              ) : (
                <View className="flex-1 items-center justify-center">
                  <Ionicons
                    name="person-outline"
                    size={28}
                    color={colors.mutedText}
                  />
                </View>
              )}
            </View>
            <AppText
              className="mt-2 text-xs font-bold"
              style={{ color: colors.text }}
              numberOfLines={1}
            >
              {item.name}
            </AppText>
            <AppText
              className="mt-1 text-[11px]"
              style={{ color: colors.mutedText }}
              numberOfLines={1}
            >
              {item.character}
            </AppText>
          </View>
        );
      },
      [colors.mutedText, colors.surface, colors.text],
    );

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1"
        edges={["top", "right", "bottom", "left"]}
        style={{ backgroundColor: colors.background }}
      >
        <LoadingSkeleton variant="detail" />
      </SafeAreaView>
    );
  }

  if (isError || !movie) {
    return (
      <SafeAreaView
        edges={["top", "right", "bottom", "left"]}
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: colors.background }}
      >
        <Ionicons name="alert-circle-outline" size={54} color="#EF4444" />
        <AppText
          className="mt-4 text-center text-lg font-bold"
          style={{ color: colors.text }}
        >
          Failed to load movie details
        </AppText>
        <AppText
          className="mt-2 text-center text-sm leading-5"
          style={{ color: colors.mutedText }}
        >
          Please check your network settings and try again.
        </AppText>
        <View className="mt-6 flex-row gap-3">
          <Pressable
            onPress={() => router.back()}
            className="rounded-2xl border px-5 py-3"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <AppText className="font-bold" style={{ color: colors.text }}>
              Go Back
            </AppText>
          </Pressable>
          <Pressable
            onPress={() => refetch()}
            className="rounded-2xl px-5 py-3"
            style={{ backgroundColor: colors.primary }}
          >
            <AppText className="font-bold text-white">Retry</AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top", "right", "bottom", "left"]}
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 36 }}
        contentInsetAdjustmentBehavior="never"
      >
        <View className="h-[520px]">
          <Image
            source={{ uri: movie.backdrop || movie.poster }}
            style={{ flex: 1 }}
            contentFit="cover"
            transition={240}
          />

          <LinearGradient
            colors={[
              "rgba(11, 11, 15, 0.25)",
              isDark ? "rgba(11, 11, 15, 0.58)" : "rgba(16, 18, 26, 0.50)",
              isDark ? "rgba(11, 11, 15, 0.95)" : "rgba(247, 248, 252, 0.64)",
              colors.background,
            ]}
            locations={[0, 0.58, 0.9, 1]}
            className="absolute inset-0 justify-end px-5 pb-8"
          >
            <AppText
              variant="h1"
              className="font-extrabold text-white"
              numberOfLines={3}
            >
              {movie.title}
            </AppText>

            {movie.tagline ? (
              <AppText className="mt-2 text-sm font-medium italic text-zinc-300">
                {movie.tagline}
              </AppText>
            ) : null}

            <View className="mt-4 flex-row flex-wrap items-center gap-2">
              <View className="flex-row items-center rounded-full bg-yellow-500/15 px-3 py-1.5">
                <Ionicons name="star" size={14} color="#FFC107" />
                <AppText className="ml-1 text-xs font-bold text-yellow-400">
                  {movie.rating.toFixed(1)}
                </AppText>
              </View>
              <AppText className="text-sm font-semibold text-zinc-300">
                {releaseYear(movie.releaseDate)}
              </AppText>
              <View className="h-1 w-1 rounded-full bg-zinc-500" />
              <AppText className="text-sm font-semibold text-zinc-300">
                {formatRuntime(movie.runtime)}
              </AppText>
            </View>

            <Pressable
              onPress={handleWatchNow}
              className="mt-6 h-14 flex-row items-center justify-center rounded-2xl bg-white px-5"
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.96 : 1 }],
              })}
            >
              <Ionicons name="play" size={18} color="black" />
              <AppText
                className="ml-2 text-base"
                style={{ color: "black", fontFamily: "InterBold" }}
              >
                Watch Now
              </AppText>
            </Pressable>
          </LinearGradient>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="absolute left-5 h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/35"
            style={{ top: 14 }}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </Pressable>
        </View>

        <View className="px-5">
          <View className="flex-row gap-3">
            <DetailStat
              icon="star-outline"
              label="Rating"
              value={movie.rating.toFixed(1)}
              colors={colors}
            />
            <DetailStat
              icon="time-outline"
              label="Duration"
              value={formatRuntime(movie.runtime)}
              colors={colors}
            />
            <DetailStat
              icon="calendar-outline"
              label="Release"
              value={releaseYear(movie.releaseDate)}
              colors={colors}
            />
          </View>

          <View
            className="mt-6 rounded-3xl border p-5"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <AppText
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: colors.primary }}
            >
              Genres
            </AppText>
            <AppText
              className="mt-2 text-sm font-semibold"
              style={{ color: colors.text }}
            >
              {genres || "Not available"}
            </AppText>

            <AppText
              className="mt-6 text-xs font-bold uppercase tracking-widest"
              style={{ color: colors.primary }}
            >
              Storyline
            </AppText>
            <AppText
              className="mt-2 text-sm leading-6"
              style={{ color: colors.mutedText }}
            >
              {movie.overview || "No overview available for this title."}
            </AppText>
          </View>
        </View>

        {movie.cast.length > 0 ? (
          <View className="mt-8">
            <View className="px-5">
              <AppText variant="title" style={{ color: colors.text }}>
                Featured Cast
              </AppText>
            </View>
            <FlatList
              data={movie.cast}
              horizontal
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCast}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16 }}
              initialNumToRender={5}
              maxToRenderPerBatch={6}
              windowSize={5}
            />
          </View>
        ) : null}

        <HorizontalSection
          title="Similar Movies"
          data={similarMovies}
          isLoading={isSimilarLoading}
          isError={isSimilarError}
          onRetry={refetchSimilar}
          onMoviePress={handleMoviePress}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
