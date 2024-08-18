import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
        headerShown:false
    }}>
        <Tabs.Screen name="habits"/>
        <Tabs.Screen name="stats"/>
        <Tabs.Screen name="info"/>
    </Tabs>
  )
}