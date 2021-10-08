import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.config";


const intializeFirebaseConfig=() =>{
    initializeApp(firebaseConfig);
}

export default intializeFirebaseConfig;