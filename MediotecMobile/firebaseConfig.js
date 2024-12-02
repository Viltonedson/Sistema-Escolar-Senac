import firebase from '@react-native-firebase/app';

// Sua configuração do Firebase Web
const firebaseConfig = {
  apiKey: "AIzaSyDRIOAkQmdd4uP0b0LBz_wNKUEqlxVCZH4",
  authDomain: "sistema-escolar-senac.firebaseapp.com",
  projectId: "sistema-escolar-senac",
  storageBucket: "sistema-escolar-senac.firebasestorage.app",
  messagingSenderId: "215264954090",
  appId: "1:215264954090:android:cb2897102d9c317a9a3993"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
