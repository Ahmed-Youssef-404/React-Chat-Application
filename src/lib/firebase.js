import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
//   apiKey: "AIzaSyDHbWS5bPMe0XTN8Eej9gy2yy1fNSmW5Pk",
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-6b72f.firebaseapp.com",
  projectId: "reactchat-6b72f",
  storageBucket: "reactchat-6b72f.appspot.com",
  messagingSenderId: "418355438709",
  appId: "1:418355438709:web:fab92161b7430d12c1443c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth();  // for login and signup
export const db = getFirestore();  // for user information
export const storage = getStorage(app);  // for uploading images (user image)