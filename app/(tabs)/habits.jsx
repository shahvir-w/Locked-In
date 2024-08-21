import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Habit from '../../components/Habit';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function habits() {
  return (
    <SafeAreaView style={styles.main}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/Locked-In-Logo.png')}
            style={{
                height: 60,
                width: 55,
                left: 0,
            }}
          />
            <Text style={{
                fontFamily: 'JockeyOne',
                fontSize: 25,
                color: '#7C81FC',
                top:13,
                left: -8,
            }}>locked in</Text>
        </View>

        <ScrollView style={styles.ItemsWrapper}>
          <Text style={{
                  fontFamily: 'aldrich',
                  textAlign: 'center',
                  fontSize: 18,
                  color: '#fff',
                  top: 0,
          }}>you have x tasks remaining</Text>
          
          <View style={styles.items}>
            <Habit number={"4"} text={"drink 2 liters of water"} checked={false} />
            <Habit number={"3"} text={"make my bed"} checked={true} />
            <Habit number={"1"} text={"walk the dog"} checked={false} />
          </View>
          
          <Text style={{
                  fontFamily: 'aldrich',
                  textAlign: 'center',
                  fontSize: 14,
                  color: '#808080',
                  marginBottom: 5,
          }}>swipe left on habit to delete</Text>

          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle-sharp" size={55} color="#7C81FC" />
          </TouchableOpacity>
        </ScrollView>
        


      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#000",
  },
  logoContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignSelf: 'center',
    top: 50,
    left: 15,
  },
  ItemsWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  items: {
    alignItems: 'center',
    marginTop: 20, 
  },
  addButton: {
    alignItems: 'center',
  }
});