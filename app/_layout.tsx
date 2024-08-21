import { useFonts } from "expo-font";
import { Stack } from "expo-router";

export default function RootLayout() {

  useFonts({
    'JockeyOne':require('./../assets/fonts/JockeyOne-Regular.ttf'),
    'Aldrich':require('./../assets/fonts/Aldrich-Regular.ttf'),
    'Shippori':require('./../assets/fonts/ShipporiAntiqueB1-Regular.ttf'),
    'Slackey':require('./../assets/fonts/Slackey-Regular.ttf'),
  });

  return (
    <Stack screenOptions={{
      headerShown:false,
      gestureEnabled: false,
    }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}