import { View, Text, StyleSheet, Image, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import CircularProgress from 'react-native-circular-progress-indicator';
import { getDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../configs/FirebaseConfig';
import useMostRecentDate from '../../backend/FindRecentDate';
import { calculateDaysToLockedIn } from '../../backend/CreateDays';
import LockedInChart from '../../components/ProgressChart';
import CompletionScoreChart from '../../components/BarChart';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

export default function Stats() {
  const router = useRouter();
  const mostRecentDate = useMostRecentDate();
  const [score, setScore] = useState(0);
  const [name, setName] = useState('');
  const [daysTillLockedIn, setDaysTillLockedIn] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  
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
        const dateRef = doc(db, 'users', uid, 'days', mostRecentDate);
        const dateSnap = await getDoc(dateRef);
        if (dateSnap.exists()) {
          const dateData = dateSnap.data();
          lockedInScore = dateData.lockedInScore
          streak = dateData.streak
          setCurrentStreak(streak)

          daysTillLockedInCalc = calculateDaysToLockedIn(lockedInScore, streak);
          setDaysTillLockedIn(daysTillLockedInCalc)
          setScore(lockedInScore);
        }
      }
    };

    fetchUserData();
  }, [mostRecentDate]);

  const [refresh, setRefresh] = useState(false);
  const pullMe = () => {
    setRefresh(true)

    
    setTimeout(() => {
      setRefresh(false)
    }, 500)
  }

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
      <ScrollView 
      refreshControl={
        <RefreshControl
        refreshing={refresh}
        onRefresh={() => pullMe()}
        />
      }
      showsVerticalScrollIndicator={false}>
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

          <Text style={styles.deleteText}>score is updated once each day</Text>
          </View>
          
          <View style={styles.lineChart}>
            <LockedInChart/>
          </View>
            
          {daysTillLockedIn > 0 && (
            <Text style={styles.regularText}>
            complete 100% of daily tasks {'\n'} for 
            <Text style={styles.purpleText}>
            {' '}{daysTillLockedIn.toString().padStart(2, '0')}
            </Text>
            {' '}{daysTillLockedIn > 1 ? "days" : "day"} to be
            <Text style={styles.purpleText}> locked in</Text>
          </Text>
          )}
          {daysTillLockedIn == 0 && (
            <Text style={styles.regularText}>
            keep completing daily {'\n'}tasks to stay
            <Text style={styles.purpleText}> locked in</Text>
          </Text>
          )}
          
          <View style={styles.barChart}>
            <CompletionScoreChart refresh={refresh}/>
          </View>
          <View style={styles.currentStreak}>
          <MaterialCommunityIcons name="fire" size={35} color='#7C81FC' />
          <Text style={styles.regularText}>
            current streak:{' '}
            <Text style={styles.purpleText}>
            {currentStreak <= 0 ? "00" : currentStreak.toString().padStart(2, '0')}
            </Text>
            {' '}{currentStreak > 1 ? "days" : currentStreak == 1 ? "day" : ""}
          </Text>
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
  deleteText: {
    fontFamily: 'aldrich',
    textAlign: 'center',
    fontSize: 15,
    color: '#808080',
    marginTop: 18,
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
  regularText: {
    fontFamily: 'Aldrich',
    color: "#fff",
    fontSize: 18,
    lineHeight: 30,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 25,
  },
  purpleText: {
    color: '#7C81FC',
    fontFamily: 'Aldrich',
    fontSize: 20,
  },
  lineChart: {
    width: 300,
    height: 180,
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 60,
    
  },
  barChart: {
    width: 300,
    height: 180,
    alignSelf: 'center',
    marginBottom: 60,
  },
  currentStreak: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 50,
  }
});