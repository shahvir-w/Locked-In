import { View, Text, StyleSheet, Image, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import CircularProgress from 'react-native-circular-progress-indicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useMostRecentDate from '../../databaseUtils/FindRecentDate';
import LockedInChart from '../../components/ProgressChart';
import CompletionScoreChart from '../../components/BarChart';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '../../constants/colors';
import { useContext } from 'react';
import { ThemeContext } from '../_layout';
import { fetchUserLockedInScore } from '../../databaseUtils/FirebaseUtils';
import * as Haptics from 'expo-haptics';

export default function Stats() {
  const {theme} = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  
  const mostRecentDate = useMostRecentDate();
  const [score, setScore] = useState(0);
  const [name, setName] = useState('');
  const [daysTillLockedIn, setDaysTillLockedIn] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  
  useEffect(() => {
    // fetch user data when most recent date in database is changed
    const fetchUserData = async () => {
      const uid = await AsyncStorage.getItem('userUID');
      
      if (uid) {
        const name = await AsyncStorage.getItem('userName');

        setName(name);
        const [lockedInScore, streak, daysTillLockedInCalc] = await fetchUserLockedInScore(uid, mostRecentDate);
        
        setScore(lockedInScore);
        setCurrentStreak(streak);
        setDaysTillLockedIn(daysTillLockedInCalc);

        setIsLoading(false);
      };
    }

    setIsLoading(true);
    fetchUserData();
  }, [mostRecentDate]);

  const pullMe = () => {
    setRefresh(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setTimeout(() => {
      setRefresh(false)
    }, 500)
  }

  return (
    <SafeAreaView style={[styles.main, {backgroundColor: activeColors.backgroundMain}]}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/Locked-In-Logo.png')}
              style={styles.logoImage}
            />
            <Text style={styles.logoText}>locked in</Text>
          </View>
          <Text style={[styles.labelText, {color: activeColors.regular}]}>STATISTICS</Text>
        </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
          refreshing={refresh}
          onRefresh={() => pullMe()}
          tintColor={activeColors.regular}
          colors={[activeColors.regular]}
          />
        }
      >
        
        <View style={styles.progressContainer}>
          {!isLoading && (
            <View>
              <Text style={[styles.progressText, { color: activeColors.regular}]}>
                {name}, you are{'\n'}
              </Text>

              <Text  style={[styles.progressText, 
                    { color: score >= 90 ? "#008000" : 	"#8B0000" }, {marginBottom: 20}]}>
              {score >= 90 ? 'locked in' : 'not locked in'}
              </Text>
            </View>
          )}

          <CircularProgress
            // progress bar
            radius={120}
            value={score}
            progressValueStyle={{
              fontFamily: 'Aldrich',
              color: activeColors.regular,
              fontSize: 30,
            }}
            fontSize={10}
            valueSuffix="%"
            activeStrokeColor="#7C81FC"
            inActiveStrokeColor={activeColors.progressIndicator}
            progressFormatter={(value) => {
              'worklet';
              return value.toFixed(2); // 2 decimal places
            }}
            duration={1400} 
          />

          <Text style={styles.updateText}>score is updated once each day</Text>
        </View>
          
        <View style={styles.lineChart}>
          <LockedInChart/>
        </View>
            
        {daysTillLockedIn > 0 && (
          <Text style={[styles.regularText, {color: activeColors.regular}]}>
            complete 100% of daily tasks {'\n'} for 
            <Text style={styles.purpleText}>
            {' '}{daysTillLockedIn.toString().padStart(2, '0')}
            </Text>
            {' '}{daysTillLockedIn > 1 ? "days" : "day"} to be
            <Text style={styles.purpleText}> locked in</Text>
          </Text>
        )}
        {daysTillLockedIn == 0 && (
          <Text style={[styles.regularText, {color: activeColors.regular}]}>
            keep completing daily {'\n'}tasks to stay
            <Text style={styles.purpleText}> locked in</Text>
          </Text>
        )}
        
        <View style={styles.barChart}>
          <CompletionScoreChart refresh={refresh}/>
        </View>
        
        <View style={styles.currentStreak}>
          <MaterialCommunityIcons name="fire" size={35} color='#7C81FC' />
          <Text style={[styles.regularText, {color: activeColors.regular}]}>
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
    marginHorizontal: 18,
    top: 4,
  },
  updateText: {
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
    fontSize: 25,
    textAlign: 'center',
  },
  regularText: {
    fontFamily: 'Aldrich',
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