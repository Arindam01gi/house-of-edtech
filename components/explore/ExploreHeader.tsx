import { AppText } from "@/components/ui/AppText";
import SearchBar from "@/components/ui/SearchBar";
import { useAppTheme } from "@/providers/AppThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { ExploreFilter } from "./exploreFilters";
import { ExploreFilterBar } from "./ExploreFilterBar";

interface ExploreHeaderProps {
  search: string;
  onSearchChange: (text: string) => void;
  onClearSearch: () => void;
  selectedFilter: ExploreFilter;
  onFilterSelect: (filter: ExploreFilter) => void;
  resultCount: number;
}

export function ExploreHeader({
  search,
  onSearchChange,
  onClearSearch,
  selectedFilter,
  onFilterSelect,
  resultCount,
}: ExploreHeaderProps) {
  const { colors } = useAppTheme();

  return (
    <View className="pb-5">
      {/* Page title */}
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
      </View>

      {/* Search input */}
      <View className="px-5">
        <SearchBar
          value={search}
          onChangeText={onSearchChange}
          placeholder="Search movies"
          returnKeyType="search"
        />
      </View>

      {/* Filter chips */}
      <ExploreFilterBar
        selectedFilter={selectedFilter}
        onSelect={onFilterSelect}
      />

      {/* Result count + clear button */}
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
            {resultCount} results
          </AppText>
        </View>

        {search.trim() ? (
          <Pressable
            onPress={onClearSearch}
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
  );
}
