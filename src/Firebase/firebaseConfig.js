import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLWrpN8nXLYXkEJq7drAiDlyvwiwWCusk",
  authDomain: "todo-list-apllication.firebaseapp.com",
  projectId: "todo-list-apllication",
  storageBucket: "todo-list-apllication.appspot.com",
  messagingSenderId: "21634940458",
  appId: "1:21634940458:web:a529f363c86e1d42b18d53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db = getFirestore(app);
export default app;