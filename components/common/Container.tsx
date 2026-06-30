import { Theme } from "@/theme";
import { ReactNode } from "react";
import { SafeAreaView, Edge } from "react-native-safe-area-context";

interface ContainerProps {
  children: ReactNode;
  edges?: Edge[];
}

export default function Container({ children, edges }: ContainerProps) {
  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor:  Theme.colors.background }}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
}