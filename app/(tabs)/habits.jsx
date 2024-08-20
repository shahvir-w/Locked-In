import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function habits() {
  return (
    <SafeAreaView style={[styles.main]}>
        <View style={styles.container}>
          <Image source={require('../../assets/images/Locked-In-Logo.png')}
            style={{
                height: 60,
                width: 55,
                left: 0,
            }}
          />
          <View>
            <Text style={{
                fontFamily: 'JockeyOne',
                fontSize: 25,
                color: '#7C81FC',
                top:13,
                left: -12,
            }}>locked in</Text>
          </View>
        </View>

      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.BLACK,
  },
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    top: -360,
    left: -115,
  }
});