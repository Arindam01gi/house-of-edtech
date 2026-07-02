import { useCallback } from "react";
import { FlatList } from "react-native";
import { ExploreFilter, exploreFilters } from "./exploreFilters";
import { ExploreFilterChip } from "./ExploreFilterChip";

interface ExploreFilterBarProps {
  selectedFilter: ExploreFilter;
  onSelect: (filter: ExploreFilter) => void;
}

export function ExploreFilterBar({
  selectedFilter,
  onSelect,
}: ExploreFilterBarProps) {
  const renderItem = useCallback(
    ({ item }: { item: (typeof exploreFilters)[number] }) => (
      <ExploreFilterChip
        filter={item}
        selected={selectedFilter === item.id}
        onPress={onSelect}
      />
    ),
    [selectedFilter, onSelect],
  );

  return (
    <FlatList
      data={exploreFilters}
      horizontal
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18 }}
    />
  );
}
