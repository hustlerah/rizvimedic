// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


//  web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_wSaAG0MVif5FifGvuC-POlk2SGuiA40",
  authDomain: "rizvimed-3ee2b.firebaseapp.com",
  projectId: "rizvimed-3ee2b",
  storageBucket: "rizvimed-3ee2b.appspot.com",
  messagingSenderId: "942316022202",
  appId: "1:942316022202:web:e4653fd8f718c36991d583"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


export { auth, db, storage};
// export default firebaseCo