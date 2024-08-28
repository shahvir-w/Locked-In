import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import EmptyHabits from '../../components/EmptyHabits';
import HabitsScrollView from '../../components/HabitsScrollView';
import { db } from '../../configs/FirebaseConfig';
import { collection, query, onSnapshot } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useMostRecentDate from '../../backend/FindRecentDate';
import useDuplicateHabits from '../../backend/DuplicateHabits';

export default function Habits() {
  const [userHabits, setUserHabits] = useState([]);
  const [remainingTasks, setRemainingTasks] = useState(0);
  const mostRecent = useMostRecentDate();
  const today = new Date().toLocaleDateString('en-CA');

  // useDuplicateHabits(mostRecent, today);

  useEffect(() => {
    const loadHabits = async () => {
      const uid = await AsyncStorage.getItem('userUID');
      if (uid) {
        const habitsRef = collection(db, 'users', uid, 'days', today, 'habits');
        
        const q = query(habitsRef);
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const habits = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserHabits(habits);
          setRemainingTasks(habits.filter(habit => !habit.isChecked).length);
        });

        return () => unsubscribe(); // Clean up listener on component unmount
      }
    };

    loadHabits();
  }, []);

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
          <TouchableOpacity>
            <AntDesign name="left" size={20} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.dateText}>today</Text>

          <TouchableOpacity>
            <AntDesign name="right" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {userHabits.length === 0 ? (
        <EmptyHabits />
      ) : (
        <HabitsScrollView habits={userHabits} remainingTasks={remainingTasks}/>
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