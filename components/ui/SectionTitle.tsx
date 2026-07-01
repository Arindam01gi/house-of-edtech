import { useAppTheme } from "@/providers/AppThemeProvider";
import { View } from "react-native";
import { AppText } from "./AppText";

type Props = {
  title: string;
};

export default function SectionTitle({ title }: Props) {
  const { colors } = useAppTheme();

  return (
    <View className="mb-4 mt-8">
      <AppText variant="title" style={{ color: colors.text }}>
        {title}
      </AppText>
    </View>
  );
}
