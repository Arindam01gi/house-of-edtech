import Container from "@/components/common/Container";
import { AppText } from "@/components/ui/AppText";
import { AppThemeMode, useAppTheme } from "@/providers/AppThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

const themeOptions: {
  id: AppThemeMode;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    id: "dark",
    title: "Dark",
    description: "Premium cinema-style interface.",
    icon: "moon-outline",
  },
  {
    id: "light",
    title: "Light",
    description: "Bright interface for daytime viewing.",
    icon: "sunny-outline",
  },
];

export default function SettingsScreen() {
  const { colors, mode, setTheme } = useAppTheme();

  return (
    <Container edges={["top", "left", "right"]}>
      <View className="flex-1 px-5 pt-4">
        <AppText className="text-3xl font-bold" style={{ color: colors.text }}>
          Settings
        </AppText>
        <AppText
          className="mt-1 text-sm font-semibold"
          style={{ color: colors.mutedText }}
        >
          Personalize your app experience
        </AppText>

        <View
          className="mt-8 rounded-3xl border p-4"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <AppText className="text-lg font-bold" style={{ color: colors.text }}>
            Appearance
          </AppText>
          <AppText
            className="mt-1 text-sm leading-5"
            style={{ color: colors.mutedText }}
          >
            Choose how House of EdTech looks on this device.
          </AppText>

          <View className="mt-5 gap-3">
            {themeOptions.map((option) => {
              const selected = mode === option.id;

              return (
                <Pressable
                  key={option.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setTheme(option.id)}
                  className="flex-row items-center rounded-2xl border p-4"
                  style={{
                    backgroundColor: selected
                      ? colors.elevated
                      : colors.background,
                    borderColor: selected ? colors.primary : colors.border,
                  }}
                >
                  <View
                    className="h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <Ionicons
                      name={option.icon}
                      size={22}
                      color={selected ? colors.primary : colors.mutedText}
                    />
                  </View>

                  <View className="ml-4 flex-1">
                    <AppText
                      className="text-base font-bold"
                      style={{ color: colors.text }}
                    >
                      {option.title}
                    </AppText>
                    <AppText
                      className="mt-1 text-xs leading-4"
                      style={{ color: colors.mutedText }}
                    >
                      {option.description}
                    </AppText>
                  </View>

                  {selected ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={colors.primary}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Container>
  );
}
