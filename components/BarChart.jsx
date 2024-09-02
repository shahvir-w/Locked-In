import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { ruleTypes } from 'gifted-charts-core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../configs/FirebaseConfig';
import AntDesign from '@expo/vector-icons/AntDesign';
import useOldestDate from '../backend/FindOldestDate';
import Habit from './Habit';

export default function CompletionScoreChart() {
  const [barData, setBarData] = useState([
    { value: 0, label: 'M' },
    { value: 0, label: 'T' },
    { value: 0, label: 'W' },
    { value: 0, label: 'T' },
    { value: 0, label: 'F' },
    { value: 0, label: 'S' },
    { value: 0, label: 'S' }
  ]);

  const today = new Date();
  const [day, setDay] = useState(today);
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const oldestDate = useOldestDate();

  const determineDate = (selectedDay) => {
    const dayOfWeek = selectedDay.getDay();
    const startOfWeek = new Date(selectedDay);
    startOfWeek.setDate(selectedDay.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const options = { month: 'long', day: 'numeric' };
    setStartDay(startOfWeek.toLocaleDateString('en-US', options));
    setEndDay(endOfWeek.toLocaleDateString('en-US', options));

    return startOfWeek;
  }

  const handleDateLeft = () => {
    const newDate = new Date(day);
    newDate.setDate(day.getDate() - 7); // Move one week back
    if (newDate >= oldestDate) setDate(newDate);
  };

  const handleDateRight = () => {
    const newDate = new Date(day);
    newDate.setDate(day.getDate() + 7); // Move one week forward
    if (newDate <= today) setDate(newDate);
  };

  useEffect(() => {
    const fetchCompletionScores = async () => {
      const startOfWeek = determineDate(day);
      const uid = await AsyncStorage.getItem('userUID');
      const updatedBarData = [...barData];

      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);

        const formattedDate = date.toLocaleDateString('en-CA');
        const dateRef = doc(db, 'users', uid, 'days', formattedDate);
        const dateSnap = await getDoc(dateRef);

        if (dateSnap.exists()) {
          const dateData = dateSnap.data();
          const availableScore = dateData.availableScore;
          const completionScore = dateData.completionScore;
          const dayScore = (completionScore / availableScore) * 100
          updatedBarData[i].value = dayScore;
        }
      }

      setBarData(updatedBarData);
    };

    fetchCompletionScores();
  }, [day]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>task completion</Text>

      <View style={styles.dateScroll}>
        <TouchableOpacity onPress={handleDateLeft}
        hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
        >
          <AntDesign name="left" size={20} color="white" style={{top: -6}}/>
        </TouchableOpacity>
        
        <Text style={styles.dateText}>{startDay} - {endDay}</Text>

        <TouchableOpacity onPress={handleDateRight}
        hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
        >
          <AntDesign name="right" size={20} color="white" style={{top: -6}}/>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.chartWrapper, { width: 262.75 }]}>
        <BarChart
            disableScroll
            data={barData}
            height={110}
            width={262.75}
            maxValue={100}
            barBorderTopRightRadius={5}
            barBorderTopLeftRadius={5}
            barWidth={11}
            spacing={24}
            frontColor='#7C81FC'
            initialSpacing={5}  // Added initial space between the line and the x-axis
            noOfSections={4}
            rulesType={ruleTypes.DASHED}
            rulesColor="lightgray"
            rulesLength={225} 
            rulesThickness={1}
            dashWidth={2}
            yAxisThickness={0}
            yAxisTextStyle={{ color: '#B6B6B6' , fontSize: 13}}
            yAxisLabelSuffix="%"
            xAxisThickness={0}
            xAxisLabelTextStyle={{ color: '#B6B6B6' , fontSize: 12}}
            xAxisLabelsVerticalShift={5}
        />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
    backgroundColor: "#161414",
    padding: 20,
    paddingLeft: 22,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Shippori',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: -6,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Shippori',
    color: 'lightgray',
    textAlign: 'center',
    marginBottom: 14,
  },
  dateScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});