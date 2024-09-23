import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import Initialize from './Initialize';
import { Redirect } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

// Keep the splash screen visible until we manually hide it
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false); // State to track when everything is ready
  
  // Load custom fonts
  const [fontsLoaded] = useFonts({
    'JockeyOne': require('./../assets/fonts/JockeyOne-Regular.ttf'),
    'Aldrich': require('./../assets/fonts/Aldrich-Regular.ttf'),
    'Shippori': require('./../assets/fonts/ShipporiAntiqueB1-Regular.ttf'),
    'Slackey': require('./../assets/fonts/Slackey-Regular.ttf'),
  });

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Check if user is authenticated (retrieve from AsyncStorage)
        const storedUser = await AsyncStorage.getItem('userUID');
        if (storedUser) {
          setUser(storedUser); // Set the user if found
        }

        // Make sure fonts are loaded before hiding the splash screen
        if (fontsLoaded) {
          setIsReady(true); // Mark everything as ready when both conditions are met
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (fontsLoaded) {
          setIsReady(true);
        }
      }
    };

    prepareApp();
  }, [fontsLoaded]);

  useEffect(() => {
    const hideSplash = async () => {
      if (isReady) {
        await SplashScreen.hideAsync(); // Hide the splash screen when everything is ready
      }
    };

    hideSplash();
  }, [isReady]);

  // While waiting for everything to be ready, keep the splash screen active and render nothing
  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {user ? ( // If user is authenticated, redirect to main page
        <Redirect href='./../(tabs)/habits'/>
      ) : ( // Otherwise, show Initialize screen
        <Initialize />
      )}
    </SafeAreaView>
  );
}