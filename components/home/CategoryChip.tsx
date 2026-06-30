import { AppText } from "@/components/ui/AppText";
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
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Category ${category.title}`}
      onPress={() => onPress?.(category)}
      style={({ pressed }) => [
        { transform: [{ scale: pressed ? 0.96 : 1 }] },
        selected
          ? { borderColor: "#4F8CFF", backgroundColor: "rgba(79, 140, 255, 0.20)" }
          : { borderColor: "rgba(255, 255, 255, 0.10)" },
      ]}
      className="mr-3 flex-row items-center rounded-2xl border bg-[#14141A] px-4 py-3"
    >
      <View className="mr-2 h-7 w-7 items-center justify-center rounded-full bg-white/10">
        <Ionicons
          name={category.icon}
          size={15}
          color={selected ? "#4F8CFF" : "#D4D4D8"}
        />
      </View>
      <AppText
        className={selected ? "text-sm font-bold text-white" : "text-sm font-semibold text-zinc-300"}
      >
        {category.title}
      </AppText>
    </Pressable>
  );
}

export default memo(CategoryChip);
