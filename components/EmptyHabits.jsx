import { Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { useContext } from 'react';
import { ThemeContext } from '../app/_layout';

export default function EmptyHabits({ date }) {
  const {theme} = useContext(ThemeContext)
  let activeColors = colors[theme.mode]
  
  const router = useRouter();

  const today = new Date().toLocaleDateString(); // Get today's date in "YYYY-MM-DD" format
  const isPastDate = date < today; // Check if the selected date is in the past

  const handleAddHabit = () => {
    router.push('create-habits');
  };

  return (
    <ScrollView style={styles.ItemsWrapper}>
      <Text style={[styles.emptyText, {color: activeColors.regular}, isPastDate && styles.viewOnlyText]}>
      {isPastDate 
          ? 'NO DATA...\n ...you forgot to open the app'
          : "you have no tasks, click the plus \nbelow to add some" }
      </Text>

      {!isPastDate && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
          <Ionicons name="add-circle-sharp" size={60} color="#7C81FC" />
        </TouchableOpacity>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ItemsWrapper: {
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontFamily: 'aldrich',
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 25,
  },
    viewOnlyText: {
    color: '#FFA500',
    fontSize: 18,
  },
  addButton: {
    marginTop: 10,
    alignItems: 'center',
  },
});