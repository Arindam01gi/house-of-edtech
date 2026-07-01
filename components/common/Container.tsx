import { useAppTheme } from "@/providers/AppThemeProvider";
import { ReactNode } from "react";
import { SafeAreaView, Edge } from "react-native-safe-area-context";

type ContainerProps = {
  children: ReactNode;
  edges?: Edge[];
};

export default function Container({ children, edges }: ContainerProps) {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
}
