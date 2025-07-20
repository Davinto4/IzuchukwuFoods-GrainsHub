// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAx0q_QGU35tLFP4MtUMQQUtw-WVNagpHk",
  authDomain: "izuchukwu-foods.firebaseapp.com",
  projectId: "izuchukwu-foods",
  storageBucket: "izuchukwu-foods.firebasestorage.app",
  messagingSenderId: "811147638426",
  appId: "1:811147638426:web:f2403b6cf7e0b6f19b1123"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Expose current user globally
window.currentUser = null;

// UI elements to inject login/logout (optional: create these in your HTML)
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        window.currentUser = user;
        updateUserUI(user);
      })
      .catch((error) => {
        console.error("Login failed:", error);
        alert("Login failed. Check console for details.");
      });
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.currentUser = null;
      updateUserUI(null);
    });
  });
}

// Auto-detect login state
onAuthStateChanged(auth, (user) => {
  window.currentUser = user;
  updateUserUI(user);
});

// Function to update UI
function updateUserUI(user) {
  if (userInfo) {
    if (user) {
      userInfo.innerHTML = `
        <div class="flex items-center gap-2">
          <img src="${user.photoURL}" alt="User" class="w-8 h-8 rounded-full"/>
          <span class="text-sm">${user.displayName}</span>
        </div>
      `;
      loginBtn?.classList.add("hidden");
      logoutBtn?.classList.remove("hidden");
    } else {
      userInfo.innerHTML = "";
      loginBtn?.classList.remove("hidden");
      logoutBtn?.classList.add("hidden");
    }
  }
}