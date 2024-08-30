import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../configs/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useOldestDate() {
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchOldestDate = async () => {
      const uid = await AsyncStorage.getItem('userUID');
      if (uid) {
        try {
          // Reference to the "days" collection for the current user
          const daysCollection = collection(db, 'users', uid, 'days');

          // Query to get the oldest document based on the document ID (date)
          const q = query(daysCollection, orderBy('__name__', 'asc'), limit(2));

          // Execute the query
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // Get the oldest document ID (date)
            const oldestDoc = querySnapshot.docs[0];
            const oldestDate = oldestDoc.id; // Document ID is the date
            setDate(oldestDate);
          } else {
            // Handle the case where there are no documents
            setDate("no data");
          }
        } catch (error) {
          console.error("Error fetching oldest date:", error);
        }
      }
    };

    fetchOldestDate();
  }, []);

  return date;
}