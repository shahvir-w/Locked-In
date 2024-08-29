import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Habit from './Habit';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function HabitsScrollView({ habits, remainingTasks, date }) {
  const router = useRouter();

  const handleAddHabit = () => {
    router.push('create-habits');
  };

  const today = new Date().toLocaleDateString('en-CA'); // Get today's date in "YYYY-MM-DD" format
  const isPastDate = date < today; // Check if the selected date is in the past

  const sortedHabits = habits.sort((a, b) => b.importance - a.importance);

  // Define a renderItem function for FlatList
  
  const renderItem = ({ item }) => (
      <Habit
        key={item.id}
        number={item.importance}
        text={item.name}
        checked={item.isChecked}
        isPastDate={isPastDate}
      />
  );

  // Define a header function for FlatList
  const ListHeader = () => (
    <View>
      <Text style={[styles.tasksText, isPastDate && styles.viewOnlyText]}>
        {isPastDate 
          ? 'VIEW ONLY'
          : remainingTasks > 1 
          ? `you have ${remainingTasks} tasks remaining`
          : remainingTasks === 1 
          ? `you have ${remainingTasks} task remaining`
          : 'well done! all tasks completed!'}
      </Text>
    </View>
  );

  // Define a footer function for FlatList
  const ListFooter = () => (
    <View>
      {!isPastDate && (
        <>
          <Text style={styles.deleteText}>swipe left on task to delete</Text>

          <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
            <Ionicons name="add-circle-sharp" size={60} color="#7C81FC" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <FlatList
      data={sortedHabits}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.items}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={ListFooter}
    /> 
  );
}

const styles = StyleSheet.create({
  items: {
    alignItems: 'center',
    marginTop: 20,
  },
  tasksText: {
    fontFamily: 'aldrich',
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  viewOnlyText: {
    color: '#FFD700',
    fontSize: 18,
  },
  deleteText: {
    fontFamily: 'aldrich',
    textAlign: 'center',
    fontSize: 15,
    color: '#808080',
    marginBottom: 5,
  },
  addButton: {
    alignItems: 'center',
    marginBottom: 100,
  },
});