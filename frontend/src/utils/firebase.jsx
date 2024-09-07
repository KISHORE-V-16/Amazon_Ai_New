import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider,GithubAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCYHAdX0U-4tiKKnVfUFRjfeiElijNO1Ak",
  authDomain: "ai-integrated.firebaseapp.com",
  projectId: "ai-integrated",
  storageBucket: "ai-integrated.appspot.com",
  messagingSenderId: "867811636323",
  appId: "1:867811636323:web:bb643ecfe5fa06c0b4f456",
  measurementId: "G-S48D5F3RVF"
};

const app = initializeApp(firebaseConfig);

export const firestore1 = getFirestore(app);
export const fireAuth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const providergithub = new GithubAuthProvider();