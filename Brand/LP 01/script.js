if (window.lucide) {
  window.lucide.createIcons();
}

const leadForm = document.querySelector(".lead-form");

if (leadForm) {
  leadForm.addEventListener("submit", () => {
    const submitButton = leadForm.querySelector(".submit-button");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.querySelector("span").textContent = "Enviando...";
    }
  });
}
