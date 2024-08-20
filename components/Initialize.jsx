import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { Colors } from '@/constants/Colors';
import { useNavigation, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function Initialize() {
  const router = useRouter();

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown:false
    })
  })

  const handleNextPress = async () => {
      router.replace('/auth/sign-in');
  }

  return (
    <LinearGradient
      colors={['#3b3b3b', 'black', '#3b3b3b']}
      style={styles.linearGradient}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView style={styles.main}>
        <View style={styles.container}>
          <Image source={require('./../assets/images/Locked-In-Logo.png')}
            style={{ height: 96, width: 88, left: 0 }}
          />
          <View>
            <Text style={{ fontFamily: 'JockeyOne', fontSize: 41, color: Colors.PURPLE, top: 18, left: -12 }}>
              locked in
            </Text>
          </View>
        </View>

        <Text style={{
            fontFamily: 'Aldrich',
            fontSize: 32,
            color: Colors.PURPLE,
            textAlign: 'center',
            top: -50,
        }}>complete daily {'\n'}goals consistently {'\n'}to be “locked in”</Text>

        <TouchableOpacity style={styles.button} onPress={handleNextPress}>
          <Text style={{ 
            fontFamily: 'Shippori', 
            fontSize: 14,
            textAlign: 'center', 
            color: Colors.WHITE 
            }}>get started!</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 0,
    width: '100%',
    height: '120%',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    top: -20,
  },
  container: {
    flexDirection: 'row',
    marginBottom: 80,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: Colors.PURPLE,
    height: 54,
    width: 320,
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 35,
    justifyContent: 'center',
    top: -35,
  },
});