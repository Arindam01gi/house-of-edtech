import MovieCard from "@/components/home/MovieCard";
import LoadingSkeleton from "@/components/home/LoadingSkeleton";
import { AppText } from "@/components/ui/AppText";
import SectionTitle from "@/components/ui/SectionTitle";
import { useAppTheme } from "@/providers/AppThemeProvider";
import { Movie } from "@/types/movie";
import { Ionicons } from "@expo/vector-icons";
import React, { memo, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  View,
} from "react-native";

type Props = {
  title: string;
  data?: Movie[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onMoviePress?: (movie: Movie) => void;
};

const ITEM_WIDTH = 156;
const ITEM_GAP = 14;

function SectionState({
  title,
  message,
  actionLabel,
  onAction,
  loading,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  loading?: boolean;
}) {
  const { colors } = useAppTheme();

  return (
    <View
      className="mx-5 h-40 items-center justify-center rounded-3xl border px-5"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Ionicons name="film-outline" size={28} color={colors.mutedText} />
      )}
      <AppText
        className="mt-3 text-center text-sm font-bold"
        style={{ color: colors.text }}
      >
        {title}
      </AppText>
      <AppText
        className="mt-1 text-center text-xs leading-5"
        style={{ color: colors.mutedText }}
      >
        {message}
      </AppText>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          className="mt-4 rounded-xl border px-4 py-2"
          style={{
            backgroundColor: colors.elevated,
            borderColor: colors.border,
          }}
        >
          <AppText className="text-xs font-bold" style={{ color: colors.text }}>
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

function HorizontalSection({
  title,
  data = [],
  isLoading = false,
  isError = false,
  onRetry,
  onMoviePress,
}: Props) {
  const renderItem: ListRenderItem<Movie> = useCallback(
    ({ item }) => <MovieCard movie={item} onPress={onMoviePress} />,
    [onMoviePress],
  );

  const keyExtractor = useCallback((item: Movie) => item.id.toString(), []);

  return (
    <View>
      <View className="px-5">
        <SectionTitle title={title} />
      </View>

      {isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <SectionState
          title="Could not load this section"
          message="Something went wrong while loading movies and web series."
          actionLabel="Retry"
          onAction={onRetry}
        />
      ) : data.length === 0 ? (
        <SectionState
          title="Nothing here yet"
          message="New movies and web series will appear in this row soon."
        />
      ) : (
        <FlatList
          data={data}
          horizontal
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: ITEM_GAP }}
          getItemLayout={(_, index) => ({
            length: ITEM_WIDTH + ITEM_GAP,
            offset: (ITEM_WIDTH + ITEM_GAP) * index,
            index,
          })}
          initialNumToRender={4}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={50}
          windowSize={5}
          removeClippedSubviews
        />
      )}
    </View>
  );
}

export default memo(HorizontalSection);
