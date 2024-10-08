// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { ReactNativeAsyncStorage } from '@react-native-async-storage/async-storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkkFcJIQipjxJzWxZy9Rl0N7Yfavz2JRI",
  authDomain: "locked-in-2bc92.firebaseapp.com",
  projectId: "locked-in-2bc92",
  storageBucket: "locked-in-2bc92.appspot.com",
  messagingSenderId: "421293481166",
  appId: "1:421293481166:web:7f3e386eb0828d1183849f",
  measurementId: "G-EPQ6G0KSG2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);