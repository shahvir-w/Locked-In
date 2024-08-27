import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import EmptyHabits from '../../components/EmptyHabits';
import HabitsScrollView from '../../components/HabitsScrollView';

export default function Habits() {
  const [userHabits, setUserHabits] = useState([["hey", 2]]);

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/Locked-In-Logo.png')}
            style={{
              height: 60,
              width: 55,
              left: 0,
            }}
          />
          <Text style={styles.logoText}>locked in</Text>
        </View>

        <View style={styles.dateScroll}>
          <AntDesign name="left" size={20} color="white" />
          <Text style={styles.dateText}>today</Text>
          <AntDesign name="right" size={20} color="white" />
        </View>
      </View>

      {userHabits.length === 0 ? (
        <EmptyHabits userHabits={userHabits} setUserHabits={setUserHabits}/>
      ) : (
        <HabitsScrollView userHabits={userHabits} setUserHabits={setUserHabits} />
      )}
    </SafeAreaView>
  );
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
  logoText: {
    fontFamily: 'JockeyOne',
    fontSize: 25,
    color: '#7C81FC',
    top: 13,
    left: -8,
  },
  dateScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    left: -15,
  },
  dateText: {
    fontFamily: 'aldrich',
    fontSize: 18,
    color: '#fff',
    marginHorizontal: 6,
    top: 1,
  },
});