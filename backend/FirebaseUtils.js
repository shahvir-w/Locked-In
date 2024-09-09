import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../configs/FirebaseConfig";
import { calculateDaysToLockedIn } from "./CreateDays";
import { getAuth, deleteUser } from "firebase/auth";

export const deleteAccountAndData = async (uid) => {
  const userDocRef = doc(db, 'users', uid);
  const daysCollectionRef = collection(db, 'users', uid, 'days');
  const habitsCollectionRef = collection(db, 'users', uid, 'habits');

  // Fetch all habits in the collection
  const daysSnapshot = await getDocs(daysCollectionRef);
  const habitsSnapShot = await getDocs(habitsCollectionRef);

  // Delete each habit document
  for (const dayDoc of daysSnapshot.docs) {
    await deleteDoc(dayDoc.ref);
  }
  for (const habitDoc of habitsSnapShot.docs) {
    await deleteDoc(habitDoc.ref);
  }

  // Delete user document
  await deleteDoc(userDocRef);
  console.log("deleted everyhting")


  const auth = getAuth();
    const user = auth.currentUser;

    deleteUser(user).then(() => {
    console.log("deleted user")
    }).catch((error) => {
    // An error ocurred
    // ...
    });
};

export const addHabit = async (uid, habit, importance, router) => {
    try {
      const today = new Date().toLocaleDateString();
      const habitId = Date.now().toString();
      const habitRef = doc(db, 'users', uid, 'days', today, 'habits', habit);
      await setDoc(habitRef, {
        id: habitId,
        name: habit,
        importance: importance,
        isChecked: false,
      });
  
      const dayRef = doc(db, 'users', uid, 'days', today);
      const daySnapshot = await getDoc(dayRef);
      if (daySnapshot.exists()) {
        const currentAvailableScore = daySnapshot.data().availableScore;
        const newAvailableScore = currentAvailableScore + importance;
  
        await updateDoc(dayRef, { availableScore: newAvailableScore });
      }
      router.back();
    } catch (error) {
      console.error('Error adding habit:', error);
    }
};

export const deleteHabit = async (user, name, today) => {
    const habitRef = doc(db, 'users', user, 'days', today, 'habits', name);
  
    try {
      const habitSnapshot = await getDoc(habitRef);
      if (habitSnapshot.exists()) {
        const habitData = habitSnapshot.data();
        const importance = habitData.importance;
        const isChecked = habitData.isChecked;
  
        const dayRef = doc(db, 'users', user, 'days', today);
        const daySnapshot = await getDoc(dayRef);
        if (daySnapshot.exists()) {
          const dayData = daySnapshot.data();
          const newAvailableScore = dayData.availableScore - importance;
          const newCompletionScore = isChecked 
            ? dayData.completionScore - importance 
            : dayData.completionScore;
  
          await updateDoc(dayRef, {
            availableScore: newAvailableScore,
            completionScore: newCompletionScore,
          });
        }
  
        // Delete the habit
        await deleteDoc(habitRef);
      }
    } catch (error) {
      console.error("Error removing document: ", error);
    }
};

export const fetchUserName = async (uid) => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        const userData = userSnap.data();
        const name = userData.name.toLowerCase();
        return name;
    }
}

export const fetchUserLockedInScore = async (uid, mostRecentDate) => {
    const dateRef = doc(db, 'users', uid, 'days', mostRecentDate);
    const dateSnap = await getDoc(dateRef);
    if (dateSnap.exists()) {
        const dateData = dateSnap.data();
        lockedInScore = dateData.lockedInScore
        streak = dateData.streak
        daysTillLockedInCalc = calculateDaysToLockedIn(lockedInScore, streak);
        return [lockedInScore, streak, daysTillLockedInCalc]
    }
}

export const loadHabits = async (uid, date, setUserHabits, setRemainingTasks) => {
    if (uid) {
        const habitsRef = collection(db, 'users', uid, 'days', date, 'habits');
        const q = query(habitsRef);
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const habits = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUserHabits(habits);
            setRemainingTasks(habits.filter(habit => !habit.isChecked).length);
        });
    
        return () => unsubscribe();
    }
};

export const fetchCompletionScores = async (uid, setBarData, startOfWeek) => {
  const updatedBarData = [];
  setBarData([]);
  
  const datesForWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return {
      formattedDate: date.toLocaleDateString(),
      label: date.toLocaleDateString(undefined, { weekday: 'short' })[0],
    };
  });

  const fetchPromises = datesForWeek.map(({ formattedDate }) => {
    const dateRef = doc(db, 'users', uid, 'days', formattedDate);
    return getDoc(dateRef);
  });

  const dateSnaps = await Promise.all(fetchPromises);

  dateSnaps.forEach((dateSnap, index) => {
    if (dateSnap.exists()) {
      const dateData = dateSnap.data();
      const availableScore = dateData.availableScore;
      const completionScore = dateData.completionScore;
      let dayScore; 
      availableScore == 0 ? dayScore = 1 : completionScore == 0 ? dayScore = 1 : dayScore = (completionScore / availableScore) * 100;

      if (dayScore !== undefined) {
        updatedBarData.push({
          value: dayScore,
          label: datesForWeek[index].label,
        });
      }
    }
  });
  
  setBarData(updatedBarData);
};

export const fetchLockedInScores = async (uid, setLineData, startOfWeek) => {
    const updatedLineData = [];
    setLineData([])
  
    const datesForWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return {
        formattedDate: date.toLocaleDateString(),
        label: date.toLocaleDateString(undefined, { weekday: 'short' })[0],
      };
    });
  
    const fetchPromises = datesForWeek.map(({ formattedDate }) => {
      const dateRef = doc(db, 'users', uid, 'days', formattedDate);
      return getDoc(dateRef);
    });
  
    const dateSnaps = await Promise.all(fetchPromises);
    dateSnaps.forEach((dateSnap, index) => {
      if (dateSnap.exists()) {
        const dateData = dateSnap.data();
        const lockedInScore = dateData.lockedInScore;
  
        if (lockedInScore !== undefined) {
          updatedLineData.push({
            value: lockedInScore,
            label: datesForWeek[index].label,
          });
        }
      }
    });
  
    setLineData(updatedLineData);
  };