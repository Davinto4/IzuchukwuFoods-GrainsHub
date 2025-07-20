<!DOCTYPE html><html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Global Chat - Izuchukwu Foods</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.css">
  <script type="module" src="https://cdn.jsdelivr.net/npm/emoji-picker-element@^1"></script>
</head>
<body class="bg-gray-50 text-gray-800">
  <!-- Navbar -->
  <nav class="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow">
    <a href="index.html" class="text-xl font-bold">Izuchukwu Foods</a>
    <div class="space-x-6 text-sm font-medium">
      <a href="index.html" class="hover:underline">Home</a>
      <a href="products.html" class="hover:underline">Products</a>
      <a href="about.html" class="hover:underline">About</a>
      <a href="blog.html" class="hover:underline">Blog</a>
      <a href="chat.html" class="hover:underline">Global Chat</a>
    </div>
  </nav>  <main class="max-w-3xl mx-auto px-4 py-10">
    <h2 class="text-2xl font-bold mb-4">Global Chat</h2><!-- Auth Panel -->
<div id="authPanel" class="mb-6">
  <div class="space-y-4">
    <input type="text" id="username" placeholder="Enter your name" class="border px-4 py-2 rounded w-full" />
    <input type="password" id="password" placeholder="Enter password" class="border px-4 py-2 rounded w-full" />
    <button id="loginBtn" class="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 w-full">Login</button>
  </div>
</div>

<!-- Chat Section -->
<div id="chatSection" class="hidden">
  <div class="mb-4 flex justify-between items-center">
    <span>Logged in as <strong id="displayName"></strong> <span id="onlineStatus" class="text-sm text-green-600"></span></span>
    <button id="logoutBtn" class="text-red-600 text-sm hover:underline">Logout</button>
  </div>

  <div id="typingIndicator" class="text-sm text-gray-500 italic mb-2 hidden">Someone is typing...</div>

  <div id="messages" class="border p-4 h-80 overflow-y-auto bg-white rounded shadow space-y-2"></div>

  <div class="mt-4 flex items-center space-x-2">
    <input type="text" id="messageInput" placeholder="Type a message..." class="flex-1 border px-4 py-2 rounded" />
    <button id="emojiBtn" class="text-2xl">😊</button>
    <button id="sendBtn" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Send</button>
  </div>

  <emoji-picker id="emojiPicker" class="absolute z-50 hidden"></emoji-picker>
</div>

  </main>  <footer class="bg-green-700 text-white text-center py-6 mt-10">
    <p class="text-sm">&copy; 2025 Izuchukwu Foods. All rights reserved.</p>
  </footer>  <script type="module" src="/js/chat.js"></script></body>
</html>