import { useAppTheme } from "@/providers/AppThemeProvider";
import { PropsWithChildren } from "react";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider as Provider,
} from "react-native-paper";

export function PaperProvider({ children }: PropsWithChildren) {
  const { isDark } = useAppTheme();

  return (
    <Provider theme={isDark ? MD3DarkTheme : MD3LightTheme}>
      {children}
    </Provider>
  );
}
