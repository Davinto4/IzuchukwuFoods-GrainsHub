import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAx0q_QGU35tLFP4MtUMQQUtw-WVNagpHk",
  authDomain: "izuchukwu-foods.firebaseapp.com",
  projectId: "izuchukwu-foods",
  storageBucket: "izuchukwu-foods.firebasestorage.app",
  messagingSenderId: "811147638426",
  appId: "1:811147638426:web:f2403b6cf7e0b6f19b1123"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load blog posts
async function loadPosts() {
  const postsContainer = document.getElementById("postsList");
  postsContainer.innerHTML = "";

  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const post = doc.data();
    const postDiv = document.createElement("div");
    postDiv.className = "border-b pb-4";

    postDiv.innerHTML = `
      <h3 class="text-xl font-semibold text-green-700">${post.title}</h3>
      <p class="text-sm text-gray-500 mb-2">by ${post.author || "Anonymous"} • ${new Date(post.createdAt?.toDate()).toLocaleString()}</p>
      <p>${post.content}</p>
    `;

    postsContainer.appendChild(postDiv);
  });
}

window.addEventListener("DOMContentLoaded", loadPosts);