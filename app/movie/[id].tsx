import HorizontalSection from "@/components/home/HorizontalSection";
import LoadingSkeleton from "@/components/home/LoadingSkeleton";
import { AppText } from "@/components/ui/AppText";
import { useMovieDetails, useSimilarMovies } from "@/hooks/useMovieDetails";
import { Movie } from "@/types/movie";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-1 rounded-2xl border border-white/10 bg-[#14141A] px-3 py-4">
      <Ionicons name={icon} size={18} color="#4F8CFF" />
      <AppText className="mt-3 text-xs font-medium text-zinc-500">
        {label}
      </AppText>
      <AppText className="mt-1 text-sm font-bold text-white" numberOfLines={1}>
        {value}
      </AppText>
    </View>
  );
}

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const movieId = Number(id);

  const {
    data: movie,
    isLoading,
    isError,
    refetch,
  } = useMovieDetails(movieId);

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

  const renderCast: ListRenderItem<NonNullable<typeof movie>["cast"][number]> =
    useCallback(({ item }) => {
      return (
        <View className="mr-4 w-24">
          <View className="h-24 w-24 overflow-hidden rounded-2xl bg-[#14141A]">
            {item.avatar ? (
              <Image
                source={{ uri: item.avatar }}
                style={{ flex: 1 }}
                contentFit="cover"
                transition={180}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Ionicons name="person-outline" size={28} color="#71717A" />
              </View>
            )}
          </View>
          <AppText className="mt-2 text-xs font-bold text-white" numberOfLines={1}>
            {item.name}
          </AppText>
          <AppText className="mt-1 text-[11px] text-zinc-500" numberOfLines={1}>
            {item.character}
          </AppText>
        </View>
      );
    }, []);

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#0B0B0F]">
        <LoadingSkeleton variant="detail" />
      </View>
    );
  }

  if (isError || !movie) {
    return (
      <View
        className="flex-1 items-center justify-center bg-[#0B0B0F] px-6"
        style={{ paddingTop: insets.top }}
      >
        <Ionicons name="alert-circle-outline" size={54} color="#EF4444" />
        <AppText className="mt-4 text-center text-lg font-bold text-white">
          Failed to load movie details
        </AppText>
        <AppText className="mt-2 text-center text-sm leading-5 text-zinc-500">
          Please check your network settings and try again.
        </AppText>
        <View className="mt-6 flex-row gap-3">
          <Pressable
            onPress={() => router.back()}
            className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3"
          >
            <AppText className="font-bold text-white">Go Back</AppText>
          </Pressable>
          <Pressable
            onPress={() => refetch()}
            className="rounded-2xl bg-[#4F8CFF] px-5 py-3"
          >
            <AppText className="font-bold text-white">Retry</AppText>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0B0B0F]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 36 }}
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
              "rgba(11, 11, 15, 0.58)",
              "#0B0B0F",
            ]}
            locations={[0, 0.58, 1]}
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
          </LinearGradient>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="absolute left-5 h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/35"
            style={{ top: insets.top + 10 }}
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
            />
            <DetailStat
              icon="time-outline"
              label="Duration"
              value={formatRuntime(movie.runtime)}
            />
            <DetailStat
              icon="calendar-outline"
              label="Release"
              value={releaseYear(movie.releaseDate)}
            />
          </View>

          <View className="mt-6 rounded-3xl border border-white/10 bg-[#14141A] p-5">
            <AppText className="text-xs font-bold uppercase tracking-widest text-[#4F8CFF]">
              Genres
            </AppText>
            <AppText className="mt-2 text-sm font-semibold text-zinc-200">
              {genres || "Not available"}
            </AppText>

            <AppText className="mt-6 text-xs font-bold uppercase tracking-widest text-[#4F8CFF]">
              Storyline
            </AppText>
            <AppText className="mt-2 text-sm leading-6 text-zinc-400">
              {movie.overview || "No overview available for this title."}
            </AppText>
          </View>
        </View>

        {movie.cast.length > 0 ? (
          <View className="mt-8">
            <View className="px-5">
              <AppText variant="title">Featured Cast</AppText>
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
    </View>
  );
}
