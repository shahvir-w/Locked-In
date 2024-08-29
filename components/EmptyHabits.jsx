import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function EmptyHabits({ date }) {
  const router = useRouter();

  const today = new Date().toLocaleDateString('en-CA'); // Get today's date in "YYYY-MM-DD" format
  const isPastDate = date < today; // Check if the selected date is in the past

  const handleAddHabit = () => {
    router.push('create-habits');
  };

  return (
    <ScrollView style={styles.ItemsWrapper}>
      <Text style={[styles.emptyText, isPastDate && styles.viewOnlyText]}>
      {isPastDate 
          ? 'NO DATA...\n ...you forgot to open the app'
          : "you have no habits, click the plus \nbelow to add some" }
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
    color: '#fff',
    lineHeight: 25,
  },
    viewOnlyText: {
    color: '#FFD700',
    fontSize: 18,
  },
  addButton: {
    marginTop: 10,
    alignItems: 'center',
  },
});