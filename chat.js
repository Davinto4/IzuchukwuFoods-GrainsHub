// chat.js import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"; import { getFirestore, collection, addDoc, getDocs, query, where, onSnapshot, serverTimestamp, doc, deleteDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = { apiKey: "AIzaSyAx0q_QGU35tLFP4MtUMQQUtw-WVNagpHk", authDomain: "izuchukwu-foods.firebaseapp.com", projectId: "izuchukwu-foods", storageBucket: "izuchukwu-foods.firebasestorage.app", messagingSenderId: "811147638426", appId: "1:811147638426:web:f2403b6cf7e0b6f19b1123" };

const app = initializeApp(firebaseConfig); const db = getFirestore(app);

const loginPanel = document.getElementById("loginPanel"); const userPanel = document.getElementById("userPanel"); const usernameInput = document.getElementById("username"); const passwordInput = document.getElementById("password"); const loginBtn = document.getElementById("loginBtn"); const logoutBtn = document.getElementById("logoutBtn"); const loggedInUser = document.getElementById("loggedInUser"); const userStatus = document.getElementById("userStatus");

const chatBox = document.getElementById("chatBox"); const messageInput = document.getElementById("messageInput"); const sendBtn = document.getElementById("sendBtn"); const typingIndicator = document.getElementById("typingIndicator"); const onlineCount = document.getElementById("onlineCount"); const onlineList = document.getElementById("onlineList");

let currentUser = null; let typingTimeout;

async function setOnline(username, online) { await setDoc(doc(db, "online", username), { username, online, lastActive: serverTimestamp() }); }

loginBtn.onclick = async () => { const username = usernameInput.value.trim(); const password = passwordInput.value.trim();

if (!username || !password) return alert("Enter both name and password");

const q = query(collection(db, "users"), where("username", "==", username)); const snapshot = await getDocs(q);

if (!snapshot.empty) { const user = snapshot.docs[0].data(); if (user.password !== password) return alert("Incorrect password"); } else { await addDoc(collection(db, "users"), { username, password }); }

const isTaken = await getDocs(query(collection(db, "online"), where("username", "==", username))); if (!isTaken.empty && isTaken.docs[0].data().online) { return alert("This user is already online."); }

currentUser = username; localStorage.setItem("username", username); loggedInUser.textContent = username; loginPanel.classList.add("hidden"); userPanel.classList.remove("hidden"); userStatus.textContent = "online"; await setOnline(username, true); };

logoutBtn.onclick = async () => { await setOnline(currentUser, false); localStorage.removeItem("username"); location.reload(); };

function renderMessage(doc) { const data = doc.data(); const div = document.createElement("div"); div.className = "border-b pb-2"; div.innerHTML = <strong>${data.username}</strong>: ${data.message} <span class="text-xs text-gray-400">${new Date(data.timestamp?.seconds * 1000).toLocaleTimeString()}</span>;

if (currentUser === "admin") { const del = document.createElement("button"); del.textContent = "🗑️"; del.className = "ml-2 text-red-600 hover:underline text-sm"; del.onclick = async () => { await deleteDoc(doc.ref); await addDoc(collection(db, "modLogs"), { action: "delete", message: data.message, by: currentUser, timestamp: serverTimestamp() }); }; div.appendChild(del); }

chatBox.appendChild(div); chatBox.scrollTop = chatBox.scrollHeight; }

sendBtn.onclick = async () => { const msg = messageInput.value.trim(); if (!msg) return; await addDoc(collection(db, "messages"), { username: currentUser, message: msg, timestamp: serverTimestamp() }); messageInput.value = ""; };

messageInput.addEventListener("input", () => { if (!currentUser) return; setDoc(doc(db, "typing", currentUser), { username: currentUser, typing: true, timestamp: serverTimestamp() });

clearTimeout(typingTimeout); typingTimeout = setTimeout(() => { setDoc(doc(db, "typing", currentUser), { username: currentUser, typing: false, timestamp: serverTimestamp() }); }, 2000); });

onSnapshot(collection(db, "messages"), (snapshot) => { chatBox.innerHTML = ""; snapshot.docs.sort((a, b) => a.data().timestamp?.seconds - b.data().timestamp?.seconds).forEach(renderMessage); });

onSnapshot(collection(db, "online"), (snapshot) => { const users = snapshot.docs.filter(doc => doc.data().online).map(doc => doc.id); onlineCount.textContent = users.length; onlineList.textContent = users.join(", "); });

onSnapshot(collection(db, "typing"), (snapshot) => { const typers = snapshot.docs.filter(doc => doc.data().typing && doc.id !== currentUser).map(doc => doc.id); typingIndicator.textContent = typers.length ? ${typers.join(", ")} is typing... : ""; });

