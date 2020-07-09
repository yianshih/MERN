import * as firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyD8Sa_zWldbUuytCeG6aBHRazACOI-rWfY",
  authDomain: "mern-yian.firebaseapp.com",
  //databaseURL: "https://mern-yian.firebaseio.com",
  projectId: "mern-yian",
  storageBucket: "mern-yian.appspot.com",
  //messagingSenderId: "499729376737",
  appId: "1:499729376737:web:cd8f7b7566363baa641ea0",
  measurementId: "G-7L6B2JNTES"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
