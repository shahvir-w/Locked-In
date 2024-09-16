import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '@/constants/colors'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../configs/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserName } from '../../../databaseUtils/FirebaseUtils';
import * as Haptics from 'expo-haptics';

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [warning, setWarning] = useState("");

  const OnSignIn = async () => {
    if (!email || !password) {
      setWarning('Please enter email and password');
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Storing user ID in AsyncStorage
      await AsyncStorage.setItem('userUID', user.uid);

      // Storing user name in AsyncStorage
      const name = await fetchUserName(user.uid);
      await AsyncStorage.setItem('userName', name);

      if (user) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        await new Promise(resolve => setTimeout(resolve, 200));
        router.replace('/habits');
    }
    } catch(error) {
      const errorMessage = error.message;
      if (errorMessage.includes('auth/invalid-email')) {
        setWarning('Invalid email');
      } else if (errorMessage.includes('auth/invalid-credential')) {
        setWarning('Email or password is incorrect');
      } else {
        setWarning('Sign-in failed. Please try again.');
      }
      console.log(errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
    <LinearGradient
      colors={['#3b3b3b', 'black', '#3b3b3b']}
      style={styles.linearGradient}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <SafeAreaView style={[styles.main]}>
        <View style={styles.container}>
          <Image source={require('../../../assets/images/Locked-In-Logo.png')}
            style={{
                height: 96,
                width: 88,
                left: 0,
            }}
          />
          <View >
            <Text style={{
                fontFamily: 'JockeyOne',
                fontSize: 41,
                color: colors.PURPLE,
                top: 18,
                left: -12,
            }}>locked in</Text>
          </View>
        </View>
        
        <View>
          <Text style={{
              fontFamily: 'Aldrich',
              fontSize: 32,
              color: colors.PURPLE,
              textAlign: 'center',
              top: -60,
          }}>welcome back!</Text>
          
            <Text style={{
                fontFamily: 'Shippori',
                fontSize: 17,
                color: colors.PURPLE,
                left: 10,
                textAlign: 'left',
                top: -25,
            }}>Email</Text>
            <TextInput 
              style={[styles.input]}
              placeholder="Enter your email"
              onChangeText={(text) => setEmail(text)}
            />

            <Text style={{
                fontFamily: 'Shippori',
                fontSize: 17,
                color: colors.PURPLE,
                left: 10,
                textAlign: 'left',
                top: -10,
            }}>Password</Text>
            <TextInput 
              style={[styles.input, { top: -10 }]}
              placeholder="Enter password"
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              />
          
          {warning.length > 0 && (
            <Text style={styles.warningText}>
            {warning}
            </Text>
          )}
        
          <TouchableOpacity style={styles.button}
            onPress={OnSignIn}
          >
            <Text style={{
              fontFamily: 'Shippori',
              fontSize: 14,
              textAlign: 'center',
              color: colors.WHITE,
            }}>sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button2}
              onPress={() => {
                router.push('auth/sign-up');
              }}
          >
            <Text style={{
              fontFamily: 'Shippori',
              fontSize: 14,
              textAlign: 'center',
              color: colors.WHITE,
            }}>create account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  arrow: {
    left: -140,
    top: -30,
  },
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
    top: -115,
  },
  container: {
    flexDirection: 'row',
    marginBottom: 80,
    alignSelf: 'center',
  },
  input: {
    placeholderTextColor:"#949494",
    selectionColor:"#949494",
    fontFamily: 'Shippori',
    fontSize: 14,
    color: "#949494",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.PURPLE,
    height: 40,
    width: 320,
    alignSelf: 'center',
    borderRadius: 15,
    top: -25,
  },
  button: {
    backgroundColor: colors.PURPLE,
    height: 54,
    width: 320,
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 25,
    justifyContent: 'center',
    top: -10,
  },
  button2: {
    borderColor: colors.PURPLE,
    borderWidth: 2,
    height: 54,
    width: 320,
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 35,
    justifyContent: 'center',
    top: -25,
  },
  warningText: {
    color: 'red',
    marginTop: 5,
    alignSelf: 'center',
    fontFamily: 'Shippori',
  }
}); 