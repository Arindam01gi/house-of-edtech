import { AppText } from "@/components/ui/AppText";
import { useAppTheme } from "@/providers/AppThemeProvider";
import { Category } from "@/types/category";
import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Pressable, View } from "react-native";

type Props = {
  category: Category;
  selected?: boolean;
  onPress?: (category: Category) => void;
};

function CategoryChip({ category, selected = false, onPress }: Props) {
  const { colors, isDark } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Category ${category.title}`}
      onPress={() => onPress?.(category)}
      style={({ pressed }) => [
        { transform: [{ scale: pressed ? 0.96 : 1 }] },
        selected
          ? {
              borderColor: colors.primary,
              backgroundColor: isDark ? "rgba(79, 140, 255, 0.20)" : "#DBEAFE",
            }
          : { borderColor: colors.border, backgroundColor: colors.surface },
      ]}
      className="mr-3 flex-row items-center rounded-2xl border px-4 py-3"
    >
      <View
        className="mr-2 h-7 w-7 items-center justify-center rounded-full"
        style={{
          backgroundColor: isDark ? "rgba(255, 255, 255, 0.10)" : "#EEF2FF",
        }}
      >
        <Ionicons
          name={category.icon}
          size={15}
          color={selected ? colors.primary : colors.mutedText}
        />
      </View>
      <AppText
        className={selected ? "text-sm font-bold" : "text-sm font-semibold"}
        style={{ color: selected ? colors.text : colors.mutedText }}
      >
        {category.title}
      </AppText>
    </Pressable>
  );
}

export default memo(CategoryChip);
