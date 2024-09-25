import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { ruleTypes } from 'gifted-charts-core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import { colors } from '../constants/colors';
import { useContext } from 'react';
import { ThemeContext } from '../app/_layout';
import { fetchLockedInScores, fetchOldestDate } from '../databaseUtils/FirebaseUtils';

export default function LockedInChart() {
  const {theme} = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const [lineData, setLineData] = useState([]);

  const today = new Date();
  const [day, setDay] = useState(today);
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [oldestDate, setOldestDate] = useState("");

  const determineDate = (selectedDay) => {
    const dayOfWeek = selectedDay.getDay();
    const startOfWeek = new Date(selectedDay);
    startOfWeek.setDate(selectedDay.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const options = { month: 'long', day: 'numeric' };
    setStartDay(startOfWeek.toLocaleDateString(undefined, options));
    setEndDay(endOfWeek.toLocaleDateString(undefined, options));

    return startOfWeek;
  }
  
  const handleDateLeft = () => {
    const newDate = new Date(day);
    newDate.setDate(day.getDate() - 7); // Move one week back
    var diff = newDate.getDate() - newDate.getDay() + (newDate.getDay() === 0 ? -6 : 1);
    dateStartOfWeek = new Date(newDate.setDate(diff));

    const oldest = new Date(oldestDate);

    console.log("oldest", oldest)

    var diff = oldest.getDate() - oldest.getDay()
    oldestStartOfWeek = new Date(oldest.setDate(diff));

    if (dateStartOfWeek.toLocaleDateString() >= oldestStartOfWeek.toLocaleDateString()) setDay(newDate);
    else newDate.setDate(day.getDate() + 7); 
  };

  const handleDateRight = () => {
    const newDate = new Date(day);
    newDate.setDate(day.getDate() + 7); // Move one week forward
    var diff = newDate.getDate() - newDate.getDay() + (newDate.getDay() === 0 ? -6 : 1);
    dateStartOfWeek = new Date(newDate.setDate(diff));

    var diff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
    TodayStartOfWeek = new Date(today.setDate(diff));

    if (dateStartOfWeek.toLocaleDateString() <= TodayStartOfWeek.toLocaleDateString()) setDay(newDate);
    else newDate.setDate(day.getDate() - 7);
  };

  useEffect(() => {
    const fetchScores = async () => {
      const uid = await AsyncStorage.getItem('userUID');
      const startOfWeek = determineDate(day);
      await fetchLockedInScores(uid, setLineData, startOfWeek);
      const firstDay = await fetchOldestDate(uid);
      setOldestDate(firstDay);
    };

    fetchScores();
  }, [day]);

  return (
    <View style={[styles.container, {backgroundColor: activeColors.backgroundSecondary}]}>
      <Text style={[styles.title, {color: activeColors.regular}]}>locked in score</Text>
      
      <View style={styles.dateScroll}>
        <TouchableOpacity onPress={handleDateLeft}
        hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
        >
          <AntDesign name="left" size={20} color={activeColors.regular} style={{top: -6}}/>
        </TouchableOpacity>
        
        <Text style={[styles.dateText, {color: activeColors.chartGray}]}>{startDay} - {endDay}</Text>

        <TouchableOpacity onPress={handleDateRight}
        hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
        >
          <AntDesign name="right" size={20} color={activeColors.regular} style={{top: -6}}/>
        </TouchableOpacity>
      </View>

      <View style={[{ overflow: 'hidden' }, { width: 265 }]}>
        <LineChart
          disableScroll
          animateOnDataChange
          onDataChangeAnimationDuration={300}
          areaChart
          straight
          curveIntensity={0}
          data={lineData}
          height={110}
          width={262}
          maxValue={100}
          hideDataPoints
          spacing={35.5}
          color='#7C81FC'
          thickness1={2}
          startFillColor1='#7C81FC'
          endFillColor1='#7C81FC'
          startOpacity={1}
          endOpacity={0.025}
          initialSpacing={10}
          noOfSections={4}
          yAxisThickness={0}
          rulesType={ruleTypes.DASHED}
          rulesColor={activeColors.chartGray}
          rulesLength={225}
          rulesThickness={1}
          dashWidth={2}
          yAxisTextStyle={{ color: activeColors.chartGray , fontSize: 13}}
          yAxisLabelSuffix="%"
          xAxisThickness={0}
          xAxisLabelTextStyle={{ color: activeColors.chartGray , fontSize: 12}}
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
    padding: 20,
    paddingLeft: 22,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Shippori',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: -6,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Shippori',
    textAlign: 'center',
    marginBottom: 14,
  },
  dateScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});