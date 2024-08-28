import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Pressable } from 'react-native';
import React, { useState } from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../configs/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateHabit() {
  const router = useRouter();
  const [habit, setHabit] = useState('');
  const [importance, setImportance] = useState(1);

  const handleConfirm = async () => {
    if (habit.trim() === '') {
      return;
    }
    
    try {
      const user = await AsyncStorage.getItem('userUID');
      if (user) {
        const today = new Date().toLocaleDateString('en-CA'); // Ensure local date format for consistency
        const habitId = Date.now().toString();
        const habitRef = doc(db, 'users', user, 'days', today, 'habits', habit);
        await setDoc(habitRef, {
          id: habitId,
          name: habit,
          importance: importance,
          isChecked: false,
        });
        router.back();
      }
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontFamily: 'aldrich', fontSize: 25, color: '#fff' }}>new habit</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ top: -2 }}>
          <FontAwesome6 name="xmark" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        <View>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Max 20 characters"
            onChangeText={(text) => setHabit(text)}
            maxLength={20}
          />
        </View>
        <View>
          <Text style={[styles.label, { marginTop: 30 }]}>Importance</Text>
          <View style={styles.importanceContainer}>
            {[1, 2, 3, 4, 5].map((num) => (
              <TouchableOpacity
                key={num}
                style={[styles.importanceButton, importance === num && styles.selectedImportance]}
                onPress={() => setImportance(num)}
              >
                <Text style={styles.importanceText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={() => handleConfirm()}>
          <Text style={{ fontFamily: 'Shippori', fontSize: 18, textAlign: 'center', color: "#fff" }}>
            confirm
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7C81FC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#7C81FC',
    paddingHorizontal: 30,
    marginTop: 40,
    height: 115,
  },
  content: {
    backgroundColor: "#000",
    height: 400,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  label: {
    fontFamily: 'Shippori',
    fontSize: 18,
    color: "#fff",
    left: 30,
    textAlign: 'left',
    marginTop: 60,
    marginLeft: 10,
  },
  input: {
    placeholderTextColor:"#949494",
    selectionColor:"#949494",
    fontFamily: 'Shippori',
    fontSize: 15,
    color: "#949494",
    padding: 15,
    backgroundColor: "#272424",
    height: 50,
    width: 320,
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 10,
  },
  importanceContainer: {
      width: 320,
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    importanceButton: {
      width: 50,
      height: 35,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "#272424",
    },
    selectedImportance: {
      backgroundColor: '#7C81FC',
    },
    importanceText: {
      color: '#fff',
      fontFamily: 'Slackey',
      fontSize: 16,
    },
    confirmButton: {
      backgroundColor: '#7C81FC',
      height: 54,
      width: 120,
      alignSelf: 'center',
      borderRadius: 50,
      marginTop: 60,
      justifyContent: 'center',
  },
});

