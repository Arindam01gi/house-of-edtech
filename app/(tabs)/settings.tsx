import Container from "@/components/common/Container";
import { AppText } from "@/components/ui/AppText";
import { useAppTheme } from "@/providers/AppThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useAppTheme();

  const knobStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(isDark ? 22 : 2, { duration: 200 }),
        },
      ],
    };
  });

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
          className="mt-8 rounded-3xl border p-5"
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
            Adjust the theme of House of EdTech.
          </AppText>

          <Pressable
            onPress={toggleTheme}
            accessibilityRole="button"
            accessibilityLabel="Toggle Dark Mode"
            className="mt-5 flex-row items-center justify-between rounded-2xl border p-4"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
            }}
          >
            <View className="flex-row items-center">
              <View
                className="h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: colors.surface }}
              >
                <Ionicons
                  name={isDark ? "moon" : "sunny"}
                  size={22}
                  color={isDark ? colors.primary : "#EAB308"}
                />
              </View>
              <View className="ml-4">
                <AppText
                  className="text-base font-bold"
                  style={{ color: colors.text }}
                >
                  {isDark ? "Dark Mode" : "Light Mode"}
                </AppText>

              </View>
            </View>
            <View
              className="h-7 w-12 justify-center rounded-full"
              style={{
                backgroundColor: isDark ? colors.primary : "rgba(0, 0, 0, 0.15)",
              }}
            >
              <Animated.View
                className="h-6 w-6 rounded-full bg-white shadow-sm"
                style={knobStyle}
              />
            </View>
          </Pressable>
        </View>
      </View>
    </Container>
  );
}

