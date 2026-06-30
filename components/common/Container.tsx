import { Theme } from "@/theme";
import { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor:  Theme.colors.background }}
    >
      {children}
    </SafeAreaView>
  );
}