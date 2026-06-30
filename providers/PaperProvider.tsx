import { PropsWithChildren } from "react";
import {
    MD3DarkTheme,
    PaperProvider as Provider,
} from "react-native-paper";

export function PaperProvider({ children }: PropsWithChildren) {
  return (
    <Provider theme={MD3DarkTheme}>
      {children}
    </Provider>
  );
}