// Firebase: importar e inicializar
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBHuhcZjt4VXUgJ76kVz7v4S8IXzn8OhS0",
  authDomain: "sunsetpartycft.firebaseapp.com",
  projectId: "sunsetpartycft",
  storageBucket: "sunsetpartycft.firebasestorage.app",
  messagingSenderId: "1066732865141",
  appId: "1:1066732865141:web:53375abda2dab5da739a3c",
  measurementId: "G-M3K30E79TX"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Comportamento do formulário
document.addEventListener("DOMContentLoaded", function () {
  const interesse = document.getElementById("interesse");
  const agenciaWrapper = document.getElementById("agenciaWrapper");
  const form = document.getElementById("contactForm");
  const sucesso = document.getElementById("sucesso");
  const erro = document.getElementById("erro");

  interesse.addEventListener("change", () => {
    if (interesse.value === "Profissional da área imobiliária") {
      agenciaWrapper.style.display = "block";
    } else {
      agenciaWrapper.style.display = "none";
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    fetch("URL_DO_SEU_SCRIPT", {
      method: "POST",
      body: formData
    })
    .then(() => {
      form.reset();
      form.style.display = "none";
      sucesso.classList.remove("d-none");
    })
    .catch(err => {
      erro.classList.remove("d-none");
      console.error("Erro:", err);
    });
  });
});