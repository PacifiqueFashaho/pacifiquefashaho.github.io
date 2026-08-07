document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const language = (root.lang || "en").toLowerCase().startsWith("fr")
    ? "fr"
    : "en";
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  const assistantIntentEngine = window.QuickAssistantIntents;

  const messages = {
    en: {
      form: {
        sending: "Sending...",
        submit: "Send Message",
        notConfigured:
          "The contact form is not configured yet. Please use email or WhatsApp.",
        received: "Thank you. Your message has been received.",
        sendingStatus: "Sending your message...",
        serviceError: "The form service returned an error.",
        success: "Thank you. Your message has been sent successfully.",
        failure:
          "Your message could not be sent. Please contact Pacifique through email or WhatsApp.",
        errorsFound: (count) =>
          "Please correct " + count + " " +
          (count === 1 ? "field" : "fields") + " before sending.",
        nameRequired: "Enter your name.",
        emailRequired: "Enter your email address.",
        emailInvalid: "Enter an email address in the format name@example.com.",
        subjectRequired: "Enter the role, internship, or message subject.",
        messageRequired: "Enter your message."
      },
      copyEmail: {
        success: "Email copied to clipboard.",
        failure: "Copy failed. Use the email link instead."
      },
      assistant: {
        dashboard:
          "This looks like a dashboard or reporting request. Add the data source, required KPIs, preferred tool, and deadline so Pacifique can respond accurately.",
        support:
          "This looks like an IT Support request. Add the device or system, symptoms, number of affected users, urgency, and location or remote arrangement.",
        data:
          "This looks like a data task. Add the file format, approximate volume, quality issue, expected output, preferred tool, and deadline.",
        field:
          "This looks like a field-data request. Add the platform, form or device issue, field context, expected deliverable, and timeline.",
        opportunity:
          "This looks like a recruitment message. Add the role, employment or internship type, location or remote arrangement, start timeline, and preferred contact method.",
        fallback:
          "Your draft is ready. Add the desired outcome, timing, and preferred reply method if they are not already included.",
        preparing: "Preparing your contact options...",
        ready:
          "Draft ready. Review it, then copy it or continue through your preferred contact method.",
        copied: "Prepared message copied.",
        copyFailure:
          "The message could not be copied. Continue by email or use the contact form.",
        formPrefilled:
          "The assistant added the prepared subject and message. Complete your name and email, review everything, then send.",
        subjects: {
          opportunity: "IT Support opportunity",
          support: "IT Support service request",
          dashboard: "Dashboard and reporting request",
          data: "Data support request",
          field: "Field-data support request",
          fallback: "Portfolio contact"
        },
        emailGreeting: "Hello Pacifique,",
        emailClosing: "Best regards,",
        whatsappGreeting: "Hello Pacifique,"
      }
    },
    fr: {
      form: {
        sending: "Envoi en cours...",
        submit: "Envoyer le message",
        notConfigured:
          "Le formulaire de contact n\u2019est pas encore configur\u00E9. Utilisez l\u2019email ou WhatsApp.",
        received: "Merci. Votre message a bien \u00E9t\u00E9 re\u00E7u.",
        sendingStatus: "Envoi de votre message...",
        serviceError: "Le service du formulaire a retourn\u00E9 une erreur.",
        success:
          "Merci. Votre message a \u00E9t\u00E9 envoy\u00E9 avec succ\u00E8s.",
        failure:
          "Votre message n\u2019a pas pu \u00EAtre envoy\u00E9. Contactez Pacifique par email ou WhatsApp.",
        errorsFound: (count) =>
          "Corrigez " + count + " " +
          (count === 1 ? "champ" : "champs") + " avant l\u2019envoi.",
        nameRequired: "Saisissez votre nom.",
        emailRequired: "Saisissez votre adresse email.",
        emailInvalid: "Saisissez une adresse au format nom@exemple.com.",
        subjectRequired: "Saisissez le poste, le stage ou l\u2019objet du message.",
        messageRequired: "Saisissez votre message."
      },
      copyEmail: {
        success: "Adresse email copi\u00E9e.",
        failure:
          "La copie a \u00E9chou\u00E9. Utilisez directement le lien email."
      },
      assistant: {
        dashboard:
          "Votre demande concerne un tableau de bord ou un rapport. Ajoutez la source des donn\u00E9es, les indicateurs attendus, l\u2019outil souhait\u00E9 et le d\u00E9lai.",
        support:
          "Votre demande concerne le support informatique. Ajoutez l\u2019appareil ou le syst\u00E8me, les sympt\u00F4mes, le nombre d\u2019utilisateurs touch\u00E9s, l\u2019urgence et le lieu ou l\u2019option \u00E0 distance.",
        data:
          "Votre demande concerne les donn\u00E9es. Ajoutez le format, le volume approximatif, le probl\u00E8me de qualit\u00E9, le r\u00E9sultat attendu, l\u2019outil souhait\u00E9 et le d\u00E9lai.",
        field:
          "Votre demande concerne les donn\u00E9es de terrain. Ajoutez la plateforme, le probl\u00E8me de formulaire ou d\u2019appareil, le contexte terrain, le livrable attendu et le calendrier.",
        opportunity:
          "Votre message concerne une opportunit\u00E9. Ajoutez le poste, le type d\u2019emploi ou de stage, le lieu ou l\u2019option \u00E0 distance, la date de d\u00E9but et le moyen de contact souhait\u00E9.",
        fallback:
          "Votre brouillon est pr\u00EAt. Ajoutez le r\u00E9sultat souhait\u00E9, le d\u00E9lai et le moyen de r\u00E9ponse pr\u00E9f\u00E9r\u00E9 si ces informations manquent.",
        preparing: "Pr\u00E9paration des options de contact...",
        ready:
          "Brouillon pr\u00EAt. Relisez-le, puis copiez-le ou continuez avec le moyen de contact souhait\u00E9.",
        copied: "Message pr\u00E9par\u00E9 copi\u00E9.",
        copyFailure:
          "Le message n\u2019a pas pu \u00EAtre copi\u00E9. Continuez par email ou utilisez le formulaire.",
        formPrefilled:
          "L\u2019assistant a ajout\u00E9 l\u2019objet et le message. Compl\u00E9tez votre nom et votre email, relisez le tout, puis envoyez.",
        subjects: {
          opportunity: "Opportunit\u00E9 en support informatique",
          support: "Demande de service en support informatique",
          dashboard: "Demande de tableau de bord et de rapport",
          data: "Demande d\u2019assistance pour les donn\u00E9es",
          field: "Demande d\u2019assistance pour les donn\u00E9es de terrain",
          fallback: "Contact depuis le portfolio"
        },
        emailGreeting: "Bonjour Pacifique,",
        emailClosing: "Cordialement,",
        whatsappGreeting: "Bonjour Pacifique."
      }
    }
  };

  const strings = messages[language];
  const serviceButtons = document.querySelectorAll(".service-chip");
  const contactForm = document.getElementById("contactForm");
  const contactFormStatus = document.getElementById("contactFormStatus");
  const contactSubmitButton = document.getElementById("contactSubmitButton");
  const contactSubmitText = document.getElementById("contactSubmitText");
  const contactName = document.getElementById("contactName");
  const contactEmail = document.getElementById("contactEmail");
  const contactSubject = document.getElementById("contactSubject");
  const contactMessage = document.getElementById("contactMessage");
  const requiredContactFields = [
    contactName,
    contactEmail,
    contactSubject,
    contactMessage
  ].filter(Boolean);

  function setContactFormStatus(message, type = "") {
    if (!contactFormStatus) return;

    contactFormStatus.textContent = message;
    contactFormStatus.classList.remove("success", "error");

    if (type) {
      contactFormStatus.classList.add(type);
    }
  }

  function setContactFormLoading(isLoading) {
    if (contactSubmitButton) {
      contactSubmitButton.disabled = isLoading;
      contactSubmitButton.setAttribute("aria-busy", String(isLoading));
    }

    if (contactSubmitText) {
      contactSubmitText.textContent = isLoading
        ? strings.form.sending
        : strings.form.submit;
    }
  }

  function contactFieldError(field) {
    if (!field?.id) return "";

    if (!field.value.trim()) {
      const requiredMessages = {
        contactName: strings.form.nameRequired,
        contactEmail: strings.form.emailRequired,
        contactSubject: strings.form.subjectRequired,
        contactMessage: strings.form.messageRequired
      };

      return requiredMessages[field.id] || strings.form.messageRequired;
    }

    if (field === contactEmail && field.validity.typeMismatch) {
      return strings.form.emailInvalid;
    }

    return "";
  }

  function setContactFieldError(field, message = "") {
    if (!field?.id) return;

    const error = document.getElementById(`${field.id}Error`);
    field.setAttribute("aria-invalid", String(Boolean(message)));
    field.classList.toggle("is-invalid", Boolean(message));

    if (error) {
      error.textContent = message;
    }
  }

  function validateContactField(field) {
    const message = contactFieldError(field);
    setContactFieldError(field, message);
    return !message;
  }

  function clearContactValidation() {
    requiredContactFields.forEach((field) => setContactFieldError(field));
  }

  function validateContactForm() {
    return requiredContactFields.filter((field) => !validateContactField(field));
  }

  requiredContactFields.forEach((field) => {
    field.addEventListener("blur", () => validateContactField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") {
        validateContactField(field);
      }

      if (requiredContactFields.every((item) => contactFieldError(item) === "")) {
        setContactFormStatus("");
      }
    });
  });

  serviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      serviceButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      if (contactSubject) {
        contactSubject.value = button.dataset.service || "";
        setContactFieldError(contactSubject);
        contactSubject.focus();
      }
    });
  });

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const invalidFields = validateContactForm();

      if (invalidFields.length > 0) {
        setContactFormStatus(
          strings.form.errorsFound(invalidFields.length),
          "error"
        );
        invalidFields[0].focus();
        return;
      }

      const endpoint = contactForm.dataset.endpoint || contactForm.action;
      const honeypot = document.getElementById("contactWebsite");

      if (
        !endpoint ||
        endpoint.includes("YOUR_FORM_ID") ||
        endpoint.includes("YOUR_FORM_ENDPOINT")
      ) {
        setContactFormStatus(strings.form.notConfigured, "error");
        return;
      }

      if (honeypot && honeypot.value.trim()) {
        contactForm.reset();
        clearContactValidation();
        setContactFormStatus(strings.form.received, "success");
        return;
      }

      setContactFormLoading(true);
      setContactFormStatus(strings.form.sendingStatus);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: new FormData(contactForm),
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          let errorMessage = strings.form.serviceError;

          try {
            const errorData = await response.json();

            if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
              errorMessage = errorData.errors
                .map((item) => item.message)
                .filter(Boolean)
                .join(" ");
            }
          } catch (error) {
            // Keep the localized default when the response is not JSON.
          }

          throw new Error(errorMessage);
        }

        contactForm.reset();
        clearContactValidation();
        serviceButtons.forEach((button) => {
          button.classList.remove("active");
          button.setAttribute("aria-pressed", "false");
        });
        setContactFormStatus(strings.form.success, "success");
        window.portfolioAnalytics?.track("contact_complete", "contact_form");
      } catch (error) {
        console.error("Contact form submission failed:", error);
        setContactFormStatus(strings.form.failure, "error");
      } finally {
        setContactFormLoading(false);
      }
    });
  }

  const copyEmailButton = document.getElementById("copyEmail");
  const copyEmailStatus = document.getElementById("copyEmailStatus");
  let copyStatusTimer;

  function setCopyStatus(message) {
    if (!copyEmailStatus) return;

    copyEmailStatus.textContent = message;
    window.clearTimeout(copyStatusTimer);
    copyStatusTimer = window.setTimeout(() => {
      copyEmailStatus.textContent = "";
    }, 2300);
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");

    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.select();

    let copied = false;

    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }

    textarea.remove();
    return copied;
  }

  if (copyEmailButton) {
    copyEmailButton.addEventListener("click", async () => {
      const email =
        copyEmailButton.dataset.email || "pacifiquefashaho04@gmail.com";

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else if (!fallbackCopy(email)) {
          throw new Error("Clipboard copy unavailable");
        }

        setCopyStatus(strings.copyEmail.success);
      } catch (error) {
        setCopyStatus(strings.copyEmail.failure);
      }
    });
  }

  const assistantLauncher = document.getElementById("assistantLauncher");
  const assistantLauncherWrap = document.getElementById(
    "assistantLauncherWrap"
  );
  const chatAssistant = document.getElementById("chatAssistant");
  const chatClose = document.getElementById("chatClose");
  const chatMinimize = document.getElementById("chatMinimize");
  const chatForm = document.getElementById("chatAssistantForm");
  const chatInput = document.getElementById("chatMessageInput");
  const chatSuggestions = document.querySelectorAll(".chat-suggestion");
  const chatEmailLink = document.getElementById("chatEmailLink");
  const chatWhatsappLink = document.getElementById("chatWhatsappLink");
  const chatContactFormLink = document.getElementById("chatContactFormLink");
  const chatCopyMessage = document.getElementById("chatCopyMessage");
  const chatCharacterCount = document.getElementById("chatCharacterCount");
  const chatAssistantStatus = document.getElementById("chatAssistantStatus");
  const chatCategoryGroup = document.getElementById("chatCategoryGroup");

  let assistantIsOpen = false;
  let assistantCloseTimer = null;
  let assistantFocusTimer = null;
  let selectedCategory = "";
  let statusResetTimer = null;

  const categoryDetails = {
    job: {
      subject: "Job opportunity",
      draft: "Hello Pacifique,\n\nI would like to discuss a job opportunity with you.\n\nRole and organization: [add details]\nLocation or remote arrangement: [add details]\nExpected start date: [add details]\nHow to reply: [add preferred contact method]\n\nBest regards,"
    },
    internship: {
      subject: "Internship opportunity",
      draft: "Hello Pacifique,\n\nI would like to discuss an internship opportunity with you.\n\nOrganization and internship focus: [add details]\nLocation or remote arrangement: [add details]\nDuration and start date: [add details]\nHow to reply: [add preferred contact method]\n\nBest regards,"
    },
    support: {
      subject: "IT support request",
      draft: "Hello Pacifique,\n\nI would like to discuss an IT support request with you.\n\nDevice or system: [add details]\nIssue and affected users: [add details]\nUrgency and location: [add details]\nHow to reply: [add preferred contact method]\n\nBest regards,"
    },
    data: {
      subject: "Data project request",
      draft: "Hello Pacifique,\n\nI would like to discuss a data project with you.\n\nProject goal and data format: [add details]\nExpected output: [add details]\nPreferred tool and deadline: [add details]\nHow to reply: [add preferred contact method]\n\nBest regards,"
    }
  };

  if (!assistantLauncher || !chatAssistant || !chatForm || !chatInput) return;
  if (chatAssistant.dataset.composerInitialized === "true") return;
  chatAssistant.dataset.composerInitialized = "true";

  function clearAssistantTimers() {
    window.clearTimeout(assistantCloseTimer);
    window.clearTimeout(assistantFocusTimer);
    assistantCloseTimer = null;
    assistantFocusTimer = null;
    window.clearTimeout(statusResetTimer);
  }

  function showAssistantLauncher() {
    if (!assistantLauncher) return;

    window.requestAnimationFrame(() => {
      assistantLauncher.classList.add("show");
    });
  }

  function setAssistantExposure(isExposed) {
    if (!chatAssistant) return;

    chatAssistant.setAttribute("aria-hidden", String(!isExposed));

    if (isExposed) {
      chatAssistant.removeAttribute("inert");
    } else {
      chatAssistant.setAttribute("inert", "");
    }
  }

  function openChatAssistant() {
    if (!chatAssistant || assistantIsOpen) return;

    window.clearTimeout(assistantCloseTimer);
    assistantCloseTimer = null;
    assistantIsOpen = true;
    chatAssistant.hidden = false;
    setAssistantExposure(true);
    assistantLauncher?.setAttribute("aria-expanded", "true");

    if (assistantLauncherWrap) {
      assistantLauncherWrap.hidden = true;
    }

    window.requestAnimationFrame(() => {
      chatAssistant.classList.add("show");
    });

    window.clearTimeout(assistantFocusTimer);
    assistantFocusTimer = window.setTimeout(() => {
      assistantFocusTimer = null;
      (chatSuggestions[0] || chatInput).focus();
    }, prefersReducedMotion.matches ? 0 : 220);
  }

  function closeChatAssistant({ restoreFocus = true } = {}) {
    if (!chatAssistant || !assistantIsOpen) return;

    assistantIsOpen = false;
    window.clearTimeout(assistantFocusTimer);
    assistantFocusTimer = null;
    chatAssistant.classList.remove("show");
    setAssistantExposure(false);
    assistantLauncher?.setAttribute("aria-expanded", "false");

    assistantCloseTimer = window.setTimeout(
      () => {
        assistantCloseTimer = null;
        chatAssistant.hidden = true;

        if (assistantLauncherWrap) {
          assistantLauncherWrap.hidden = false;
        }

        showAssistantLauncher();

        if (restoreFocus) {
          assistantLauncher?.focus();
        }
      },
      prefersReducedMotion.matches ? 0 : 260
    );
  }

  function setAssistantStatus(message, type = "") {
    if (!chatAssistantStatus) return;

    chatAssistantStatus.textContent = message;
    chatAssistantStatus.classList.remove("success", "error");

    if (type) {
      chatAssistantStatus.classList.add(type);
    }
  }

  function updateAssistantCharacterCount() {
    if (!chatInput || !chatCharacterCount) return;

    const maximum = Number(chatInput.maxLength) || 800;
    const unit = language === "fr" ? "caractères" : "characters";
    chatCharacterCount.textContent = `${chatInput.value.length} / ${maximum} ${unit}`;
    updateContactLinks();
  }

  function setActionAvailability(link, enabled) {
    if (!link) return;
    link.classList.toggle("is-disabled", !enabled);
    link.setAttribute("aria-disabled", String(!enabled));
    link.tabIndex = enabled ? 0 : -1;
  }

  function updateContactLinks() {
    const message = chatInput.value.trim();
    const details = categoryDetails[selectedCategory];
    const subject = details?.subject || "Portfolio contact";
    const enabled = Boolean(message);

    chatCopyMessage.disabled = !enabled;
    setActionAvailability(chatEmailLink, enabled);
    setActionAvailability(chatWhatsappLink, enabled);
    if (enabled) {
      chatEmailLink.href = `mailto:pacifiquefashaho04@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(chatInput.value)}`;
      chatWhatsappLink.href = `https://wa.me/243859477758?text=${encodeURIComponent(chatInput.value)}`;
    } else {
      chatEmailLink.removeAttribute("href");
      chatWhatsappLink.removeAttribute("href");
    }
  }

  showAssistantLauncher();
  assistantLauncher?.addEventListener("click", openChatAssistant);
  chatClose?.addEventListener("click", () => closeChatAssistant());
  chatMinimize?.addEventListener("click", () => closeChatAssistant());

  chatForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const details = categoryDetails[selectedCategory];
    if (!details) {
      setAssistantStatus("Choose a contact topic before creating a message.", "error");
      (chatCategoryGroup || chatSuggestions[0])?.focus();
      return;
    }
    chatInput.value = details.draft;
    updateAssistantCharacterCount();
    setAssistantStatus("Draft created. Review and edit it before choosing how to send it.", "success");
    chatInput.focus();
  });

  if (chatInput) {
    updateAssistantCharacterCount();
    chatInput.addEventListener("input", updateAssistantCharacterCount);
    chatInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        chatForm?.requestSubmit();
      }
    });
  }

  chatSuggestions.forEach((suggestion) => {
    suggestion.addEventListener("click", () => {
      selectedCategory = suggestion.dataset.category ||
        (suggestion.dataset.intent === "support" ? "support" :
          suggestion.dataset.intent === "data" ? "data" : "job");
      chatSuggestions.forEach((item) => {
        const active = item === suggestion;
        item.classList.toggle("is-selected", active);
        item.setAttribute("aria-pressed", String(active));
      });
      setAssistantStatus("");
      updateContactLinks();
    });
  });

  chatCopyMessage?.addEventListener("click", async () => {
    const messageToCopy = chatInput.value;
    if (!messageToCopy.trim()) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(messageToCopy);
      } else if (!fallbackCopy(messageToCopy)) {
        throw new Error("Clipboard copy unavailable");
      }

      setAssistantStatus("Message copied.", "success");
      window.clearTimeout(statusResetTimer);
      statusResetTimer = window.setTimeout(() => setAssistantStatus(""), 2500);
    } catch (error) {
      setAssistantStatus(strings.assistant.copyFailure, "error");
    }
  });

  chatContactFormLink?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (chatInput.value.trim()) {
      if (contactSubject) {
        contactSubject.value = categoryDetails[selectedCategory]?.subject || "Portfolio contact";
        setContactFieldError(contactSubject);
      }

      if (contactMessage) {
        contactMessage.value = chatInput.value;
        setContactFieldError(contactMessage);
      }

      setContactFormStatus(strings.assistant.formPrefilled, "success");
    }

    closeChatAssistant({ restoreFocus: false });

    window.setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "start"
      });

      const firstIncompleteField =
        !contactName?.value.trim() ? contactName : contactSubject;
      firstIncompleteField?.focus();
    }, prefersReducedMotion.matches ? 0 : 320);
  });

  window.addEventListener("pagehide", clearAssistantTimers, { once: true });
  [chatEmailLink, chatWhatsappLink].forEach((link) => {
    link?.addEventListener("click", (event) => {
      if (!chatInput.value.trim()) event.preventDefault();
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && assistantIsOpen) {
      event.preventDefault();
      closeChatAssistant();
    }
  });
});
