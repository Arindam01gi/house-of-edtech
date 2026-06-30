import { Ionicons } from "@expo/vector-icons";

export interface Category {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}
