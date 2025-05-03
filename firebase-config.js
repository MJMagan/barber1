// Import Firebase modules (CDN modular syntax)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAH8pp9sMR1fBHLGi62YOTgzMWgmwtWIBY",
    authDomain: "elite-cuts-5f227.firebaseapp.com",
    databaseURL: "https://elite-cuts-5f227-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "elite-cuts-5f227",
    storageBucket: "elite-cuts-5f227.appspot.com",
    messagingSenderId: "721984977356",
    appId: "1:721984977356:web:0e4e8cf3f36fec67ac4569"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const database = getDatabase(app);

// Export for use in other modules
export { auth, database };
