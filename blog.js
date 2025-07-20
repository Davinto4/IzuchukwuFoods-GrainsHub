<!DOCTYPE html><html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Izuchukwu Foods Blog</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
</head>
<body class="bg-gray-50 text-gray-800">
  <nav class="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
    <a href="index.html" class="text-xl font-bold">Izuchukwu Foods</a>
    <div class="space-x-6 text-sm font-medium">
      <a href="index.html" class="hover:underline">Home</a>
      <a href="products.html" class="hover:underline">Products</a>
      <a href="about.html" class="hover:underline">About</a>
      <a href="blog.html" class="hover:underline font-bold">Blog</a>
      <a href="chat.html" class="hover:underline">Global Chat</a>
    </div>
  </nav>  <main class="max-w-4xl mx-auto px-4 py-8">
    <div class="bg-white p-6 rounded shadow mb-6">
      <h2 class="text-2xl font-bold mb-2">Blog Posts</h2>
      <div id="postsList" class="space-y-4"></div>
    </div><div class="bg-white p-6 rounded shadow mb-6">
  <h2 class="text-xl font-semibold mb-4">Leave a Comment</h2>
  <form id="commentForm" class="space-y-4">
    <textarea id="commentText" rows="3" placeholder="Write your comment..." class="w-full border p-2 rounded" required></textarea>
    <button type="submit" class="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">Post Comment</button>
  </form>
</div>

<div class="bg-white p-6 rounded shadow">
  <h2 class="text-xl font-semibold mb-4">Comments</h2>
  <div id="commentsList" class="space-y-4"></div>
</div>

  </main>  <footer class="bg-green-700 text-white text-center py-4 mt-10">
    <p class="text-sm">&copy; 2025 Izuchukwu Foods. All rights reserved.</p>
  </footer>  <script type="module">
    const username = localStorage.getItem("username");
    if (!username) {
      alert("Please login first");
      window.location.href = "login.html?redirect=blog.html";
    }
  </script>  <script type="module" src="/blog.js"></script></body>
</html>