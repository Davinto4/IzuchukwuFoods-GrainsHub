// chat.js import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"; import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = { apiKey: "AIzaSyAx0q_QGU35tLFP4MtUMQQUtw-WVNagpHk", authDomain: "izuchukwu-foods.firebaseapp.com", projectId: "izuchukwu-foods", storageBucket: "izuchukwu-foods.firebasestorage.app", messagingSenderId: "811147638426", appId: "1:811147638426:web:f2403b6cf7e0b6f19b1123" };

const app = initializeApp(firebaseConfig); const db = getFirestore(app);

const username = localStorage.getItem("username"); const chatForm = document.getElementById("chatForm"); const messageInput = document.getElementById("messageInput"); const chatMessages = document.getElementById("chatMessages"); const loggedInUser = document.getElementById("loggedInUser"); const logoutBtn = document.getElementById("logoutBtn");

if (!username) { alert("You must log in to use the chat."); window.location.href = "login.html"; }

loggedInUser.textContent = username;

logoutBtn.addEventListener("click", () => { localStorage.removeItem("username"); window.location.reload(); });

chatForm.addEventListener("submit", async (e) => { e.preventDefault(); const text = messageInput.value.trim(); if (!text) return;

await addDoc(collection(db, "globalChat"), { username, text, createdAt: serverTimestamp() }); messageInput.value = ""; });

const q = query(collection(db, "globalChat"), orderBy("createdAt")); onSnapshot(q, (snapshot) => { chatMessages.innerHTML = ""; snapshot.forEach((doc) => { const { username, text } = doc.data(); const msg = document.createElement("div"); msg.className = "p-2 border-b"; msg.innerHTML = <strong>${username}</strong>: ${text}; chatMessages.appendChild(msg); chatMessages.scrollTop = chatMessages.scrollHeight; }); });

