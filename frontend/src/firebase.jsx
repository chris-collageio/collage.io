// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRVxx_JelD1agAyIsk_47LHoBTGpdwx5o",
  authDomain: "collageio.firebaseapp.com",
  projectId: "collageio",
  storageBucket: "collageio.firebasestorage.app",
  messagingSenderId: "271762125897",
  appId: "1:271762125897:web:afdfff5b034c5ec6ecbb98",
  measurementId: "G-83723KM9X9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);