import { useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../configs/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useDuplicateHabits = (sourceDate, targetDate) => {
  useEffect(() => {
    const duplicateHabits = async () => {
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

          // Reference to the target date's habits
          const targetHabitsRef = collection(db, 'users', uid, 'days', targetDate, 'habits');
          
          // Add each habit to the target date
          for (const habit of habits) {
            await addDoc(targetHabitsRef, habit);
          }

          console.log(`Habits duplicated from ${sourceDate} to ${targetDate}`);
        }
      } catch (error) {
        console.error('Error duplicating habits:', error);
      }
    };

    // Run the function if sourceDate and targetDate are defined
    if (sourceDate && targetDate) {
      duplicateHabits();
    }
  }, [sourceDate, targetDate]);

};

export default useDuplicateHabits;