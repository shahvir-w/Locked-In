import { View, Text, StyleSheet, Image, TouchableOpacity, Switch } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Collapsible from 'react-native-collapsible';
import { colors } from "../../constants/colors";
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

// Accordion Component
const Accordion = ({ title, children, isOpen, onToggle }) => {
  const {theme} = useContext(ThemeContext);
  let activeColors = colors[theme.mode]
  return (
    <>
      <TouchableOpacity onPress={onToggle} style={styles.heading} activeOpacity={0.6}>
        {title}
        <Icon name={isOpen ? "chevron-up-outline" : "chevron-down-outline"} size={18} color={activeColors.regular} />
      </TouchableOpacity>

      <Collapsible collapsed={!isOpen} align="center">
        <View style={styles.list}>
          {children}
        </View>
      </Collapsible>
    </>
  );
};

// Main Info Component
export default function Info() {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const router = useRouter();
  // Clear AsyncStorage and Navigate
  const clearAsyncStorage = async () => {
    await AsyncStorage.clear(); // Clear storage first
    router.replace('../Initialize'); // Then navigate
  };

  // Toggles the accordion, ensuring only one can be open at a time
  const toggleAccordion = (index) => {
    setActiveAccordion((prevIndex) => (prevIndex === index ? null : index));
  };

  // Navigate to Locked In Score Calculation page
  const navigateToLockedInScore = () => {
    router.push('/LockedInScore'); // Adjust path as needed
  };

  // Navigate to Terms and Conditions page
  const navigateToTermsAndConditions = () => {
    router.push('/TermsAndConditions'); // Adjust path as needed
  };

  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode]
  const [isLightModeEnabled, setIsLightModeEnabled] = useState(theme.mode === "light");
  
  const toggleSwitch = () => {
    updateTheme();
    setIsLightModeEnabled((previousState) => !previousState);
  }

  // Account Section Content
  const accountBody = (
    <View>
      <Text style={[styles.accountText, {color: activeColors.regular}]}>Name: </Text>
      <Text style={[styles.accountText, {color: activeColors.regular}]}>Email: </Text>
      <TouchableOpacity style={styles.deleteButton} onPress={clearAsyncStorage}>
        <Text style={styles.deleteButtonText}>delete account</Text>
      </TouchableOpacity>
    </View>
  );

  const appearanceBody = (
    <View style={styles.toggleContainer}>
      <Text style={[styles.toggleText, {color: activeColors.regular}]}>Dark</Text>
      <Switch
        style={styles.switch}
        trackColor={{false: '#fff', true: '#81b0ff'}}
        thumbColor={isLightModeEnabled ? "#f5dd4b" : "#f4f3f4"}
        onValueChange={toggleSwitch}
        value={isLightModeEnabled}
      />
      <Text style={[styles.toggleText, {color: activeColors.regular}]}>Light</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.main, {backgroundColor: activeColors.backgroundMain}]}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/Locked-In-Logo.png')} style={styles.logoImage} />
          <Text style={styles.logoText}>locked in</Text>
        </View>
        <Text style={[styles.labelText, {color: activeColors.regular}]}>OTHER</Text>
      </View>

      <View style={styles.listContainer}>
        <Accordion
          title={<Text style={[styles.sectionTitle, {color: activeColors.regular}]}>Account</Text>}
          isOpen={activeAccordion === 0}
          onToggle={() => toggleAccordion(0)}
        >
          {accountBody}
        </Accordion>
        <View style={[styles.divider, {borderBottomColor: activeColors.regular}]} />

        <Accordion
          title={<Text style={[styles.sectionTitle, {color: activeColors.regular}]}>Appearance</Text>}
          isOpen={activeAccordion === 1}
          onToggle={() => toggleAccordion(1)}
        >
          {appearanceBody}
        </Accordion>
        <View style={[styles.divider, {borderBottomColor: activeColors.regular}]} />

        <TouchableOpacity
          style={styles.heading}
          onPress={navigateToLockedInScore}
        >
          <Text style={[styles.sectionTitle, {color: activeColors.regular}]}>Locked In Score Calculation</Text>
          <Ionicons name="chevron-forward-outline" size={18} color={activeColors.regular} />
        </TouchableOpacity>
        <View style={[styles.divider, {borderBottomColor: activeColors.regular}]} />

        <Accordion
          title={<Text style={[styles.sectionTitle, {color: activeColors.regular}]}>Notifications</Text>}
          isOpen={activeAccordion === 3}
          onToggle={() => toggleAccordion(3)}
        >
          {/* Add notifications content here */}
        </Accordion>
        <View style={[styles.divider, {borderBottomColor: activeColors.regular}]} />

        <TouchableOpacity
          style={styles.heading}
          onPress={navigateToTermsAndConditions}
        >
          <Text style={[styles.sectionTitle, {color: activeColors.regular}]}>Terms and Conditions</Text>
          <Ionicons name="chevron-forward-outline" size={18} color={activeColors.regular} />
        </TouchableOpacity>
        <View style={[styles.divider, {borderBottomColor: activeColors.regular}]} />

        <Accordion
          title={<Text style={[styles.sectionTitle, {color: activeColors.regular}]}>Contact Developer</Text>}
          isOpen={activeAccordion === 5}
          onToggle={() => toggleAccordion(5)}
        >
          {/* Add contact developer content here */}
        </Accordion>
        <View style={[styles.divider, {borderBottomColor: activeColors.regular}]} />
      </View>

      <TouchableOpacity style={styles.button} onPress={clearAsyncStorage}>
        <Text style={styles.buttonText}>sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 80,
  },
  logoContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  logoImage: {
    height: 60,
    width: 55,
    left: 0,
  },
  logoText: {
    fontFamily: 'JockeyOne',
    fontSize: 25,
    color: '#7C81FC',
    top: 13,
    left: -8,
  },
  labelText: {
    fontFamily: 'aldrich',
    fontSize: 18,
    marginHorizontal: 18,
    top: 4,
  },
  listContainer: {
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  heading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  list: {
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    height: 30,
    fontFamily: "Shippori",
  },
  divider: {
    borderBottomColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#7C81FC',
    height: 54,
    width: 180,
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 35,
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Shippori',
    fontSize: 15,
    textAlign: 'center',
    color: "#fff",
  },
  accountText: {
    fontFamily: 'Shippori',
    fontSize: 15,
    textAlign: 'left',
    paddingLeft: 30,
    paddingBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#8B0000",
    height: 50,
    width: 150,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  deleteButtonText: {
    fontFamily: 'Shippori',
    fontSize: 15,
    textAlign: 'center',
    color: "#fff",
    top: -2,
  },
  switch: {
    transform: [{ scaleX: 1.25 }],
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    alignItems: 'center',
    paddingHorizontal: 15,
    width: '100',
    marginBottom: 20,
  },
  toggleText: {
    fontSize: 17,
    color: "#fff",
    fontFamily: "JockeyOne",
  },
});