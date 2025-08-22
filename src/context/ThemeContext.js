// src/context/ThemeContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DefaultTheme as NavLight,
  DarkTheme as NavDark,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Palettes from "../constants/Colors";

const STORAGE_KEY = "appTheme"; // 'light' | 'dark'

// --- Create Context ---
const ThemeContext = createContext({
  themeName: "light",
  colors: Palettes.light,
  toggleTheme: () => {},
  setTheme: () => {},
  navTheme: NavLight,
});

// --- Helper to build nav theme from palette ---
const buildNavTheme = (palette, base) => ({
  ...base,
  colors: {
    ...base.colors,
    primary: palette.primary,
    background: palette.background,
    card: palette.card ?? palette.surface,
    text: palette.textPrimary,
    border: palette.border,
    notification: palette.accentOrange ?? base.colors.notification,
  },
});

// --- Provider component ---
export function ThemeProvider({ children }) {
  const system = useColorScheme(); // 'light' | 'dark' | null
  const [themeName, setThemeName] = useState(system || "light");

  // Load saved theme preference (or fallback to system)
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        setThemeName(saved);
      } else {
        setThemeName(system || "light");
      }
    })();
  }, [system]);

  const colors = themeName === "dark" ? Palettes.dark : Palettes.light;

  const navTheme = useMemo(
    () => buildNavTheme(colors, themeName === "dark" ? NavDark : NavLight),
    [colors, themeName]
  );

  const setTheme = async (next) => {
    setThemeName(next);
    await AsyncStorage.setItem(STORAGE_KEY, next);
  };

  const toggleTheme = async () => {
    const next = themeName === "light" ? "dark" : "light";
    setThemeName(next);
    await AsyncStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <ThemeContext.Provider value={{ themeName, colors, toggleTheme, setTheme, navTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// --- Hook for easier usage ---
export const useAppTheme = () => useContext(ThemeContext);
export default ThemeContext;
