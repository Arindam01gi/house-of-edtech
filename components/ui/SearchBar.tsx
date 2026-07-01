import { useAppTheme } from "@/providers/AppThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps;

export default function SearchBar(props: Props) {
  const { colors } = useAppTheme();

  return (
    <View
      className="flex-row items-center rounded-3xl border px-5 py-4"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <Ionicons name="search" size={22} color={colors.mutedText} />

      <TextInput
        placeholder="Search movies and web series..."
        placeholderTextColor={colors.mutedText}
        className="ml-3 flex-1 text-base font-semibold"
        style={{ color: colors.text }}
        {...props}
      />
    </View>
  );
}
