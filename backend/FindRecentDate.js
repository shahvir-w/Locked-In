import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../configs/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useMostRecentDate() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const fetchMostRecentDate = async () => {
      const uid = await AsyncStorage.getItem('userUID');
      if (uid) {
        try {
          // Reference to the "days" collection for the current user
          const daysCollection = collection(db, 'users', uid, 'days');

          // Query to get the most recent document based on the document ID (date)
          const q = query(daysCollection, orderBy('__name__', 'desc'), limit(1));

          // Execute the query
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // Get the most recent document ID (date)
            const mostRecentDoc = querySnapshot.docs[0];
            const mostRecentDate = mostRecentDoc.id; // Document ID is the date
            setCurrentDate(mostRecentDate);
            console.log("Most recent date:", mostRecentDate);
          } else {
            // Handle the case where there are no documents
            const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD" format
            setCurrentDate(today);
          }
        } catch (error) {
          console.error("Error fetching most recent date:", error);
          // Optionally handle the error, e.g., set current date to today
          const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD" format
          setCurrentDate(today);
        }
      }
    };

    fetchMostRecentDate();
  }, []);

  return currentDate;
}