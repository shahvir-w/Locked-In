import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Initialize from './Initialize'
import { Redirect } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from "../contexts/ThemeContext";
import { Image, Text } from "react-native";
import { colors } from "../constants/colors";


export default function Index() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode]

  const logoSource = theme.mode === "dark"
    ? require('../assets/images/Locked-In-Logo.png')
    : require('../assets/images/Locked-In-Logo-Light.png');
  
  useEffect(() => {
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem('userUID');
      if (storedUser) {
        setUser(storedUser);
      }
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };

    checkUser();
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: activeColors.backgroundMain,  // Set background based on theme
        }}
      >
        <Image
          source={logoSource}
          style={{
            width: 230,  // Set image width
            height: 200,  // Set image height
          }}
        />
        <Text
          style={{
            fontFamily: 'JockeyOne',
            fontSize: 35,
            color: '#7C81FC',
            top: -50,
          }}
        >
          locked in
        </Text>
      </SafeAreaView>
    );
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
        <Redirect href='./../(tabs)/habits'/>
      ) : (
        <Initialize />
      )}
    </SafeAreaView>
  );
}