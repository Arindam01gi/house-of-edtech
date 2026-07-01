import { AppText } from "@/components/ui/AppText";
import { useAppTheme } from "@/providers/AppThemeProvider";
import { Movie } from "@/types/movie";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { memo, useMemo } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  movie: Movie;
  size?: "poster" | "compact";
  onPress?: (movie: Movie) => void;
};

const CARD_WIDTH = {
  poster: 156,
  compact: 132,
};

function MovieCard({ movie, size = "poster", onPress }: Props) {
  const { colors } = useAppTheme();
  const scale = useSharedValue(1);
  const width = CARD_WIDTH[size];
  const imageHeight = size === "poster" ? 220 : 184;

  const releaseYear = useMemo(
    () => (movie.releaseDate ? movie.releaseDate.split("-")[0] : "New"),
    [movie.releaseDate],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 16, stiffness: 320 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 16, stiffness: 320 });
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${movie.title}`}
      onPress={() => onPress?.(movie)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ width }}
    >
      <Animated.View style={animatedStyle}>
        <View
          className="overflow-hidden rounded-3xl border"
          style={{
            width,
            height: imageHeight,
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <Image
            source={{ uri: movie.poster || movie.backdrop }}
            style={{ flex: 1 }}
            contentFit="cover"
            transition={220}
            cachePolicy="memory-disk"
            recyclingKey={movie.id.toString()}
          />

          <View className="absolute left-2 top-2 flex-row items-center rounded-full bg-black/70 px-2 py-1">
            <Ionicons name="star" size={11} color="#FFC107" />
            <AppText className="ml-1 text-[11px] font-bold text-white">
              {movie.rating.toFixed(1)}
            </AppText>
          </View>
        </View>

        <AppText
          className="mt-3 text-sm font-bold leading-5"
          style={{ color: colors.text }}
          numberOfLines={2}
        >
          {movie.title}
        </AppText>

        <View className="mt-1 flex-row items-center">
          <AppText
            className="text-xs font-medium"
            style={{ color: colors.mutedText }}
          >
            {releaseYear}
          </AppText>
          <View
            className="mx-2 h-1 w-1 rounded-full"
            style={{ backgroundColor: colors.border }}
          />
          <AppText
            className="text-xs font-medium"
            style={{ color: colors.mutedText }}
          >
            Movie
          </AppText>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default memo(MovieCard);
