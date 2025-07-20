// blog.js import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"; import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, query, orderBy, serverTimestamp, onSnapshot, where, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = { apiKey: "AIzaSyAx0q_QGU35tLFP4MtUMQQUtw-WVNagpHk", authDomain: "izuchukwu-foods.firebaseapp.com", projectId: "izuchukwu-foods", storageBucket: "izuchukwu-foods.firebasestorage.app", messagingSenderId: "811147638426", appId: "1:811147638426:web:f2403b6cf7e0b6f19b1123" };

const app = initializeApp(firebaseConfig); const db = getFirestore(app);

const commentForm = document.getElementById('commentForm'); const commentText = document.getElementById('commentText'); const commentsList = document.getElementById('commentsList'); const postsList = document.getElementById('postsList');

const username = localStorage.getItem("username") || "Guest"; const isAdmin = username === "admin";

// Load blog posts async function loadPosts() { const q = query(collection(db, "blog-posts"), orderBy("timestamp", "desc")); const querySnapshot = await getDocs(q); postsList.innerHTML = '';

querySnapshot.forEach(docSnap => { const data = docSnap.data(); const postId = docSnap.id;

const postDiv = document.createElement("div");
postDiv.className = "border p-4 rounded shadow-sm bg-gray-100";
postDiv.innerHTML = `
  <h3 class="text-lg font-bold">${data.title}</h3>
  <p class="text-sm text-gray-600 mb-2">by ${data.author} - ${new Date(data.timestamp?.toDate()).toLocaleString()}</p>
  <p>${data.content}</p>
  <div class="mt-2">
    <button onclick="likePost('${postId}')" class="text-blue-600 hover:underline">❤️ ${data.likes || 0}</button>
    ${isAdmin ? `<button onclick="deletePost('${postId}')" class="text-red-600 ml-4 hover:underline">Delete</button>` : ''}
  </div>
`;
postsList.appendChild(postDiv);

}); }

// Load comments and replies async function loadComments() { const q = query(collection(db, "comments"), orderBy("timestamp")); const querySnapshot = await getDocs(q); commentsList.innerHTML = '';

const comments = {}; querySnapshot.forEach(docSnap => { const comment = { ...docSnap.data(), id: docSnap.id }; if (comment.parentId) { if (!comments[comment.parentId]) comments[comment.parentId] = { replies: [] }; comments[comment.parentId].replies.push(comment); } else { comments[comment.id] = { ...comment, replies: [] }; } });

Object.values(comments).forEach(comment => { if (!comment.text) return; // skip if it's just reply group const commentDiv = document.createElement("div"); commentDiv.className = "border rounded p-4 bg-white"; commentDiv.innerHTML = <p class="text-sm font-semibold">${comment.username} <span class="text-xs text-gray-400">${new Date(comment.timestamp?.toDate()).toLocaleString()}</span></p> <p class="mb-2">${comment.text}</p> <div class="flex space-x-4"> <button onclick="likeComment('${comment.id}')" class="text-blue-600 hover:underline">👍 ${comment.likes || 0}</button> <button onclick="showReplyBox('${comment.id}')" class="text-green-600 hover:underline">Reply</button> ${isAdmin ?<button onclick="deleteComment('${comment.id}')" class="text-red-600 hover:underline">Delete</button>: ''} </div> <div id="replies-${comment.id}" class="ml-6 mt-2 space-y-2"></div>;

commentsList.appendChild(commentDiv);

if (comment.replies.length > 0) {
  const replyContainer = commentDiv.querySelector(`#replies-${comment.id}`);
  comment.replies.forEach(reply => {
    const replyDiv = document.createElement("div");
    replyDiv.className = "bg-gray-50 p-2 rounded border";
    replyDiv.innerHTML = `
      <p class="text-sm font-medium">${reply.username} <span class="text-xs text-gray-400">${new Date(reply.timestamp?.toDate()).toLocaleString()}</span></p>
      <p class="mb-1">${reply.text}</p>
      <button onclick="likeComment('${reply.id}')" class="text-blue-600 hover:underline text-sm">👍 ${reply.likes || 0}</button>
      ${isAdmin ? `<button onclick="deleteComment('${reply.id}')" class="text-red-600 hover:underline ml-2 text-sm">Delete</button>` : ''}
    `;
    replyContainer.appendChild(replyDiv);
  });
}

}); }

// Submit new comment commentForm.addEventListener("submit", async (e) => { e.preventDefault(); const text = commentText.value.trim(); if (!text) return;

await addDoc(collection(db, "comments"), { text, username, timestamp: serverTimestamp() });

commentText.value = ''; loadComments(); });

// Like post window.likePost = async function (id) { const postRef = doc(db, "blog-posts", id); const snap = await getDocs(query(collection(db, "blog-posts"), where("name", "==", id))); const data = snap.docs[0].data(); await updateDoc(postRef, { likes: (data.likes || 0) + 1 }); loadPosts(); };

// Like comment window.likeComment = async function (id) { const commentRef = doc(db, "comments", id); const snap = await getDocs(query(collection(db, "comments"), where("name", "==", id))); const data = snap.docs[0].data(); await updateDoc(commentRef, { likes: (data.likes || 0) + 1 }); loadComments(); };

// Delete comment window.deleteComment = async function (id) { if (confirm("Delete this comment?")) { await deleteDoc(doc(db, "comments", id)); loadComments(); } };

// Delete post window.deletePost = async function (id) { if (confirm("Delete this post?")) { await deleteDoc(doc(db, "blog-posts", id)); loadPosts(); } };

// Reply to comment window.showReplyBox = function (parentId) { const container = document.getElementById(replies-${parentId}); const input = document.createElement("textarea"); input.placeholder = "Write a reply..."; input.className = "w-full p-2 border mt-2 rounded";

const sendBtn = document.createElement("button"); sendBtn.textContent = "Reply"; sendBtn.className = "mt-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"; sendBtn.onclick = async () => { const replyText = input.value.trim(); if (!replyText) return; await addDoc(collection(db, "comments"), { text: replyText, parentId, username, timestamp: serverTimestamp() }); loadComments(); };

container.appendChild(input); container.appendChild(sendBtn); };

// Initial load loadPosts(); loadComments();

