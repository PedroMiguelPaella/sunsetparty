// scripts.js (versão 10)  ── apenas controla o campo "Agência"

document.addEventListener("DOMContentLoaded", () => {
  const interesseSelect = document.getElementById("interesse");
  const agenciaWrapper  = document.getElementById("agenciaWrapper");
  const agenciaInput    = document.getElementById("agencia");

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
});