/* =========================================================
   Pacifique Fashaho Portfolio
   Main JavaScript
   File: assets/js/main.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  /* =========================
     Footer year
  ========================= */

  const year = document.getElementById("y2");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* =========================
     Experience counter
  ========================= */

  const experienceCounter = document.querySelector('[data-counter="experience"]');
  const experienceItems = document.querySelectorAll("#experience .timeline-item");

  if (experienceCounter && experienceItems.length > 0) {
    experienceCounter.dataset.target = String(experienceItems.length);
  }

  /* =========================
     Theme system
  ========================= */

  function effectiveTheme() {
    return root.dataset.theme || (prefersDark.matches ? "dark" : "light");
  }

  function updateThemeToggle() {
    const toggle = document.getElementById("themeToggle");

    if (!toggle) return;

    const isDark = effectiveTheme() === "dark";
    const icon = toggle.querySelector(".theme-toggle-icon");
    const text = toggle.querySelector(".theme-toggle-text");

    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");

    if (icon) icon.textContent = isDark ? "☀" : "☾";
    if (text) text.textContent = isDark ? "Light" : "Dark";

    if (themeMeta) {
      themeMeta.setAttribute("content", isDark ? "#0b1220" : "#2563eb");
    }
  }

  function setTheme(theme) {
    root.dataset.theme = theme;

    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch (error) {
      /* localStorage can be unavailable */
    }

    updateThemeToggle();
  }

  const themeToggle = document.getElementById("themeToggle");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = effectiveTheme() === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    });

    updateThemeToggle();

    if (prefersDark.addEventListener) {
      prefersDark.addEventListener("change", updateThemeToggle);
    } else if (prefersDark.addListener) {
      prefersDark.addListener(updateThemeToggle);
    }
  }

  /* =========================
     Loader
  ========================= */

  const loader = document.getElementById("loader");

  function hideLoader() {
    if (!loader) return;

    loader.classList.add("hide");

    window.setTimeout(() => {
      loader.style.display = "none";
    }, 450);
  }

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader);
  }

  window.setTimeout(hideLoader, 2400);

  /* =========================
     Cursor spotlight
  ========================= */

  if (!prefersReducedMotion.matches && finePointer.matches) {
    let mouseTicking = false;

    document.addEventListener("mousemove", (event) => {
      if (mouseTicking) return;

      mouseTicking = true;

      window.requestAnimationFrame(() => {
        root.style.setProperty("--mouse-x", `${event.clientX}px`);
        root.style.setProperty("--mouse-y", `${event.clientY}px`);
        mouseTicking = false;
      });
    });
  }

  /* =========================
     Reveal animation
  ========================= */

  const revealItems = document.querySelectorAll(".reveal");

  if (revealItems.length > 0) {
    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("show"));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("show");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );

      revealItems.forEach((item) => revealObserver.observe(item));
    }
  }

  /* =========================
     Typing animation
  ========================= */

  const typingEl = document.getElementById("typing");

  const roles = [
    "IT Support Technician",
    "Data Analyst",
    "Technical Support",
    "Data Cleaning and Reporting",
    "Network Troubleshooting",
    "Junior Developer"
  ];

  if (typingEl && !prefersReducedMotion.matches) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const currentRole = roles[roleIndex];

      typingEl.textContent = currentRole.slice(0, charIndex);

      if (!deleting && charIndex < currentRole.length) {
        charIndex += 1;
        window.setTimeout(typeLoop, 70);
        return;
      }

      if (!deleting && charIndex === currentRole.length) {
        deleting = true;
        window.setTimeout(typeLoop, 1200);
        return;
      }

      if (deleting && charIndex > 0) {
        charIndex -= 1;
        window.setTimeout(typeLoop, 45);
        return;
      }

      if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        window.setTimeout(typeLoop, 250);
      }
    }

    typeLoop();
  }

  /* =========================
     Counters
  ========================= */

  const counters = document.querySelectorAll(".stat-num");

  function setCounter(el) {
    el.textContent = el.dataset.target || "0";
  }

  function animateCounter(el) {
    if (el.dataset.counted === "true") return;

    const target = Number(el.dataset.target || 0);

    if (target === 0 || prefersReducedMotion.matches) {
      setCounter(el);
      el.dataset.counted = "true";
      return;
    }

    el.dataset.counted = "true";

    const duration = 900;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);

      el.textContent = String(value);

      if (progress < 1) {
        window.requestAnimationFrame(update);
      } else {
        el.textContent = String(target);
      }
    }

    window.requestAnimationFrame(update);
  }

  if (counters.length > 0) {
    if ("IntersectionObserver" in window) {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );

      counters.forEach((counter) => counterObserver.observe(counter));
    } else {
      counters.forEach(setCounter);
    }
  }

  /* =========================
     Skill bars
  ========================= */

  const skillBars = document.querySelectorAll(".bar-fill");

  function fillSkillBar(bar) {
    const widthValue = getComputedStyle(bar).getPropertyValue("--w").trim();
    bar.style.width = widthValue || "0%";
  }

  if (skillBars.length > 0) {
    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      skillBars.forEach(fillSkillBar);
    } else {
      const skillObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              fillSkillBar(entry.target);
              skillObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.35 }
      );

      skillBars.forEach((bar) => skillObserver.observe(bar));
    }
  }

  /* =========================
     Project filters
  ========================= */

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll(".project[data-category]");
  const emptyProjects = document.getElementById("projectEmpty");

  function updateProjectVisibility(project, shouldShow) {
    if (prefersReducedMotion.matches) {
      project.classList.toggle("is-hidden", !shouldShow);
      return;
    }

    project.style.opacity = "0";
    project.style.transform = "translateY(8px)";

    window.setTimeout(() => {
      project.classList.toggle("is-hidden", !shouldShow);

      if (shouldShow) {
        project.style.opacity = "1";
        project.style.transform = "translateY(0)";
      }
    }, 160);
  }

  if (filterButtons.length > 0 && projects.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter || "all";
        let visibleCount = 0;

        filterButtons.forEach((item) => {
          const active = item === button;
          item.classList.toggle("active", active);
          item.setAttribute("aria-pressed", String(active));
        });

        projects.forEach((project) => {
          const categories = (project.dataset.category || "").split(/\s+/);
          const shouldShow = filter === "all" || categories.includes(filter);

          updateProjectVisibility(project, shouldShow);

          if (shouldShow) {
            visibleCount += 1;
          }
        });

        if (emptyProjects) {
          emptyProjects.hidden = visibleCount !== 0;
        }
      });
    });
  }

  /* =========================
     Smooth internal navigation
  ========================= */

  const hashLinks = document.querySelectorAll('a[href*="#"]');

  hashLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const url = new URL(href, window.location.href);

      const samePage =
        url.pathname === window.location.pathname ||
        url.pathname.endsWith(window.location.pathname.split("/").pop());

      if (!samePage) return;

      const target = document.querySelector(url.hash);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "start"
      });

      target.setAttribute("tabindex", "-1");

      window.setTimeout(() => {
        target.focus({ preventScroll: true });
      }, 350);
    });
  });

  /* =========================
     Scroll UI
  ========================= */

  const progressBar = document.getElementById("progressBar");
  const toTop = document.getElementById("toTop");

  function updateScrollProgress() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${scrolled}%`;
    }

    if (toTop) {
      const shouldShow = window.scrollY > 450;
      toTop.hidden = !shouldShow;
      toTop.classList.toggle("show", shouldShow);
    }
  }

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion.matches ? "auto" : "smooth"
      });
    });
  }

  /* =========================
     Active navigation
  ========================= */

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav a[href]");

  function updateActiveNavigation() {
    if (!sections.length || !navLinks.length) return;

    let activeId = "";

    sections.forEach((section) => {
      const top = section.offsetTop - 130;
      const bottom = top + section.offsetHeight;

      if (window.scrollY >= top && window.scrollY < bottom) {
        activeId = section.id;
      }
    });

    if (!activeId) return;

    navLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const isSamePageHash = href === `#${activeId}` || href.endsWith(`#${activeId}`);

      link.classList.toggle("active", isSamePageHash);
    });
  }

  function updateScrollUi() {
    updateScrollProgress();
    updateActiveNavigation();
  }

  let scrollTicking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;

      scrollTicking = true;

      window.requestAnimationFrame(() => {
        updateScrollUi();
        scrollTicking = false;
      });
    },
    { passive: true }
  );

  window.addEventListener("resize", updateScrollUi);
  updateScrollUi();

  /* =========================
     Contact service chips
  ========================= */

  const contactSubjectField = document.getElementById("contactSubject");
  const serviceButtons = document.querySelectorAll(".service-chip");

  if (serviceButtons.length > 0) {
    serviceButtons.forEach((button) => {
      button.addEventListener("click", () => {
        serviceButtons.forEach((item) => {
          const active = item === button;
          item.classList.toggle("active", active);
          item.setAttribute("aria-pressed", String(active));
        });

        if (contactSubjectField) {
          contactSubjectField.value = button.dataset.service || "";
          contactSubjectField.focus();
        }
      });
    });
  }

  /* =========================
     Contact form submission
  ========================= */

  const contactForm = document.getElementById("contactForm");
  const contactFormStatus = document.getElementById("contactFormStatus");
  const contactSubmitButton = document.getElementById("contactSubmitButton");
  const contactSubmitText = document.getElementById("contactSubmitText");

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
      contactSubmitText.textContent = isLoading ? "Sending..." : "Send Message";
    }
  }

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
        setContactFormStatus(
          "The contact form is not configured yet. Please use email or WhatsApp.",
          "error"
        );
        return;
      }

      // Silently accept likely bot submissions without sending them.
      if (honeypot && honeypot.value.trim()) {
        contactForm.reset();
        setContactFormStatus(
          "Thank you. Your message has been received.",
          "success"
        );
        return;
      }

      setContactFormLoading(true);
      setContactFormStatus("Sending your message...");

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: new FormData(contactForm),
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          let errorMessage = "The form service returned an error.";

          try {
            const errorData = await response.json();

            if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
              errorMessage = errorData.errors
                .map((item) => item.message)
                .filter(Boolean)
                .join(" ");
            }
          } catch (error) {
            // Keep the default message when the response is not JSON.
          }

          throw new Error(errorMessage);
        }

        contactForm.reset();

        serviceButtons.forEach((button) => {
          button.classList.remove("active");
          button.setAttribute("aria-pressed", "false");
        });

        setContactFormStatus(
          "Thank you. Your message has been sent successfully. Pacifique will respond as soon as possible.",
          "success"
        );
      } catch (error) {
        console.error("Contact form submission failed:", error);

        setContactFormStatus(
          "Your message could not be sent. Please contact Pacifique through email or WhatsApp.",
          "error"
        );
      } finally {
        setContactFormLoading(false);
      }
    });
  }
  /* =========================
     Copy email
  ========================= */

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
      const email = copyEmailButton.dataset.email || "pacifiquefashaho04@gmail.com";

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else if (!fallbackCopy(email)) {
          throw new Error("Clipboard copy unavailable");
        }

        setCopyStatus("Email copied to clipboard.");
      } catch (error) {
        setCopyStatus("Copy failed. Use the email link instead.");
      }
    });
  }

  /* =========================
     Ripple effect
  ========================= */

  const rippleTargets = document.querySelectorAll(
    ".btn, .pbtn, .cert-btn, .filter-btn, .copy-btn, .service-chip, .theme-toggle"
  );

  rippleTargets.forEach((target) => {
    target.addEventListener("click", (event) => {
      if (prefersReducedMotion.matches) return;

      const rect = target.getBoundingClientRect();
      const ripple = document.createElement("span");

      ripple.className = "ripple";
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;

      target.appendChild(ripple);

      window.setTimeout(() => {
        ripple.remove();
      }, 650);
    });
  });

  /* =========================
     Card tilt
  ========================= */

  const tiltCards = document.querySelectorAll(".project, .skill-card");

  if (!prefersReducedMotion.matches && finePointer.matches && tiltCards.length > 0) {
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const rotateX = -((y / rect.height) - 0.5) * 5;
        const rotateY = ((x / rect.width) - 0.5) * 5;

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* =========================
     Magnetic buttons
  ========================= */

  const magneticButtons = document.querySelectorAll(".btn, .pbtn");

  if (!prefersReducedMotion.matches && finePointer.matches && magneticButtons.length > 0) {
    magneticButtons.forEach((button) => {
      button.addEventListener("mousemove", (event) => {
        const rect = button.getBoundingClientRect();

        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
      });

      button.addEventListener("mouseleave", () => {
        button.style.transform = "";
      });
    });
  }

  /* =========================
     Experience accordion
  ========================= */

  const timelineDetails = document.querySelectorAll("#experience details.timeline-card");

  if (timelineDetails.length > 0) {
    timelineDetails.forEach((details) => {
      details.addEventListener("toggle", () => {
        if (!details.open) return;

        timelineDetails.forEach((other) => {
          if (other !== details) {
            other.open = false;
          }
        });
      });
    });
  }
  /* =========================
     LIVE HERO PANEL
  ========================= */

  const liveTime = document.getElementById("liveTime");
  const liveFocus = document.getElementById("liveFocus");
  const terminalLine = document.getElementById("terminalLine");

  function updateLiveTime() {
    if (!liveTime) return;

    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Lubumbashi",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    liveTime.textContent = formatter.format(new Date());
  }

  updateLiveTime();
  window.setInterval(updateLiveTime, 1000);

  const focusItems = [
    "Data cleaning and dashboard reporting",
    "Windows troubleshooting and user support",
    "Excel reporting and KPI summaries",
    "KoBoToolbox / ODK field data workflows",
    "Python, SQL, and portfolio improvements"
  ];

  let focusIndex = 0;

  function rotateLiveFocus() {
    if (!liveFocus) return;

    focusIndex = (focusIndex + 1) % focusItems.length;
    liveFocus.textContent = focusItems[focusIndex];
  }

  window.setInterval(rotateLiveFocus, 3000);

  const terminalMessages = [
    "Checking system reliability...",
    "Cleaning operational datasets...",
    "Building dashboard insights...",
    "Validating field data workflows...",
    "Reviewing IT support requests...",
    "Publishing portfolio improvements..."
  ];

  let terminalIndex = 0;
  let terminalCharIndex = 0;

  function typeTerminalLine() {
    if (!terminalLine) return;

    const message = terminalMessages[terminalIndex];

    terminalLine.textContent = message.slice(0, terminalCharIndex);

    if (terminalCharIndex < message.length) {
      terminalCharIndex += 1;
      window.setTimeout(typeTerminalLine, 45);
      return;
    }

    window.setTimeout(() => {
      terminalCharIndex = 0;
      terminalIndex = (terminalIndex + 1) % terminalMessages.length;
      typeTerminalLine();
    }, 1400);
  }

  typeTerminalLine();
  /* =========================
     QUICK CONTACT ASSISTANT
  ========================= */

  const assistantLauncher = document.getElementById("assistantLauncher");
  const assistantLauncherWrap = document.getElementById("assistantLauncherWrap");
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

  let assistantIsOpen = false;
  let assistantCloseTimer = null;

  function showAssistantLauncher() {
    if (!assistantLauncher) return;

    window.requestAnimationFrame(() => {
      assistantLauncher.classList.add("show");
    });
  }

  function openChatAssistant() {
    if (!chatAssistant || assistantIsOpen) return;

    window.clearTimeout(assistantCloseTimer);
    assistantIsOpen = true;
    chatAssistant.hidden = false;

    if (assistantLauncher) {
      assistantLauncher.setAttribute("aria-expanded", "true");
    }

    if (assistantLauncherWrap) {
      assistantLauncherWrap.hidden = true;
    }

    window.requestAnimationFrame(() => {
      chatAssistant.classList.add("show");
    });

    if (chatInput) {
      window.setTimeout(() => {
        chatInput.focus();
      }, prefersReducedMotion.matches ? 0 : 220);
    }
  }

  function closeChatAssistant({ restoreFocus = true } = {}) {
    if (!chatAssistant || !assistantIsOpen) return;

    assistantIsOpen = false;
    chatAssistant.classList.remove("show");

    if (assistantLauncher) {
      assistantLauncher.setAttribute("aria-expanded", "false");
    }

    assistantCloseTimer = window.setTimeout(
      () => {
        chatAssistant.hidden = true;

        if (assistantLauncherWrap) {
          assistantLauncherWrap.hidden = false;
        }

        showAssistantLauncher();

        if (restoreFocus && assistantLauncher) {
          assistantLauncher.focus();
        }
      },
      prefersReducedMotion.matches ? 0 : 260
    );
  }

  function minimizeChatAssistant() {
    closeChatAssistant();
  }

  function appendChatMessage(message, type) {
    if (!chatBody) return;

    const messageRow = document.createElement("div");
    const bubble = document.createElement("div");

    messageRow.className = `chat-message ${
      type === "visitor" ? "visitor-message" : "assistant-message"
    }`;
    bubble.className = "chat-bubble";
    bubble.textContent = message;

    messageRow.appendChild(bubble);
    chatBody.appendChild(messageRow);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function buildAssistantReply(message) {
    const lower = message.toLowerCase();

    if (
      lower.includes("dashboard") ||
      lower.includes("excel") ||
      lower.includes("report")
    ) {
      return "Your message is ready. Pacifique can help organize data, define KPIs, clean workbooks, and build clear dashboards. Choose Email, WhatsApp, or the contact form below.";
    }

    if (
      lower.includes("it") ||
      lower.includes("support") ||
      lower.includes("computer") ||
      lower.includes("printer") ||
      lower.includes("network")
    ) {
      return "Your message is ready. Pacifique can help with Windows setup, troubleshooting, printers, networks, user support, and basic system maintenance. Choose a contact method below.";
    }

    if (
      lower.includes("data") ||
      lower.includes("clean") ||
      lower.includes("analysis") ||
      lower.includes("sql") ||
      lower.includes("python")
    ) {
      return "Your message is ready. Pacifique can help clean datasets, check data quality, prepare analysis, and create reports with Excel, SQL, Python, or Google Sheets.";
    }

    if (
      lower.includes("kobo") ||
      lower.includes("odk") ||
      lower.includes("field")
    ) {
      return "Your message is ready. Pacifique can help with KoBoToolbox / ODK support, form testing, device setup, data validation, and reporting preparation.";
    }

    if (
      lower.includes("job") ||
      lower.includes("opportunity") ||
      lower.includes("work") ||
      lower.includes("hire")
    ) {
      return "Your message is ready. Include the role, location or remote option, timeline, and preferred contact method before continuing.";
    }

    return "Your message is ready. Choose Email, WhatsApp, or the contact form below to contact Pacifique.";
  }

  function updateContactLinks(message) {
    const encodedMessage = encodeURIComponent(
      `Hello Pacifique,\n\n${message}\n\nBest regards,`
    );
    const emailSubject = encodeURIComponent("Portfolio contact request");

    if (chatEmailLink) {
      chatEmailLink.href =
        `mailto:pacifiquefashaho04@gmail.com?subject=${emailSubject}&body=${encodedMessage}`;
    }

    if (chatWhatsappLink) {
      chatWhatsappLink.href =
        `https://wa.me/243859477758?text=${encodedMessage}`;
    }
  }

  function handleChatSubmit(message) {
    const cleanMessage = message.trim();

    if (!cleanMessage) {
      if (chatInput) {
        chatInput.focus();
      }

      return;
    }

    appendChatMessage(cleanMessage, "visitor");
    updateContactLinks(cleanMessage);

    if (chatInput) {
      chatInput.value = "";
    }

    window.setTimeout(
      () => {
        appendChatMessage(buildAssistantReply(cleanMessage), "assistant");
      },
      prefersReducedMotion.matches ? 0 : 350
    );
  }

  // The launcher is visible, but the assistant never opens without a click.
  showAssistantLauncher();

  if (assistantLauncher) {
    assistantLauncher.addEventListener("click", openChatAssistant);
  }

  if (chatClose) {
    chatClose.addEventListener("click", () => {
      closeChatAssistant();
    });
  }

  if (chatMinimize) {
    chatMinimize.addEventListener("click", minimizeChatAssistant);
  }

  if (chatForm) {
    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!chatInput) return;
      handleChatSubmit(chatInput.value);
    });
  }

  chatSuggestions.forEach((suggestion) => {
    suggestion.addEventListener("click", () => {
      const message =
        suggestion.dataset.message || suggestion.textContent || "";

      handleChatSubmit(message);
    });
  });

  if (chatContactFormLink) {
    chatContactFormLink.addEventListener("click", () => {
      closeChatAssistant({ restoreFocus: false });
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && assistantIsOpen) {
      event.preventDefault();
      closeChatAssistant();
    }
  });
});