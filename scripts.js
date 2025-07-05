// scripts.js?v=8  ── envio para Google Sheets via Apps Script

import QRCode from "https://cdn.jsdelivr.net/npm/qrcode@1.5.3/+esm";

// URL do teu Web App (Apps Script)
const WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbzv6kQRNBI_m6csNCD1Ett0j8lqrgBonvVqYSvdUFsRhm3OAlLz30K3xTs592uonfE/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const sucesso = document.getElementById("sucesso");
  const erro = document.getElementById("erro");

  // ――― Mostrar / esconder “Agência” ─────────────────────────────
  const interesseSelect = document.getElementById("interesse");
  const agenciaWrapper = document.getElementById("agenciaWrapper");
  const agenciaInput = document.getElementById("agencia");

  function toggleAgencia() {
    if (interesseSelect.value === "Profissional da área imobiliária") {
      agenciaWrapper.style.display = "block";
      agenciaInput.setAttribute("required", "required");
    } else {
      agenciaWrapper.style.display = "none";
      agenciaInput.removeAttribute("required");
    }
  }
  interesseSelect.addEventListener("change", toggleAgencia);
  toggleAgencia(); // estado inicial
  // ───────────────────────────────────────────────────────────────

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Recolhe campos
    const formData = new FormData(form);
    const nome = formData.get("nome")?.trim();
    const email = formData.get("email")?.trim();
    const telemovel = formData.get("telemovel")?.trim();
    const acompanhantes = parseInt(formData.get("acompanhantes"), 10);
    const interesse = formData.get("interesse");
    const agencia = formData.get("agencia")?.trim() || "";

    // Validação simples
    if (!nome || !email || !telemovel || !acompanhantes || !interesse) {
      erro.classList.remove("d-none");
      return;
    }

    try {
      // Gera QR Code (podes mudar o conteúdo se quiseres)
      const qrContent = `${nome} | ${email}`;
      const qrcode = await QRCode.toDataURL(qrContent);

      // Envia para o Apps Script
      const resposta = await fetch(WEBAPP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          telemovel,
          acompanhantes,
          interesse,
          agencia,
          qrcode,
        }),
      }).then((r) => r.json());

      if (resposta && resposta.ok) {
        form.reset();
        form.style.display = "none";
        sucesso.classList.remove("d-none");
      } else {
        throw new Error(resposta.error || "Erro desconhecido");
      }
    } catch (err) {
      console.error("Erro ao enviar inscrição:", err);
      erro.classList.remove("d-none");
    }
  });
});