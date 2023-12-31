// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDxN2sMttt084T-Xnmfh48VrTjFcbyE0p0",
  authDomain: "git-chat-online.firebaseapp.com",
  databaseURL: "https://git-chat-online-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "git-chat-online",
  storageBucket: "git-chat-online.appspot.com",
  messagingSenderId: "804896987204",
  appId: "1:804896987204:web:03dcdded024451db540411"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

const authContainer = document.getElementById("auth-container");
const chatContainer = document.getElementById("chat-container");
const messagesContainer = document.getElementById("messages");
const userDisplay = document.getElementById("user-display");
const signOutButton = document.getElementById("sign-out");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login");
const registerButton = document.getElementById("register");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");

let currentUser = null;

// Обработка входа
loginButton.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  auth.signInWithEmailAndPassword(email, password)
    .catch(error => alert(error.message));
});

// Обработка регистрации
registerButton.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  auth.createUserWithEmailAndPassword(email, password)
    .catch(error => alert(error.message));
});

// Обработка выхода из аккаунта
signOutButton.addEventListener("click", () => {
  auth.signOut();
});

// Обработка отправки сообщения
sendButton.addEventListener("click", () => {
  const message = messageInput.value;
  if (message.trim() !== "") {
    const timestamp = new Date().getTime();
    database.ref("messages").push({
      user: currentUser.email,
      message: message,
      timestamp: timestamp
    });
    messageInput.value = "";
  }
});

// Отслеживание изменения аутентификации
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    authContainer.style.display = "none";
    chatContainer.style.display = "block";
    userDisplay.textContent = "Logged in as: " + user.email;

    // Загрузка сообщений
    database.ref("messages").on("child_added", snapshot => {
      const messageData = snapshot.val();
      const messageElement = document.createElement("div");
      messageElement.textContent = messageData.user + ": " + messageData.message;
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  } else {
    currentUser = null;
    authContainer.style.display = "block";
    chatContainer.style.display = "none";
    userDisplay.textContent = "";
    messagesContainer.innerHTML = "";
  }
});
