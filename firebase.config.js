import firebase from 'firebase/compat/app';
import firestore from 'firebase/compat/firestore';
import auth from 'firebase/compat/auth';
import functions from 'firebase/compat/functions'

const firebaseConfig = {
    apiKey: "AIzaSyCrYSDvzkdufz9t0LSI9ObRzhO5ael5FY0",
    authDomain: "ic2snetlauncher.firebaseapp.com",
    projectId: "ic2snetlauncher",
    storageBucket: "ic2snetlauncher.appspot.com",
    messagingSenderId: "915294785016",
    appId: "1:915294785016:web:94eb41d974690d58879a0d",
    measurementId: "G-ZKDYP4Q8PM"
};


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const fireauth = firebase.auth();
const firefunctions = firebase.functions()
if(process.env.NODE_ENV ==="development") {
    console.log("fireme fire you to Dev")
    firefunctions.useEmulator("localhost",5000)
    
}
export {db, fireauth,firefunctions };
