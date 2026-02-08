import {initializeApp} from 'firebase/app';
import {getMessaging} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDN8iQquLNQa7ntgTe0kVsg1nj3pts2R-k",
  authDomain: "intellicampus-6078f.firebaseapp.com",
  projectId: "intellicampus-6078f",
  storageBucket: "intellicampus-6078f.firebasestorage.app",
  messagingSenderId: "1035371116854",
  appId: "1:1035371116854:web:6db5b179305652fea95b97",
  measurementId: "G-20SKNXY20Z"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);