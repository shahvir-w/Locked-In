import React from 'react'
import { Tabs } from 'expo-router'
import { TabBar } from "./../../components/TabBar"

export default function TabLayout() {
  return (
    <Tabs tabBar={props => <TabBar {...props} />} screenOptions={{headerShown: false}}>
      <Tabs.Screen name="habits" options={{ title: "Habits"}}/>
      <Tabs.Screen name="stats" options={{ title: "Stats"}}/>
      <Tabs.Screen name="info" options={{ title: "Settings"}}/>
    </Tabs>
  )
}