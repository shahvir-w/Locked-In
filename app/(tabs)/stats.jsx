import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import CircularProgress from 'react-native-circular-progress-indicator';
import { getDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../configs/FirebaseConfig';
import useMostRecentDate from '../../backend/FindRecentDate';
import { calculateDaysToLockedIn } from '../../backend/CreateDays';

export default function Stats() {
  const mostRecentDate = useMostRecentDate();
  const [score, setScore] = useState(0);
  const [name, setName] = useState('');
  const [daysTillLockedIn, setDaysTillLockedIn] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const uid = await AsyncStorage.getItem('userUID');
      if (uid) {
        // Fetch user's name
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setName(userData.name.toLowerCase());
        }

        // Fetch lockedInScore
        const date = '2024-08-30';
        const dateRef = doc(db, 'users', uid, 'days', date);
        const dateSnap = await getDoc(dateRef);
        if (dateSnap.exists()) {
          const dateData = dateSnap.data();
          lockedInScore = dateData.lockedInScore
          streak = dateData.streak

          daysTillLockedInCalc = calculateDaysToLockedIn(lockedInScore, streak);
          setDaysTillLockedIn(daysTillLockedInCalc)
          setScore(lockedInScore);
        }
      }
    };

    fetchUserData();
  }, [mostRecentDate]);

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
          <Text style={styles.labelText}>STATISTICS</Text>
        </View>
      <ScrollView>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {name}, you are{'\n'}
          </Text>

          <Text  style={[styles.progressText, 
                { color: score >= 90 ? "#008000" : 	"#8B0000" }, {marginBottom: 20}]}>
          {score >= 90 ? 'locked in' : 'not locked in'}
          </Text>

          <CircularProgress
            radius={120}
            value={score}
            progressValueStyle={{
              fontFamily: 'Aldrich',
              color: '#fff',
              fontSize: 30,
            }}
            fontSize={10}
            valueSuffix="%"
            activeStrokeColor="#7C81FC"
            inActiveStrokeColor="#262323"
            progressFormatter={(value) => {
              'worklet';
              return value.toFixed(2); // 2 decimal places
            }}
            duration={700}
          />

          {daysTillLockedIn > 0 && (
            <Text style={styles.daysText}>
            complete 100% of daily tasks {'\n'} for 
            <Text style={styles.purpleText}>
            {' '}{daysTillLockedIn.toString().padStart(2, '0')}
            </Text>
            {' '}{daysTillLockedIn > 1 ? "days" : "day"} to be
            <Text style={styles.purpleText}> locked in</Text>
          </Text>
          )}
          {daysTillLockedIn == 0 && (
            <Text style={styles.daysText}>
            keep completing daily {'\n'}tasks to stay
            <Text style={styles.purpleText}> locked in</Text>
          </Text>
          )}

        
          </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#000',
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
    fontFamily: 'Aldrich',
    fontSize: 18,
    color: '#fff',
    marginHorizontal: 18,
    top: 4,
  },
  progressContainer: {
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    marginBottom: -10,
    fontFamily: 'Aldrich',
    color: "#fff",
    fontSize: 25,
    textAlign: 'center',
  },
  daysText: {
    fontFamily: 'Aldrich',
    color: "#fff",
    fontSize: 20,
    lineHeight: 35,
    textAlign: 'center',
    marginTop: 20,
  },
  purpleText: {
    color: '#7C81FC',
    fontFamily: 'Aldrich',
    fontSize: 20,
  },
});