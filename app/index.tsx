import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Initialize from './../components/Initialize';
import { Redirect } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      // Check if there's a user in AsyncStorage
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    checkUser();
  }, []);

  if (isLoading) {
    return null; // Or some loading indicator
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {user ? (
        <Redirect href='../app/(tabs)/habits'/>
      ) : (
        <Initialize />
      )}
    </SafeAreaView>
  );
}