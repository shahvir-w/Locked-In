import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { TransitionPresets } from '@react-navigation/stack';
import { useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export default function RootLayout() {

  useFonts({
    'JockeyOne': require('./../assets/fonts/JockeyOne-Regular.ttf'),
    'Aldrich': require('./../assets/fonts/Aldrich-Regular.ttf'),
    'Shippori': require('./../assets/fonts/ShipporiAntiqueB1-Regular.ttf'),
    'Slackey': require('./../assets/fonts/Slackey-Regular.ttf'),
  });

  const [theme, setTheme] = useState({mode: "dark"});
  const updateTheme = (newTheme) => {
    let mode;
    if (!newTheme) {
      mode = theme.mode === "dark" ? "light" : "dark"
      newTheme = {mode};
    }
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{theme, updateTheme}}>
    <Stack screenOptions={{
      headerShown: false,
      gestureEnabled: false,
    }}>
      <Stack.Screen 
      name="(tabs)" 
      />
      <Stack.Screen 
        name="create-habits" 
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          gestureEnabled: true 
        }}
        
      />
    </Stack>
    </ThemeContext.Provider>
  );
}