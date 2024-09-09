import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Initialize from './Initialize'
import { Redirect } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from "../contexts/ThemeContext";

export default function Index() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState({mode: "dark"});
  
  const updateTheme = (newTheme) => {
    let mode;
    if (!newTheme) {
      mode = theme.mode === "dark" ? "light" : "dark"
      newTheme = {mode};
    }
    setTheme(newTheme)
  }
  
  useEffect(() => {
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem('userUID');
      if (storedUser) {
        setUser(storedUser);
      }
    };

    checkUser();
  }, []);

  return (
    <ThemeContext.Provider value={{theme, updateTheme}}>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {user ? (
          <Redirect href='./../(tabs)/habits'/>
        ) : (
          <Initialize />
        )}
      </SafeAreaView>
    </ThemeContext.Provider>
  );
}