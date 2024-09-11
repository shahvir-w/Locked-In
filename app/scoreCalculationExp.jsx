import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { useContext } from 'react';
import { ThemeContext } from './_layout';

export default function ScoreCalculationExp() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={30} color="white"/>
        </TouchableOpacity>
        <Text style={styles.title}>Locked In Score Calc. </Text>
      </View>
      <ScrollView style={[styles.content, { backgroundColor: activeColors.backgroundMain }]}
      showsVerticalScrollIndicator={false}>
        <View style={styles.infoContainer}>
          <Text style={[styles.description, { color: activeColors.regular } ]}>
            The Locked In Score reflects how committed you are to completing your tasks. A score of 90% or higher indicates you are "locked in."
          </Text>

          <Text style={styles.subtitle}>1. completion score</Text>
          <Text style={[styles.description, { color: activeColors.regular } ]}>
            Each task has an importance level. The completion score for a given day is calculated as the sum of the importance levels of all checked tasks,
            divided by the total importance level, and then multiplied by 100 to get a percentage.
          </Text>

          <Text style={styles.subtitle}>2. streaks</Text>
          <Text style={[styles.description, { color: activeColors.regular } ]}>
            When your completion score is 90% or higher, you build a positive streak. This streak increases daily as long as you maintain a completion score of 90% or higher.
            However, if your score falls below 90% even once, you start building a negative streak, which decreases with each subsequent day of a sub-90% score.
          </Text>

          <Text style={styles.subtitle}>3. locked in score calculation</Text>
          <Text style={[styles.description, { color: activeColors.regular } ]}>
            Your streak is assigned a Fibonacci value starting at 2. For instance:
            {'\n'}<Text style={[{color: colors.PURPLE}, {fontSize: 25}]}>•</Text>A streak of 1 corresponds to a Fibonacci value of 2.
            {'\n'}<Text style={[{color: colors.PURPLE}, {fontSize: 25}]}>•</Text>A streak of 2 corresponds to a Fibonacci value of 3.
            {'\n'}<Text style={[{color: colors.PURPLE}, {fontSize: 25}]}>•</Text>A streak of 3 corresponds to a Fibonacci value of 5, and so on.
            {'\n'}{'\n'}If your streak is positive, your Locked-In Score increases by the Fibonacci value each day. For example:
            {'\n'}<Text style={[{color: colors.PURPLE}, {fontSize: 25}]}>•</Text>With a streak of 4 and a 90%+ completion score, your score increases by 13 (the Fibonacci value for a streak of 4).
            {'\n'}{'\n'}If your streak is negative, your Locked-In Score decreases by the Fibonacci value divided by your completion score for that day. For example:
            {'\n'}<Text style={[{color: colors.PURPLE}, {fontSize: 25}]}>•</Text>With a streak of -2 and a 65% completion score, your score decreases by 5 / 0.65, which is about 7.69.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7C81FC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#7C81FC',
    paddingHorizontal: 30,
    marginTop: 40,
    height: 100,
  },
  backButton: {
    top: -2,
  },
  title: {
    fontFamily: 'aldrich',
    fontSize: 23,
    color: '#fff',
  },
  content: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },
  infoContainer: {
    marginTop: 20,
    marginHorizontal: 5,
    marginBottom: 60,
  },
  subtitle: {
    fontFamily: 'aldrich',
    fontSize: 18,
    color: colors.PURPLE,
    marginVertical: 10,

  },
  description: {
    fontFamily: 'shippori',
    fontSize: 17,
    color: '#fff',
    lineHeight: 24,
    marginBottom: 20,
  },
});