// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";

// QRCode sem named export
import * as QRCode from "https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js";

// EmailJS init (garante que emailjs está disponível)
import "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
emailjs.init("QPZDUMl1VEl1wjfe5"); // Public Key

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBHuhcZjt4VXUgJ76kVz7v4S8IXzn8OhS0",
  authDomain: "sunsetpartycft.firebaseapp.com",
  projectId: "sunsetpartycft",
  storageBucket: "sunsetpartycft.appspot.com",
  messagingSenderId: "1066732865141",
  appId: "1:1066732865141:web:53375abda2dab5da739a3c",
  measurementId: "G-M3K30E79TX"
};

// Inicialização Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Função de envio de e-mail via EmailJS
window.sendEmail = async function (params) {
  return emailjs.send("service_ozijssw", "template_wamk2vj", params);
};

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const sucesso = document.getElementById("sucesso");
  const erro = document.getElementById("erro");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const nome = formData.get("nome");
    const email = formData.get("email");
    const telefone = formData.get("telefone");
    const interesse = formData.get("interesse");
    const agencia = formData.get("agencia");
    const participantes = formData.get("participantes");

    try {
      // Grava no Firestore
      const docRef = await addDoc(collection(db, "participantes"), {
        nome,
        email,
        telefone,
        interesse,
        agencia,
        participantes,
        criadoEm: new Date()
      });

      // URL com ID único
      const idUnico = docRef.id;
      const urlComId = `https://teuseventosite.com/confirmacao?id=${idUnico}`;

      // Gera QR code
      QRCode.toDataURL(urlComId, async function (err, base64) {
        if (err) {
          console.error("Erro ao gerar QR code:", err);
          erro.classList.remove("d-none");
          return;
        }

        const params = {
          to_name: nome,
          email: email,
          qrcode: base64
        };

        // Envia o e-mail
        await window.sendEmail(params);

        form.reset();
        form.style.display = "none";
        sucesso.classList.remove("d-none");
      });
    } catch (err) {
      console.error("Erro geral:", err);
      erro.classList.remove("d-none");
    }
  });

  // Lógica do campo 'agência'
  const interesseSelect = document.getElementById("interesse");
  const agenciaWrapper = document.getElementById("agenciaWrapper");
  const agenciaInput = document.getElementById("agencia");

  interesseSelect.addEventListener("change", function () {
    if (this.value === "Profissional da área imobiliária") {
      agenciaWrapper.style.display = "block";
      agenciaInput.setAttribute("required", "required");
    } else {
      agenciaWrapper.style.display = "none";
      agenciaInput.removeAttribute("required");
    }
  });

  // Ajuste inicial
  if (interesseSelect.value === "Profissional da área imobiliária") {
    agenciaWrapper.style.display = "block";
    agenciaInput.setAttribute("required", "required");
  } else {
    agenciaWrapper.style.display = "none";
    agenciaInput.removeAttribute("required");
  }
});

