import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
import QRCode from "https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js";

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
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const sucesso = document.getElementById("sucesso");
  const erro = document.getElementById("erro");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const nome = formData.get("nome");
    const email = formData.get("email");
    const interesse = formData.get("interesse");
    const agencia = formData.get("agencia");

    try {
      const docRef = await addDoc(collection(db, "participantes"), {
        nome,
        email,
        interesse,
        agencia,
        criadoEm: new Date()
      });

      const idUnico = docRef.id;
      const urlComId = `https://teuseventosite.com/confirmacao?id=${idUnico}`;

      // 🔹 Gera QR como imagem base64
      QRCode.toDataURL(urlComId, async function (err, base64) {
        if (err) {
          console.error("Erro ao gerar QR:", err);
          return;
        }

        // 🔹 Enviar e-mail via EmailJS
        const params = {
          to_name: nome,
          email: email,
          message: `Olá ${nome}, aqui está seu acesso ao evento.`,
          qrcode: base64
        };

        await emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", params);

        form.reset();
        form.style.display = "none";
        sucesso.classList.remove("d-none");
      });

    } catch (err) {
      console.error("Erro geral:", err);
      erro.classList.remove("d-none");
    }
  });
});
