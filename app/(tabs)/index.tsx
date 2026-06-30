import Container from "@/components/common/Container";
import { AppText } from "@/components/ui/AppText";
import SearchBar from "@/components/ui/SearchBar";
import SectionTitle from "@/components/ui/SectionTitle";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <Container>
      <View className="px-5 pt-6">

        <AppText variant="bodySmall">
          Good Evening 👋
        </AppText>

        <AppText
          variant="h2"
          className="mt-2"
        >
          What do you want to learn today?
        </AppText>

        <View className="mt-6">
          <SearchBar />
        </View>

        <SectionTitle title="Continue Learning" />

        {/* Cards go here */}

        <SectionTitle title="Popular Courses" />

        {/* Cards go here */}

        <SectionTitle title="Categories" />

      </View>
    </Container>
  );
}