/* =========================================================
   Pacifique Fashaho Portfolio
   Contact form and Quick Contact Assistant
   Loaded only on the English and French home pages
========================================================= */

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
          "Your message could not be sent. Please contact Pacifique through email or WhatsApp."
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
          "Votre message n\u2019a pas pu \u00EAtre envoy\u00E9. Contactez Pacifique par email ou WhatsApp."
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
  const contactSubject = document.getElementById("contactSubject");
  const contactMessage = document.getElementById("contactMessage");

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

  serviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      serviceButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      if (contactSubject) {
        contactSubject.value = button.dataset.service || "";
        contactSubject.focus();
      }
    });
  });

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (contactForm.reportValidity && !contactForm.reportValidity()) {
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
        serviceButtons.forEach((button) => {
          button.classList.remove("active");
          button.setAttribute("aria-pressed", "false");
        });
        setContactFormStatus(strings.form.success, "success");
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
  const chatBody = document.getElementById("chatAssistantBody");
  const chatForm = document.getElementById("chatAssistantForm");
  const chatInput = document.getElementById("chatMessageInput");
  const chatSuggestions = document.querySelectorAll(".chat-suggestion");
  const chatEmailLink = document.getElementById("chatEmailLink");
  const chatWhatsappLink = document.getElementById("chatWhatsappLink");
  const chatContactFormLink = document.getElementById("chatContactFormLink");
  const chatCopyMessage = document.getElementById("chatCopyMessage");
  const chatCharacterCount = document.getElementById("chatCharacterCount");
  const chatAssistantStatus = document.getElementById("chatAssistantStatus");

  let assistantIsOpen = false;
  let assistantCloseTimer = null;
  let assistantFocusTimer = null;
  let preparedAssistantMessage = "";
  let preparedAssistantSubject = strings.assistant.subjects.fallback;
  const assistantReplyTimers = new Set();

  function clearAssistantReplyTimers() {
    assistantReplyTimers.forEach((timerId) => {
      window.clearTimeout(timerId);
    });
    assistantReplyTimers.clear();
  }

  function clearAssistantTimers() {
    window.clearTimeout(assistantCloseTimer);
    window.clearTimeout(assistantFocusTimer);
    assistantCloseTimer = null;
    assistantFocusTimer = null;
    clearAssistantReplyTimers();
  }

  function scheduleAssistantReply(callback, delay) {
    const timerId = window.setTimeout(() => {
      assistantReplyTimers.delete(timerId);
      callback();
    }, delay);

    assistantReplyTimers.add(timerId);
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

    if (chatInput) {
      window.clearTimeout(assistantFocusTimer);
      assistantFocusTimer = window.setTimeout(() => {
        assistantFocusTimer = null;
        chatInput.focus();
      }, prefersReducedMotion.matches ? 0 : 220);
    }
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

  function appendChatMessage(message, type, { generated = false } = {}) {
    if (!chatBody) return;

    const messageRow = document.createElement("div");
    const bubble = document.createElement("div");

    messageRow.className = `chat-message ${
      type === "visitor" ? "visitor-message" : "assistant-message"
    }`;
    bubble.className = "chat-bubble";
    bubble.textContent = message;

    if (generated) {
      messageRow.dataset.generated = "true";
    }

    messageRow.appendChild(bubble);
    chatBody.appendChild(messageRow);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function clearGeneratedChatMessages() {
    chatBody
      ?.querySelectorAll('.chat-message[data-generated="true"]')
      .forEach((message) => message.remove());
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
    chatCharacterCount.textContent = `${chatInput.value.length} / ${maximum}`;
  }

  function getAssistantIntent(message, requestedIntent = "") {
    if (
      assistantIntentEngine &&
      assistantIntentEngine.isKnownIntent(requestedIntent)
    ) {
      return requestedIntent;
    }

    return assistantIntentEngine
      ? assistantIntentEngine.classify(message)
      : "fallback";
  }

  function buildAssistantReply(intent) {
    return strings.assistant[intent] || strings.assistant.fallback;
  }

  function buildEmailMessage(message) {
    return [
      strings.assistant.emailGreeting,
      "",
      message,
      "",
      strings.assistant.emailClosing
    ].join("\n");
  }

  function buildWhatsappMessage(message) {
    return [strings.assistant.whatsappGreeting, "", message].join("\n");
  }

  function updateContactLinks(message, intent) {
    preparedAssistantMessage = message;
    preparedAssistantSubject =
      strings.assistant.subjects[intent] ||
      strings.assistant.subjects.fallback;

    const encodedEmailMessage = encodeURIComponent(buildEmailMessage(message));
    const encodedWhatsappMessage = encodeURIComponent(
      buildWhatsappMessage(message)
    );
    const emailSubject = encodeURIComponent(preparedAssistantSubject);

    if (chatEmailLink) {
      chatEmailLink.href =
        `mailto:pacifiquefashaho04@gmail.com?subject=${emailSubject}` +
        `&body=${encodedEmailMessage}`;
    }

    if (chatWhatsappLink) {
      chatWhatsappLink.href =
        `https://wa.me/243859477758?text=${encodedWhatsappMessage}`;
    }

    if (chatCopyMessage) {
      chatCopyMessage.disabled = false;
    }
  }

  function handleChatSubmit(message, requestedIntent = "") {
    const cleanMessage = message.trim();

    if (!cleanMessage) {
      chatInput?.focus();
      return;
    }

    const intent = getAssistantIntent(cleanMessage, requestedIntent);

    clearAssistantReplyTimers();
    clearGeneratedChatMessages();
    appendChatMessage(cleanMessage, "visitor", { generated: true });
    updateContactLinks(cleanMessage, intent);
    setAssistantStatus(strings.assistant.preparing);

    if (chatInput) {
      chatInput.value = "";
      updateAssistantCharacterCount();
    }

    scheduleAssistantReply(
      () => {
        appendChatMessage(buildAssistantReply(intent), "assistant", {
          generated: true
        });
        setAssistantStatus(strings.assistant.ready, "success");
      },
      prefersReducedMotion.matches ? 0 : 260
    );
  }

  showAssistantLauncher();
  assistantLauncher?.addEventListener("click", openChatAssistant);
  chatClose?.addEventListener("click", () => closeChatAssistant());
  chatMinimize?.addEventListener("click", () => closeChatAssistant());

  chatForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (chatInput) {
      handleChatSubmit(chatInput.value);
    }
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
      const message =
        suggestion.dataset.message || suggestion.textContent || "";
      handleChatSubmit(message, suggestion.dataset.intent || "");
    });
  });

  chatCopyMessage?.addEventListener("click", async () => {
    if (!preparedAssistantMessage) return;

    try {
      const messageToCopy = buildEmailMessage(preparedAssistantMessage);

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(messageToCopy);
      } else if (!fallbackCopy(messageToCopy)) {
        throw new Error("Clipboard copy unavailable");
      }

      setAssistantStatus(strings.assistant.copied, "success");
    } catch (error) {
      setAssistantStatus(strings.assistant.copyFailure, "error");
    }
  });

  chatContactFormLink?.addEventListener("click", (event) => {
    event.preventDefault();

    if (preparedAssistantMessage) {
      if (contactSubject) {
        contactSubject.value = preparedAssistantSubject;
      }

      if (contactMessage) {
        contactMessage.value = preparedAssistantMessage;
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
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && assistantIsOpen) {
      event.preventDefault();
      closeChatAssistant();
    }
  });
});
