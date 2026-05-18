(function() {
  'use strict';

  const wrap = document.querySelector('.formulario-parceria-wrap');
  if (!wrap) return;

  const leadForm = wrap.querySelector('.lead-form');
  const steps = Array.from(leadForm.querySelectorAll('.form-step'));
  const progressItems = Array.from(leadForm.querySelectorAll('.form-progress span'));
  const backButton = leadForm.querySelector('.form-back');
  const nextButton = leadForm.querySelector('.form-next');
  const submitButton = leadForm.querySelector('.submit-button');
  const formScroll = leadForm.querySelector('.form-scroll');
  const phoneField = leadForm.querySelector('input[name="telefone"]');
  const redirectUrl = leadForm.dataset.redirectUrl || leadForm.action;
  let currentStep = 0;

  function onlyDigits(value) {
    const rawValue = String(value || '').trim();
    let digits = rawValue.replace(/[^0-9]/g, '');

    if (digits.startsWith('0055')) {
      digits = digits.slice(4);
    } else if (/^\+[\s-]*55/.test(rawValue)) {
      digits = digits.slice(2);
    } else if (digits.length > 11 && digits.startsWith('55')) {
      digits = digits.slice(2);
    }

    return digits.slice(0, 11);
  }

  function formatBrazilPhone(value) {
    const digits = onlyDigits(value);
    const areaCode = digits.slice(0, 2);
    const firstPart = digits.length > 10 ? digits.slice(2, 7) : digits.slice(2, 6);
    const secondPart = digits.length > 10 ? digits.slice(7, 11) : digits.slice(6, 10);

    if (digits.length <= 2) return areaCode ? '(' + areaCode : '';
    if (!secondPart) return '(' + areaCode + ') ' + firstPart;
    return '(' + areaCode + ') ' + firstPart + '-' + secondPart;
  }

  function setPhoneDigits(digits) {
    const cleanDigits = onlyDigits(digits);
    phoneField.dataset.phoneDigits = cleanDigits;
    phoneField.value = formatBrazilPhone(cleanDigits);
  }

  function postIframeHeight() {
    if (window.parent === window) return;

    window.parent.postMessage({
      source: 'outmat-formulario',
      type: 'resize',
      height: document.documentElement.scrollHeight
    }, '*');
  }

  function renderStep() {
    steps.forEach(function(step, index) {
      const isActive = index === currentStep;
      step.hidden = !isActive;
      step.classList.toggle('is-active', isActive);

      Array.from(step.querySelectorAll('input, select, textarea')).forEach(function(field) {
        field.disabled = !isActive;
      });
    });

    progressItems.forEach(function(item, index) {
      item.classList.toggle('is-active', index <= currentStep);
    });

    backButton.disabled = currentStep === 0;

    const isLastStep = currentStep === steps.length - 1;
    nextButton.hidden = isLastStep;
    submitButton.hidden = !isLastStep;
    formScroll.scrollTop = 0;
    postIframeHeight();
  }

  function validateCurrentStep() {
    const fields = Array.from(steps[currentStep].querySelectorAll('input, select, textarea'));
    const invalidField = fields.find(function(field) {
      return !field.checkValidity();
    });

    if (invalidField) {
      invalidField.reportValidity();
      return false;
    }

    return true;
  }

  function redirectAfterSubmit() {
    if (window.parent === window) {
      window.location.href = redirectUrl;
      return;
    }

    window.parent.postMessage({
      source: 'outmat-formulario',
      type: 'redirect',
      url: redirectUrl
    }, '*');

    try {
      window.open(redirectUrl, '_top');
    } catch (error) {
      try {
        window.top.location.href = redirectUrl;
      } catch (topError) {
        return;
      }
    }
  }

  if (phoneField) {
    phoneField.dataset.phoneDigits = onlyDigits(phoneField.value);

    phoneField.addEventListener('beforeinput', function(event) {
      if (event.inputType === 'insertText' && event.data && !/^[0-9]$/.test(event.data)) {
        event.preventDefault();
      }
    });

    phoneField.addEventListener('keydown', function(event) {
      const controlKeys = ['Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter'];
      if (controlKeys.includes(event.key) || event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        setPhoneDigits((phoneField.dataset.phoneDigits || '').slice(0, -1));
        return;
      }

      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        setPhoneDigits((phoneField.dataset.phoneDigits || '') + event.key);
      }
    });

    phoneField.addEventListener('paste', function(event) {
      event.preventDefault();
      const clipboard = event.clipboardData || window.clipboardData;
      setPhoneDigits((phoneField.dataset.phoneDigits || '') + clipboard.getData('text'));
    });

    phoneField.addEventListener('input', function() {
      setPhoneDigits(phoneField.value);
    });
  }

  nextButton.addEventListener('click', function() {
    if (!validateCurrentStep()) return;
    currentStep = Math.min(currentStep + 1, steps.length - 1);
    renderStep();
  });

  backButton.addEventListener('click', function() {
    currentStep = Math.max(currentStep - 1, 0);
    renderStep();
  });

  leadForm.addEventListener('submit', function(event) {
    event.preventDefault();

    if (currentStep !== steps.length - 1) {
      if (validateCurrentStep()) {
        currentStep = Math.min(currentStep + 1, steps.length - 1);
        renderStep();
      }
      return;
    }

    if (!validateCurrentStep()) return;

    steps.forEach(function(step) {
      Array.from(step.querySelectorAll('input, select, textarea')).forEach(function(field) {
        field.disabled = false;
      });
    });

    submitButton.disabled = true;
    submitButton.textContent = 'Enviado';

    window.parent.postMessage({
      source: 'outmat-formulario',
      type: 'submit',
      payload: Object.fromEntries(new FormData(leadForm).entries())
    }, '*');

    redirectAfterSubmit();
  });

  window.addEventListener('load', postIframeHeight);
  window.addEventListener('resize', postIframeHeight);
  renderStep();
})();
