import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// 🔹 Tvoja Firebase konfiguracija (već si je dao)
const firebaseConfig = {
  apiKey: "AIzaSyDroO_7MlyEJrJXdLGBRI0nqoh6I9k2V8s",
  authDomain: "vl-lingua-project.firebaseapp.com",
  projectId: "vl-lingua-project",
  storageBucket: "vl-lingua-project.firebasestorage.app",
  messagingSenderId: "161835391958",
  appId: "1:161835391958:web:b5f13cd6a1312ee982e277",
  measurementId: "G-WLSL2HT4HY",
};

// 🔹 Inicijalizacija Firebase-a
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app); // ⚡ Uključi Firebase Analytics

// 🔹 Export servisa koje koristiš
export { auth, analytics };
