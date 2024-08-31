import { collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../configs/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const initializeFirstDay = async (date) => {
  const uid = await AsyncStorage.getItem('userUID');

  const targetDateRef = doc(db, 'users', uid, 'days', date);
    await setDoc(targetDateRef, {
      completionScore: 0,
      availableScore: 0,
      streak: 0,
      lockedInScore: 0});
}


// Helper function to calculate the Fibonacci value based on the streak
const fibonacci = (n) => {
  if (n === 0) return 0;
  if (n === 1 || n === -1) return 2;
  if (n === 2 || n === -2) return 3;

  let absN = Math.abs(n);
  let fib = [2, 3];
  for (let i = 2; i < absN; i++) {
    fib[i] = fib[i - 1] + fib[i - 2];
  }

  return fib[absN - 1];
};


// Function for duplicating habits
export const duplicateHabits = async (sourceDate, targetDate) => {
  try {
    const uid = await AsyncStorage.getItem('userUID');
    if (uid) {
      const sourceDateRef = doc(db, 'users', uid, 'days', sourceDate);
      const sourceDateSnap = await getDoc(sourceDateRef);
      
      if (sourceDateSnap.exists()) {
        const sourceDateData = sourceDateSnap.data();
        const currentAvailableScore = sourceDateData.availableScore;
        const completionScore = sourceDateData.completionScore;
        const currentLockedInScore = sourceDateData.lockedInScore;
        let currentStreak = sourceDateData.streak;

        // Calculate daily score
        const dailyScore = completionScore / currentAvailableScore;
        if (dailyScore <= 0.1) dailyScore = 0.1;
        
        // Adjust streak based on daily score
        if (currentStreak >= 0 && dailyScore > 0.9) {
          currentStreak = currentStreak + 1;
        } else if (currentStreak <= 0 && dailyScore > 0.9) {
          currentStreak = 1
        } else if (currentStreak >= 0 && dailyScore < 0.9) {
          currentStreak = -1
        } else if (currentStreak < 0 && dailyScore < 0.9) {
          currentStreak = currentStreak + 1;
        }

        // Calculate Fibonacci value based on the current streak
        const fibValue = fibonacci(currentStreak);

        // Calculate new LockedInScore
        let newLockedInScore = currentLockedInScore;
        if (dailyScore > 0.9) {
          newLockedInScore = currentLockedInScore + (fibValue * dailyScore)
        } else {
          newLockedInScore = currentLockedInScore - (fibValue / dailyScore)
        }
        
        if (newLockedInScore > 100) newLockedInScore = 100;
        if (newLockedInScore < 0) newLockedInScore = 0;

        // Update the target day's document with the new scores and streak
        const targetDateRef = doc(db, 'users', uid, 'days', targetDate);
        await setDoc(targetDateRef, {
          completionScore: 0,
          availableScore: currentAvailableScore,
          streak: currentStreak,
          lockedInScore: newLockedInScore
        });

        console.log(`Scores updated. New LockedInScore: ${newLockedInScore}`);
      }
      
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

export function calculateDaysToLockedIn(lockedInScore, streak) {
  let days = 0;
  var streak = streak <= 0 ? 1 : streak + 1;

  while (lockedInScore < 90) {
    const dailyIncrease = fibonacci(streak);
    lockedInScore += dailyIncrease;
    streak += 1; // Increment streak assuming daily score is 1
    days += 1;
  }

  return days;
}