import { AppText } from "@/components/ui/AppText";
import { View, Pressable, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


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
