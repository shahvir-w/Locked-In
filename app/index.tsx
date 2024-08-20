import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Initialize from './../components/Initialize';
import { Redirect } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from "@react-navigation/native";

export default function Index() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      // Check if there's a user in AsyncStorage
      const storedUser = await AsyncStorage.getItem('userUID');
      if (storedUser) {
        setUser(storedUser); // Set the string value
      }
    };

    checkUser();
  }, []);

  return (
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
  );
}