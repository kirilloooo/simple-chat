// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDxN2sMttt084T-Xnmfh48VrTjFcbyE0p0",
  authDomain: "git-chat-online.firebaseapp.com",
  projectId: "git-chat-online",
  storageBucket: "gs://git-chat-online.appspot.com",
  // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
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
    .then(userCredential => {
      const user = userCredential.user;
      const userRef = database.ref("users").child(user.uid);

      userRef.set({
        email: user.email,
        username: "", // Вы можете добавить поле "username" и позволить пользователю задать имя
        avatarURL: "" // Ссылка на аватар пользователя
      });
    })
    .catch(error => alert(error.message));



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
        senderUID: currentUser.uid,
        timestamp: timestamp,
        message: message
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
          messageElement.textContent = messageData.senderUID + ": " + messageData.message;
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
