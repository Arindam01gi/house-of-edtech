import { View } from "react-native";
import { AppText } from "./AppText";

type Props = {
  title: string;
};

export default function SectionTitle({
  title,
}: Props) {
  return (
    <View className="mb-4 mt-8">
      <AppText variant="title">
        {title}
      </AppText>
    </View>
  );
}