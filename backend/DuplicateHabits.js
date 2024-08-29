import { useEffect } from 'react';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../configs/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Function for duplicating habits
export const duplicateHabits = async (sourceDate, targetDate) => {
  try {
    const uid = await AsyncStorage.getItem('userUID');
    if (uid) {
      // Reference to the source date's habits
      const sourceHabitsRef = collection(db, 'users', uid, 'days', sourceDate, 'habits');
      
      // Fetch all habits from the source date
      const sourceSnapshot = await getDocs(sourceHabitsRef);
      const habits = sourceSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Reference to the target date's document
      const targetDateRef = doc(db, 'users', uid, 'days', targetDate);
      await setDoc(targetDateRef, {}); // You can add initial data if needed

      // Reference to the target date's habits
      const targetHabitsRef = collection(db, 'users', uid, 'days', targetDate, 'habits');
      
      // Add each habit to the target date with isChecked set to false
      for (const habit of habits) {
        const habitRef = doc(targetHabitsRef, habit.name); // Use habit.id as document ID
        await setDoc(habitRef, {
          ...habit,
          id: Date.now().toString(),
          isChecked: false, // Ensure isChecked is false for duplicated habits
        });
      }

      console.log(`Habits duplicated from ${sourceDate} to ${targetDate}`);
    }
  } catch (error) {
    console.error('Error duplicating habits:', error);
  }
};