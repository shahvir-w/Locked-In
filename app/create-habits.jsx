import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Pressable } from 'react-native';
import React, { useState } from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';
import { useContext } from 'react';
import { ThemeContext } from './_layout';
import { addHabit } from '../backend/FirebaseUtils';
import * as Haptics from 'expo-haptics';

export default function CreateHabit() {
  const router = useRouter();
  const [habit, setHabit] = useState('');
  const [importance, setImportance] = useState(1);

  const {theme} = useContext(ThemeContext)
  let activeColors = colors[theme.mode]

  const handleConfirm = async () => {
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.success
    )

    const uid = await AsyncStorage.getItem('userUID');
    if (habit.trim() === '') {
      return;
    }
    await addHabit(uid, habit, importance, router);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontFamily: 'aldrich', fontSize: 25, color: '#fff' }}>new task</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ top: -2 }}>
          <FontAwesome6 name="xmark" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView style={[styles.content, {backgroundColor: activeColors.backgroundMain}]}>
        <View>
          <Text style={[styles.label, {color: activeColors.regular}]}>Name</Text>
          <TextInput
            style={[styles.input, {backgroundColor: activeColors.progressIndicator},
              {color: activeColors.regular}
            ]}
            placeholder="Max 23 characters"
            placeholderTextColor= {activeColors.input}
            onChangeText={(text) => setHabit(text)}
            maxLength={23}
          />
        </View>
        <View>
          <Text style={[styles.label, {color: activeColors.regular}, { marginTop: 30 }]}>Importance</Text>
          <View style={styles.importanceContainer}>
            {[1, 2, 3, 4, 5].map((num) => (
              <TouchableOpacity
                key={num}
                style={[styles.importanceButton, {backgroundColor: activeColors.progressIndicator}, importance === num && styles.selectedImportance]}
                onPress={() => setImportance(num)}
              >
                <Text style={[styles.importanceText, {color: activeColors.regular}, importance === num && {color: "#fff"}]}>{num}</Text>
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
    height: 120,
  },
  content: {
    height: 400,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  label: {
    fontFamily: 'Shippori',
    fontSize: 18,
    left: 30,
    textAlign: 'left',
    marginTop: 60,
    marginLeft: 10,
  },
  input: {
    fontFamily: 'Shippori',
    fontSize: 15,
    padding: 15,
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
    },
    selectedImportance: {
      backgroundColor: '#7C81FC',
    },
    importanceText: {
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

