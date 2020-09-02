import firebase from 'firebase';

const firebaseApp= firebase.initializeApp({
    apiKey: "AIzaSyC_36iDan9UMc5Ucw0PKJGNuWYTYAMgxCo",
    authDomain: "insta-4b43b.firebaseapp.com",
    databaseURL: "https://insta-4b43b.firebaseio.com",
    projectId: "insta-4b43b",
    storageBucket: "insta-4b43b.appspot.com",
    messagingSenderId: "201774020783",
    appId: "1:201774020783:web:cd763dbda1f17c3e107c5a",
    measurementId: "G-0KZGS5Z52Z"
  });

const db= firebaseApp.firestore();
const auth= firebase.auth();
const storage= firebase.storage();

export  {db,auth,storage};


  