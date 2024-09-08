import { collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../configs/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const initializeFirstDay = async (date) => {
  const uid = await AsyncStorage.getItem('userUID');
  
  if (!uid) {
    console.error('User UID is not found.');
    return;
  }

  // Convert string date (if necessary) to a Date object
  const targetDate = typeof date === 'string' ? new Date(date) : date;

  const formattedTargetDate = targetDate.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
  const targetDateRef = doc(db, 'users', uid, 'days', formattedTargetDate);

  // Initialize the target date document with the required fields
  await setDoc(targetDateRef, {
    completionScore: 0,
    availableScore: 0,
    streak: 0,
    lockedInScore: 0,
  });

  // Determine the start of the week (1 day in the past)
  const dayOfWeek = targetDate.getDay();
  const startOfWeek = new Date(targetDate);
  startOfWeek.setDate(targetDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) - 1); // Move back by 1 extra day

  // Get days between start of the week and target date
  const daysInBetween = getDaysBetweenDates(startOfWeek, targetDate);

  // Loop through the days between startOfWeek and targetDate to initialize each day's document
  for (let i = 0; i <= daysInBetween; i++) {
    const intermediateDate = new Date(startOfWeek);
    intermediateDate.setDate(startOfWeek.getDate() + i);
    const formattedIntermediateDate = intermediateDate.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"

    const intermediateDateRef = doc(db, 'users', uid, 'days', formattedIntermediateDate);

    // Set the document for each intermediate day
    await setDoc(intermediateDateRef, {
      completionScore: 0,
      availableScore: 0,
      streak: 0,
      lockedInScore: 0,
    });
  }
};


// Helper function to calculate the Fibonacci value based on the streak
const fibonacci = (n) => {
  if (n === 0) return 0;
  if (n === 1 || n === -1) return 1;
  if (n === 2 || n === -2) return 2;

  let absN = Math.abs(n);
  let fib = [1, 2];
  for (let i = 2; i < absN; i++) {
    fib[i] = fib[i - 1] + fib[i - 2];
  }

  return fib[absN - 1];
};


export function getDaysBetweenDates(date1, date2) {
  // Reset the time part of both dates to midnight
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Calculate the difference in milliseconds
  const timeDifference = Math.abs(d2 - d1); // absolute difference in time
  
  // Convert milliseconds to days
  const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  
  return dayDifference;
}


// Function for duplicating habits
export const duplicateHabits = async (sourceDate, targetDate) => {
  const daysInBetween = (getDaysBetweenDates(sourceDate, targetDate));

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

        for (let i = 1; i <= daysInBetween; i++) {
          // Calculate daily score
          var dailyScore;
          if (currentAvailableScore == 0) {
            var dailyScore = 0
          } else {
            dailyScore = completionScore / currentAvailableScore;
          }
          
          if (dailyScore <= 0.1) dailyScore = 0.1;

          const intermediateDate = new Date(sourceDate);
          intermediateDate.setDate(intermediateDate.getDate() + i);
          const formattedDate = intermediateDate.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"

          // Adjust streak based on daily score
          if (currentStreak >= 0 && dailyScore > 0.9) {
            currentStreak = currentStreak + 1;
          } else if (currentStreak <= 0 && dailyScore > 0.9) {
            currentStreak = 1
          } else if (currentStreak >= 0 && dailyScore < 0.9) {
            currentStreak = -1
          } else if (currentStreak < 0 && dailyScore < 0.9) {
            currentStreak = currentStreak - 1;
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
        
        
          const intermediateDateRef = doc(db, 'users', uid, 'days', formattedDate);
          await setDoc(intermediateDateRef, {
            completionScore: 0,
            availableScore: 0,
            streak: currentStreak,
            lockedInScore: newLockedInScore,
          });
          console.log(`New dailyScore: ${dailyScore}`);
          console.log(`New streakk: ${currentStreak}`);
          console.log(`New LockedInScore: ${newLockedInScore}`);
        } 

        // Update the target day's document with the new scores and streak
        
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