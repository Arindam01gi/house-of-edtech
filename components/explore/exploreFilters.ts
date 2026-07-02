import { Ionicons } from "@expo/vector-icons";

export type ExploreFilter = "all" | "top-rated" | "recent" | "underrated";

export const exploreFilters: {
  id: ExploreFilter;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: "all", title: "All", icon: "grid-outline" },
  { id: "top-rated", title: "Top Rated", icon: "star-outline" },
  { id: "recent", title: "Recent", icon: "calendar-outline" },
  { id: "underrated", title: "Underrated", icon: "diamond-outline" },
];
