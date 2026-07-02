import { AppText } from "@/components/ui/AppText";
import { useAppTheme } from "@/providers/AppThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { ExploreFilter, exploreFilters } from "./exploreFilters";

interface ExploreFilterChipProps {
  filter: (typeof exploreFilters)[number];
  selected: boolean;
  onPress: (filter: ExploreFilter) => void;
}

export function ExploreFilterChip({
  filter,
  selected,
  onPress,
}: ExploreFilterChipProps) {
  const { colors, isDark } = useAppTheme();

  const backgroundColor = selected
    ? isDark
      ? "rgba(79, 140, 255, 0.16)"
      : "rgba(37, 99, 235, 0.12)"
    : isDark
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.04)";

  const borderColor = selected
    ? colors.primary
    : isDark
      ? "rgba(255, 255, 255, 0.12)"
      : "rgba(0, 0, 0, 0.08)";

  const textColor = selected ? colors.primary : colors.mutedText;

  return (
    <Pressable
      onPress={() => onPress(filter.id)}
      className="mr-2 h-10 flex-row items-center rounded-full px-4"
      style={({ pressed }) => ({
        backgroundColor,
        borderWidth: 1,
        borderColor,
        opacity: pressed ? 0.78 : 1,
      })}
    >
      <Ionicons name={filter.icon} size={15} color={textColor} />
      <AppText className="ml-2 text-xs font-bold" style={{ color: textColor }}>
        {filter.title}
      </AppText>
    </Pressable>
  );
}
