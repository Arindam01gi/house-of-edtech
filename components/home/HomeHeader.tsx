import { AppText } from "@/components/ui/AppText";
import { View, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

type HeaderButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  badge?: boolean;
};

function HeaderButton({ icon, onPress, badge }: HeaderButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={animatedStyle}>
        <View
          style={{ borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.20)" }}
          className="relative items-center justify-center w-10 h-10 rounded-full bg-white/10"
        >
          <Ionicons name={icon} size={20} color="#FFFFFF" />
          {badge && (
            <View
              style={{ borderWidth: 1, borderColor: "black" }}
              className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500"
            />
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function HomeHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top + 8,
        backgroundColor: "rgba(11, 11, 15, 0.82)",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.08)",
      }}
      className="flex-row items-center justify-between px-5 pb-4"
    >
      {/* Branding Logo */}
      <View>
        <AppText
          variant="h3"
          style={{ letterSpacing: -0.5, fontFamily: "InterBold" }}
          className="text-white"
        >
          HOUSE OF{" "}
          <AppText style={{ color: "#4F8CFF", fontFamily: "InterBold" }}>
            EDTECH
          </AppText>
        </AppText>
      </View>

      {/* Right controls */}
      <View className="flex-row items-center gap-3">
        <HeaderButton
          icon="search-outline"
          onPress={() => console.log("Search pressed")}
        />
        <HeaderButton
          icon="notifications-outline"
          badge
          onPress={() => console.log("Notifications pressed")}
        />

        {/* Profile Avatar */}
        <Pressable
          onPress={() => console.log("Profile pressed")}
          className="active:scale-95 transition-transform"
        >
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=12" }}
            className="w-10 h-10 rounded-full border border-[#4F8CFF]/50"
            resizeMode="cover"
          />
        </Pressable>
      </View>
    </View>
  );
}
