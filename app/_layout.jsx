import { Stack } from "expo-router";
import { TransitionPresets } from '@react-navigation/stack';
import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = createContext();

export default function RootLayout() {

  const [theme, setTheme] = useState({ mode: "dark" });

  useEffect(() => {
    const checkTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('userTheme');
      if (storedTheme) {
        setTheme({ mode: storedTheme });
      }
    };

    checkTheme();
    }, []);

  const updateTheme = async (newTheme) => {
    let mode;
    if (!newTheme) {
      mode = theme.mode === "dark" ? "light" : "dark";
      newTheme = { mode };
    }
    console.log(newTheme);
    await AsyncStorage.setItem('userTheme', newTheme.mode);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{theme, updateTheme}}>
    <Stack screenOptions={{
      headerShown: false,
      gestureEnabled: false,
      lazy: false
    }}>
      <Stack.Screen 
      name="(tabs)" 
      options={{
        animation: 'none',
      }}
      />
      <Stack.Screen 
        name="create-habits" 
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="scoreCalculationExp" 
        options={{
          gestureEnabled: true 
        }}
      />
    </Stack>
    </ThemeContext.Provider>
  );
}