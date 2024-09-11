import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, } from 'react-native';
import { HabitIcons } from '@/constants/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../configs/FirebaseConfig';
import { colors } from '../constants/colors';
import { useContext } from 'react';
import { ThemeContext } from '../app/_layout';
import * as Haptics from 'expo-haptics';

const Habit = (props) => {
    const {theme} = useContext(ThemeContext)
    let activeColors = colors[theme.mode]

    const [isChecked, setIsChecked] = useState(props.checked);
    
    const [isLoading, setIsLoading] = useState(false);
    
    const toggleCheckBox = async () => {
        if (props.isPastDate || isLoading) return;


        setIsLoading(true);
        
        try {
            const newCheckedState = !isChecked;
            setIsChecked(newCheckedState);

            if (newCheckedState) {
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.success
                )
            }

            const uid = await AsyncStorage.getItem('userUID');
            const today = new Date().toLocaleDateString();
            const habitRef = doc(db, 'users', uid, 'days', today, 'habits', props.text);
            await setDoc(habitRef, { isChecked: newCheckedState }, { merge: true });

            const dayRef = doc(db, 'users', uid, 'days', today);
            const daySnapshot = await getDoc(dayRef);

            if (daySnapshot.exists()) {
                const currentCompletionScore = daySnapshot.data().completionScore || 0;
                const scoreAdjustment = newCheckedState ? props.number : -props.number;
                const newCompletionScore = currentCompletionScore + scoreAdjustment;
                await updateDoc(dayRef, { completionScore: newCompletionScore });
            }
        } catch (error) {
            console.error("Error updating completion score:", error);
        } finally {
            setIsLoading(false); // Reset loading state to allow interactions again
        }
    };
    
    return (
        <View style={[styles.item, {backgroundColor: activeColors.backgroundSecondary}, isChecked && styles.checkedItem]}>
            <View style={styles.itemBox}>
                <Text style={[styles.itemNumber, !isChecked && {color: activeColors.regular}]}>{props.number}</Text>
                <Text style={[styles.itemText, !isChecked && {color: activeColors.regular}]}>{props.text}</Text>
            </View>
            <TouchableOpacity 
                onPress={toggleCheckBox}
                hitSlop={{ top: 40, bottom: 40, left: 40, right: 40 }}
            >
                {HabitIcons[isChecked.toString()]({ color: isChecked ? 'white' : activeColors.regular })}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: "#161414",
        padding: 15,
        borderRadius: 10,
        width: 324,
        height: 58,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    checkedItem: {
        backgroundColor: "#7C81FC",
    },
    itemBox: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    itemNumber: {
        color: "#fff",
        fontFamily: 'Slackey',
        fontSize: 20,
        left: 5,
    },
    itemText: {
        color: "#fff",
        fontSize: 17,
        fontFamily: 'Shippori',
        flex: 1,
        flexWrap: 'wrap',
        marginLeft: 20,
    },
});

export default Habit;