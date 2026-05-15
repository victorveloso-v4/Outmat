if (window.lucide) {
  window.lucide.createIcons();
}

const leadForm = document.querySelector(".lead-form");

if (leadForm) {
  const steps = [...leadForm.querySelectorAll(".form-step")];
  const progressItems = [...leadForm.querySelectorAll(".form-progress span")];
  const backButton = leadForm.querySelector(".form-back");
  const nextButton = leadForm.querySelector(".form-next");
  const submitButton = leadForm.querySelector(".submit-button");
  const formScroll = leadForm.querySelector(".form-scroll");
  let currentStep = 0;

  const renderStep = () => {
    steps.forEach((step, index) => {
      const isActive = index === currentStep;
      step.hidden = !isActive;
      step.classList.toggle("is-active", isActive);

      step.querySelectorAll("input, select, textarea").forEach((field) => {
        field.disabled = !isActive;
      });
    });

    progressItems.forEach((item, index) => {
      item.classList.toggle("is-active", index <= currentStep);
    });

    if (backButton) {
      backButton.disabled = currentStep === 0;
    }

    if (nextButton && submitButton) {
      const isLastStep = currentStep === steps.length - 1;
      nextButton.hidden = isLastStep;
      submitButton.hidden = !isLastStep;
    }

    if (formScroll) {
      formScroll.scrollTop = 0;
    }
  };

  const validateCurrentStep = () => {
    const fields = [...steps[currentStep].querySelectorAll("input, select, textarea")];
    const invalidField = fields.find((field) => !field.checkValidity());

    if (invalidField) {
      invalidField.reportValidity();
      return false;
    }

    return true;
  };

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (!validateCurrentStep()) {
        return;
      }

      currentStep = Math.min(currentStep + 1, steps.length - 1);
      renderStep();
    });
  }

  if (backButton) {
    backButton.addEventListener("click", () => {
      currentStep = Math.max(currentStep - 1, 0);
      renderStep();
    });
  }

  leadForm.addEventListener("submit", (event) => {
    if (currentStep !== steps.length - 1) {
      event.preventDefault();

      if (validateCurrentStep()) {
        currentStep = Math.min(currentStep + 1, steps.length - 1);
        renderStep();
      }

      return;
    }

    steps.forEach((step) => {
      step.querySelectorAll("input, select, textarea").forEach((field) => {
        field.disabled = false;
      });
    });

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.querySelector("span").textContent = "Enviando...";
    }
  });

  renderStep();
}
