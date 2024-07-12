// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyA95KdMsPbYK_Oj8rCGwOFvZURyZ6zS1iU",
  authDomain: "insta-clone-yt229.firebaseapp.com",
  projectId: "insta-clone-yt229",
  storageBucket: "insta-clone-yt229.appspot.com",
  messagingSenderId: "822836428386",
  appId: "1:822836428386:web:1a24768d47486d165f9b3b",
  measurementId: "G-MCLRCKR2VW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage();
const analytics = getAnalytics(app);
export { app, auth, firestore, storage, analytics };