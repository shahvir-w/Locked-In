import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import Initialize from './Initialize';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { ThemeContext } from "./_layout";
import { colors } from "../constants/colors";

export default function Index() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const [fontsLoaded] = useFonts({
    'JockeyOne': require('./../assets/fonts/JockeyOne-Regular.ttf'),
    'Aldrich': require('./../assets/fonts/Aldrich-Regular.ttf'),
    'Shippori': require('./../assets/fonts/ShipporiAntiqueB1-Regular.ttf'),
    'Slackey': require('./../assets/fonts/Slackey-Regular.ttf'),
  });

  useEffect(() => {
    const prepareApp = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userUID');
        if (storedUser) {
          setUser(storedUser);
        }

        if (fontsLoaded) {
          setIsReady(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    prepareApp();
  }, [fontsLoaded]);

  useEffect(() => {
    const hideSplash = async () => {
      if (isReady) {
        await SplashScreen.hideAsync();
      }
    };

    hideSplash();
  }, [isReady]);

  useEffect(() => {
    if (isReady && user) {
      router.replace('./../(tabs)/habits');
    }
  }, [isReady, user]);

  if (!isReady) {
    return (
      <SafeAreaView style={{ backgroundColor: activeColors.backgroundMain, flex: 1 }}>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: activeColors.backgroundMain,
      }}
    >
      {!user && <Initialize />}
    </SafeAreaView>
  );
}