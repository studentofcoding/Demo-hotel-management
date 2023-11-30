// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "hotel-react-51c6c.firebaseapp.com",
  projectId: "hotel-react-51c6c",
  storageBucket: "hotel-react-51c6c.appspot.com",
  messagingSenderId: "1018462517653",
  appId: "1:1018462517653:web:5312881fc9d178bddb1e9c",
  measurementId: "G-8TP2VKCQD8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);