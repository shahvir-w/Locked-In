import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { ruleTypes } from 'gifted-charts-core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import useOldestDate from '../backend/FindOldestDate';
import { colors } from '../constants/colors';
import { useContext } from 'react';
import { ThemeContext } from '../app/_layout';
import { fetchCompletionScores } from '../backend/FirebaseUtils';

export default function CompletionScoreChart( {refresh} ) {
  const {theme} = useContext(ThemeContext)
  let activeColors = colors[theme.mode]
  
  const [barData, setBarData] = useState([]);

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
    setStartDay(startOfWeek.toLocaleDateString(undefined, options));
    setEndDay(endOfWeek.toLocaleDateString(undefined, options));

    return startOfWeek;
  }

  const handleDateLeft = () => {
    const newDate = new Date(day);
    newDate.setDate(day.getDate() - 7); // Move one week back
    const oldestStartDay = (determineDate(new Date("2024-09-07")));
    setDay(newDate);
  };

  const handleDateRight = () => {
    const newDate = new Date(day);
    newDate.setDate(day.getDate() + 7); // Move one week forward
    setDay(newDate);
  };

  useEffect(() => {
    const fetchScores = async () => {
      const uid = await AsyncStorage.getItem('userUID');
      const startOfWeek = determineDate(day);
      await fetchCompletionScores(uid, setBarData, startOfWeek);
    };
  
    fetchScores();
  }, [day, refresh]);

  return (
    <View style={[styles.container, {backgroundColor: activeColors.backgroundSecondary}]}>
      <Text style={[styles.title, {color: activeColors.regular}]}>task completion</Text>

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
      
      <View style={[styles.chartWrapper, { width: 262.75 }]}>
        <BarChart
            disableScroll
            data={barData}
            height={110}
            width={262.75}
            maxValue={100}
            barBorderTopRightRadius={2.5}
            barBorderTopLeftRadius={2.5}
            barWidth={11}
            spacing={24}
            frontColor='#7C81FC'
            initialSpacing={5}  // Added initial space between the line and the x-axis
            noOfSections={4}
            rulesType={ruleTypes.DASHED}
            rulesColor={activeColors.chartGray}
            rulesLength={225} 
            rulesThickness={1}
            dashWidth={2}
            yAxisThickness={0}
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