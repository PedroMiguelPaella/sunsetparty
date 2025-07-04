// scripts.js?v=7

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import QRCode from "https://cdn.jsdelivr.net/npm/qrcode@1.5.3/+esm";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCaPfq-9-LJYAZukd4QJfP-0UYxqPEtx-M",
  authDomain: "sunsetpartycft.firebaseapp.com",
  projectId: "sunsetpartycft",
  storageBucket: "sunsetpartycft.appspot.com",
  messagingSenderId: "521161059267",
  appId: "1:521161059267:web:5b4f74a6c5a3aebc5b8766",
  measurementId: "G-SYCSW61R6Z",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const sucesso = document.getElementById("sucesso");
  const erro = document.getElementById("erro");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const nome = formData.get("nome").trim();
      const email = formData.get("email").trim();
      const telemovel = formData.get("telemovel").trim();
      const acompanhantes = parseInt(formData.get("acompanhantes"), 10);
      const interesse = formData.get("interesse");
      const agencia = formData.get("agencia") || "";

      if (!nome || !email || !telemovel || !acompanhantes || !interesse) {
        erro.classList.remove("d-none");
        return;
      }

      try {
        const docRef = await addDoc(collection(db, "inscricoes"), {
          nome,
          email,
          telemovel,
          acompanhantes,
          interesse,
          agencia,
          criadoEm: serverTimestamp(),
        });

        const id = docRef.id;
        const confirmUrl = `${window.location.origin}/confirmacao.html?id=${id}`;
        const qrcode = await QRCode.toDataURL(confirmUrl);

        await fetch("https://us-central1-sunsetpartycft.cloudfunctions.net/sendConfirmationEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: email,
            nome,
            qrcode,
          }),
        });

        form.reset();
        form.style.display = "none";
        sucesso.classList.remove("d-none");
      } catch (err) {
        console.error("Erro ao enviar inscrição:", err);
        erro.classList.remove("d-none");
      }
    });

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

    // Estado inicial
    if (interesseSelect.value === "Profissional da área imobiliária") {
      agenciaWrapper.style.display = "block";
      agenciaInput.setAttribute("required", "required");
    } else {
      agenciaWrapper.style.display = "none";
      agenciaInput.removeAttribute("required");
    }
  }
});
