import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAn2iBVgVr03T1Oo2US2_S-tSIsaN8bwSY",
    authDomain: "ccn-e98e2.firebaseapp.com",
    projectId: "ccn-e98e2",
    storageBucket: "ccn-e98e2.appspot.com",
    messagingSenderId: "283718422645",
    appId: "1:283718422645:web:4a55e9f9323b5bb1afe83c"
  };

  const app=!firebase.apps.lenght 
  ? firebase.initializeApp(firebaseConfig) 
  : firebase.app();

  const db=app.firestore();
  const auth=app.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export { db,auth,provider };