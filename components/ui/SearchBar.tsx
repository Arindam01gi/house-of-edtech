import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

export default function SearchBar() {
  return (
    <View className="flex-row items-center rounded-2xl bg-zinc-800 px-4 py-3">
      <Ionicons
        name="search"
        size={20}
        color="#A1A1AA"
      />

      <TextInput
        placeholder="Search courses..."
        placeholderTextColor="#A1A1AA"
        className="ml-3 flex-1 text-white"
      />
    </View>
  );
}