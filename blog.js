import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, doc, getDocs, getDoc,
  addDoc, updateDoc, deleteDoc, query, where, orderBy
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

// USER SESSION
const user = JSON.parse(localStorage.getItem("user"));
if (!user || !user.username) {
  alert("Please login first.");
  window.location.href = "login.html";
}

const postsList = document.getElementById("postsList");
const commentForm = document.getElementById("commentForm");
const commentText = document.getElementById("commentText");
const commentsList = document.getElementById("commentsList");

let currentPostId = null;

// Load the latest post
async function loadPosts() {
  postsList.innerHTML = "";
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  snapshot.forEach(async (docSnap) => {
    const post = docSnap.data();
    currentPostId = docSnap.id;
    const postDiv = document.createElement("div");
    postDiv.innerHTML = `
      <h3 class="text-xl font-semibold">${post.title}</h3>
      <p class="text-gray-700 my-2">${post.content}</p>
      <div class="text-sm text-gray-500 mb-2">By ${post.author} · ${new Date(post.timestamp).toLocaleString()}</div>
    `;
    postsList.appendChild(postDiv);
    await loadComments(); // Load comments for this post
  });
}

// Add comment
commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const comment = commentText.value.trim();
  if (!comment || !currentPostId) return;
  await addDoc(collection(db, "comments"), {
    postId: currentPostId,
    author: user.username,
    text: comment,
    timestamp: Date.now(),
    likes: 0,
    replies: []
  });
  commentText.value = "";
  loadComments();
});

// Load comments and replies
async function loadComments() {
  commentsList.innerHTML = "";
  const q = query(collection(db, "comments"), where("postId", "==", currentPostId), orderBy("timestamp"));
  const snapshot = await getDocs(q);
  snapshot.forEach(docSnap => {
    const comment = docSnap.data();
    const commentId = docSnap.id;

    const div = document.createElement("div");
    div.className = "border p-3 rounded";
    div.innerHTML = `
      <p class="font-semibold">${comment.author} <span class="text-xs text-gray-500">(${new Date(comment.timestamp).toLocaleString()})</span></p>
      <p>${comment.text}</p>
      <div class="flex items-center text-sm text-gray-600 mt-1 space-x-4">
        <button class="like-btn" data-id="${commentId}">❤️ ${comment.likes}</button>
        <button class="reply-btn" data-id="${commentId}">Reply</button>
      </div>
      <div class="replies space-y-2 mt-3 pl-4 text-sm text-gray-700">
        ${comment.replies.map(reply => `
          <div class="border-l pl-2">
            <strong>${reply.author}</strong>: ${reply.text}
            <div class="text-xs text-gray-500">${new Date(reply.timestamp).toLocaleString()}</div>
          </div>
        `).join("")}
      </div>
      <form class="reply-form hidden mt-2 space-y-2" data-id="${commentId}">
        <input type="text" placeholder="Reply..." class="w-full border p-1 rounded reply-input"/>
        <button class="bg-green-600 text-white px-2 py-1 rounded">Send</button>
      </form>
    `;
    commentsList.appendChild(div);
  });
}

// Event delegation
commentsList.addEventListener("click", async (e) => {
  if (e.target.classList.contains("like-btn")) {
    const commentId = e.target.dataset.id;
    const commentRef = doc(db, "comments", commentId);
    const docSnap = await getDoc(commentRef);
    if (docSnap.exists()) {
      const old = docSnap.data().likes || 0;
      await updateDoc(commentRef, { likes: old + 1 });
      loadComments();
    }
  }

  if (e.target.classList.contains("reply-btn")) {
    const id = e.target.dataset.id;
    const form = document.querySelector(`form.reply-form[data-id="${id}"]`);
    form.classList.toggle("hidden");
  }
});

commentsList.addEventListener("submit", async (e) => {
  if (e.target.classList.contains("reply-form")) {
    e.preventDefault();
    const commentId = e.target.dataset.id;
    const input = e.target.querySelector(".reply-input");
    const replyText = input.value.trim();
    if (!replyText) return;

    const commentRef = doc(db, "comments", commentId);
    const commentDoc = await getDoc(commentRef);
    if (commentDoc.exists()) {
      const commentData = commentDoc.data();
      const replies = commentData.replies || [];
      replies.push({
        author: user.username,
        text: replyText,
        timestamp: Date.now()
      });
      await updateDoc(commentRef, { replies });
    }

    input.value = "";
    loadComments();
  }
});

loadPosts();