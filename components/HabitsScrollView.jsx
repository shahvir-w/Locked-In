import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import Habit from './Habit';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function HabitsScrollView() {
  const router = useRouter();

  const handleAddHabit = () => {
    router.push('create-habits');
  };

  return (
    <ScrollView style={styles.ItemsWrapper}>
      <Text style={styles.tasksText}>
        you have x tasks remaining
      </Text>

      <View style={styles.items}>
        // where habits will go
      </View>

      <Text style={styles.deleteText}>swipe left on task to delete</Text>

      <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
        <Ionicons name="add-circle-sharp" size={60} color="#7C81FC" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ItemsWrapper: {
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  tasksText: {
    fontFamily: 'aldrich',
    textAlign: 'center',
    fontSize: 17,
    color: '#fff',
  },
  items: {
    alignItems: 'center',
    marginTop: 20,
  },
  deleteText: {
    fontFamily: 'aldrich',
    textAlign: 'center',
    fontSize: 14,
    color: '#808080',
    marginBottom: 5,
  },
  addButton: {
    alignItems: 'center',
  },
});