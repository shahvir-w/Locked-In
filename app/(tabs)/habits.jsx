import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import EmptyHabits from '../../components/EmptyHabits';
import HabitsScrollView from '../../components/HabitsScrollView';
import { db } from '../../configs/FirebaseConfig';
import { collection, query, onSnapshot } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useOldestDate from '../../backend/FindOldestDate';
import useMostRecentDate from '../../backend/FindRecentDate';
import { initializeFirstDay, duplicateHabits } from '../../backend/CreateDays';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from "../../constants/colors"
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';


export default function Habits() {
  const [userHabits, setUserHabits] = useState([]);
  const [remainingTasks, setRemainingTasks] = useState(0);
  const today = new Date().toLocaleDateString('en-CA');
  const [date, setDate] = useState(today);
  const oldestDate = useOldestDate();
  const mostRecentDate = useMostRecentDate();

  const {theme} = useContext(ThemeContext)
  let activeColors = colors[theme.mode]

  useEffect(() => {
    const checkFirstDay = async () => {
      if (mostRecentDate == "no data") {
        await initializeFirstDay(today);
      }
    };

    checkFirstDay();
  }, [mostRecentDate]);


  useEffect(() => {
    const duplicate = async () => {
      if (mostRecentDate && today !== mostRecentDate && mostRecentDate != "no data") {
        await duplicateHabits(mostRecentDate, today);
      }
    };

    duplicate();
  }, [mostRecentDate, today]);

  const modifyDate = (dateString, days) => {
    const dateParts = dateString.split('-');
    const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const handleDateLeft = () => {
    const newDate = modifyDate(date, -1);
    if (newDate >= oldestDate) setDate(newDate);
  };

  const handleDateRight = () => {
    const newDate = modifyDate(date, 1);
    if (newDate <= today) setDate(newDate);
  };

  useEffect(() => {
    const loadHabits = async () => {
      const uid = await AsyncStorage.getItem('userUID');
      if (uid) {
        const habitsRef = collection(db, 'users', uid, 'days', date, 'habits');
        const q = query(habitsRef);
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const habits = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserHabits(habits);
          setRemainingTasks(habits.filter(habit => !habit.isChecked).length);
        });

        return () => unsubscribe();
      }
    };

    loadHabits();
  }, [date]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={[styles.main, { backgroundColor: activeColors.backgroundMain }]}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/Locked-In-Logo.png')}
              style={styles.logoImage}
            />
            <Text style={styles.logoText}>locked in</Text>
          </View>

          <View style={styles.dateScroll}>
            <TouchableOpacity onPress={handleDateLeft}
            hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
            >
              <AntDesign name="left" size={20} color= {activeColors.regular} />
            </TouchableOpacity>
            
            <Text style={[styles.dateText, { color: activeColors.regular}]}>{date === today ? 'TODAY' : date}</Text>

            <TouchableOpacity onPress={handleDateRight}
            hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
            >
              <AntDesign name="right" size={20} color= {activeColors.regular} />
            </TouchableOpacity>
          </View>
        </View>
        
        {userHabits.length === 0 ? (
          <EmptyHabits date={date} />
        ) : (
          <HabitsScrollView habits={userHabits} remainingTasks={remainingTasks} date={date} />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1
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
  dateScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    left: -15,
    top: 2,
  },
  dateText: {
    fontFamily: 'aldrich',
    fontSize: 18,
    color: '#fff',
    marginHorizontal: 6,
    top: 1,
  },
});