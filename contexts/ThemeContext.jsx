import { createContext } from "react";

export const ThemeContext = createContext({
    theme: { mode: "light" },
    updateTheme: () => {},
  });