import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Info() {
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/Locked-In-Logo.png')}
            style={styles.logoImage}
          />
          <Text style={styles.logoText}>locked in</Text>
        </View>
        <Text style={styles.labelText}>SETTINGS</Text>
      </View>

      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 80,
  },
  logoContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  logoImage: {
    height: 60,
    width: 55,
    left: 0,
  },
  logoText: {
    fontFamily: 'JockeyOne',
    fontSize: 25,
    color: '#7C81FC',
    top: 13,
    left: -8,
  },
  labelText: {
    fontFamily: 'aldrich',
    fontSize: 18,
    color: '#fff',
    marginHorizontal: 18,
    top: 4,
  },
});