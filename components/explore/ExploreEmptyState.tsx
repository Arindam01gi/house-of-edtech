import { AppText } from "@/components/ui/AppText";
import { useAppTheme } from "@/providers/AppThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";

interface ExploreEmptyStateProps {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function ExploreEmptyState({
  isLoading,
  isError,
  onRetry,
}: ExploreEmptyStateProps) {
  const { colors } = useAppTheme();

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
          onPress={onRetry}
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
}
