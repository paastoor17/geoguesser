// firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAwgXDa_FHaz4eir40j-eXKFBDWCJoGIcE",
  authDomain: "proyecto-bc54f.firebaseapp.com",
  projectId: "proyecto-bc54f",
  storageBucket: "proyecto-bc54f.firebasestorage.app",
  messagingSenderId: "568033727262",
  appId: "1:568033727262:web:5c0cd75131ed0277402f0f",
  measurementId: "G-8KHBJ6DMD8"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
