import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function EmptyHabits() {
  const router = useRouter();

  const handleAddHabit = () => {
    router.push('create-habits');
  };

  return (
    <ScrollView style={styles.ItemsWrapper}>
      <Text style={styles.emptyText}>
        you have no habits, click the plus {'\n'} below to add some
      </Text>

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
  emptyText: {
    fontFamily: 'aldrich',
    textAlign: 'center',
    fontSize: 17,
    color: '#fff',
    lineHeight: 25,
  },
  addButton: {
    marginTop: 10,
    alignItems: 'center',
  },
});