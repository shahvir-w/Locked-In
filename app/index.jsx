import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Initialize from './Initialize'
import { Redirect } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [user, setUser] = useState(null);

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
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {user ? ( // if user is in async storage, direct him to main page, otherwise sign in
        <Redirect href='./../(tabs)/habits'/>
      ) : (
        <Initialize />
      )}
    </SafeAreaView>
  );
}