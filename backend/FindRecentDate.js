import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
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

          // Query to get documents ordered by document ID (date) in descending order
          const q = query(daysCollection, orderBy('__name__', 'desc'));

          // Execute the query
          const querySnapshot = await getDocs(q);

          // Map through the documents and extract their IDs (dates)
          const dates = querySnapshot.docs.map(doc => doc.id);

          if (dates.length > 0) {
            // Get the most recent date (the first one in the ordered list)
            const mostRecentDate = dates[0];
            setCurrentDate(mostRecentDate);
          } else {
            setCurrentDate("no data");
          }

        } catch (error) {
          console.error("Error fetching most recent date:", error);
        }
      }
    };

    fetchMostRecentDate();
  }, []);

  return currentDate;
}