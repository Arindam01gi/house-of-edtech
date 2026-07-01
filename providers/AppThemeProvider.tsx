import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

export type AppThemeMode = "dark" | "light";

type AppTheme = {
  mode: AppThemeMode;
  isDark: boolean;
  colors: {
    background: string;
    surface: string;
    elevated: string;
    text: string;
    mutedText: string;
    border: string;
    primary: string;
    tabBar: string;
  };
  setTheme: (mode: AppThemeMode) => void;
  toggleTheme: () => void;
};

const THEMES: Record<
  AppThemeMode,
  Omit<AppTheme, "mode" | "isDark" | "setTheme" | "toggleTheme">
> = {
  dark: {
    colors: {
      background: "#0B0B0F",
      surface: "#14141A",
      elevated: "#1D1D25",
      text: "#FFFFFF",
      mutedText: "#A1A1AA",
      border: "rgba(255, 255, 255, 0.10)",
      primary: "#4F8CFF",
      tabBar: "#111111",
    },
  },
  light: {
    colors: {
      background: "#F7F8FC",
      surface: "#FFFFFF",
      elevated: "#EEF2FF",
      text: "#10121A",
      mutedText: "#626A7A",
      border: "rgba(16, 18, 26, 0.10)",
      primary: "#2563EB",
      tabBar: "#FFFFFF",
    },
  },
};

const AppThemeContext = createContext<AppTheme | null>(null);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<AppThemeMode>("dark");

  const value = useMemo<AppTheme>(() => {
    const isDark = mode === "dark";

    return {
      mode,
      isDark,
      ...THEMES[mode],
      setTheme: setMode,
      toggleTheme: () =>
        setMode((current) => (current === "dark" ? "light" : "dark")),
    };
  }, [mode]);

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const theme = useContext(AppThemeContext);

  if (!theme) {
    throw new Error("useAppTheme must be used inside AppThemeProvider");
  }

  return theme;
}
