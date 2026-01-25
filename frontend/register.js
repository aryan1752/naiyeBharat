import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCENVymYaQIpR22IkXJD3cvbSqkb-6FijI",
  authDomain: "nyaybharat-27853.firebaseapp.com",
  projectId: "nyaybharat-27853",
  storageBucket: "nyaybharat-27853.firebasestorage.app",
  messagingSenderId: "288530460991",
  appId: "1:288530460991:web:73fa0f29591e55da0e638a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = "grand.html";
    alert("Registered Successfully ✅");
    console.log("User:", userCredential.user);
  } catch (error) {
    alert(error.message);
    console.log(error.code, error.message);
  }
});
