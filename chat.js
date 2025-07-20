// chat.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"; import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = { apiKey: "AIzaSyAx0q_QGU35tLFP4MtUMQQUtw-WVNagpHk", authDomain: "izuchukwu-foods.firebaseapp.com", projectId: "izuchukwu-foods", storageBucket: "izuchukwu-foods.firebasestorage.app", messagingSenderId: "811147638426", appId: "1:811147638426:web:f2403b6cf7e0b6f19b1123" };

const app = initializeApp(firebaseConfig); const db = getFirestore(app);

const chatBox = document.getElementById("chatBox"); const messageInput = document.getElementById("messageInput"); const sendBtn = document.getElementById("sendBtn"); const typingIndicator = document.getElementById("typingIndicator");

let username = localStorage.getItem("username") || "";

if (!username) { username = prompt("Enter your name:"); if (!username) username = "Guest" + Math.floor(Math.random() * 10000); localStorage.setItem("username", username); }

document.getElementById("loggedInUser").textContent = username;

const messagesRef = collection(db, "chatMessages"); const typingRef = collection(db, "typing");

sendBtn.addEventListener("click", async () => { const content = messageInput.value.trim(); if (content === "") return;

await addDoc(messagesRef, { username, content, createdAt: serverTimestamp(), });

messageInput.value = ""; await addDoc(typingRef, { username, typing: false }); });

messageInput.addEventListener("input", async () => { await addDoc(typingRef, { username, typing: messageInput.value.length > 0 }); });

onSnapshot(query(messagesRef, orderBy("createdAt")), (snapshot) => { chatBox.innerHTML = ""; snapshot.forEach((docSnap) => { const { username: user, content, createdAt } = docSnap.data(); const messageDiv = document.createElement("div"); const isAdmin = username.toLowerCase() === "admin"; const isMine = user === username;

const time = createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || "";
messageDiv.className = `p-3 rounded-lg mb-2 max-w-md ${isMine ? "bg-green-100 self-end" : "bg-white self-start"}`;
messageDiv.innerHTML = `
  <div class="text-sm font-bold">${user}</div>
  <div class="text-base">${content}</div>
  <div class="text-xs text-gray-500 mt-1">${time}</div>
  ${isAdmin ? `<button class="text-xs text-red-600 mt-1 deleteBtn" data-id="${docSnap.id}">Delete</button>` : ""}
`;

chatBox.appendChild(messageDiv);

}); chatBox.scrollTop = chatBox.scrollHeight; });

chatBox.addEventListener("click", async (e) => { if (e.target.classList.contains("deleteBtn")) { const messageId = e.target.dataset.id; await deleteDoc(doc(db, "chatMessages", messageId)); } });

onSnapshot(query(typingRef, orderBy("username")), (snapshot) => { let typingUsers = []; snapshot.forEach(doc => { const data = doc.data(); if (data.typing && data.username !== username) { typingUsers.push(data.username); } });

typingIndicator.textContent = typingUsers.length ? ${typingUsers.join(", ")} typing... : ""; });

document.getElementById("logoutBtn").addEventListener("click", () => { localStorage.removeItem("username"); location.reload(); });

