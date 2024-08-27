import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { HabitIcons } from '@/constants/icons';

const Habit = (props) => {
    const [isChecked, setIsChecked] = useState(props.checked);

    const toggleCheckBox = () => {
        setIsChecked(!isChecked);

    };

    return (
        <View style={[styles.item, isChecked && styles.checkedItem]}>
            <View style={styles.itemBox}>
                <Text style={styles.itemNumber}>{props.number}</Text>
                <Text style={styles.itemText}>{props.text}</Text>
            </View>
            <TouchableOpacity 
                onPress={toggleCheckBox}
            >
                {HabitIcons[isChecked.toString()]()}
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
        marginBottom: 20,
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