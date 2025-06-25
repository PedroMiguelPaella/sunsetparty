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