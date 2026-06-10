/* =========================================================
   Pacifique Fashaho Portfolio — Improved main.js
   Interactions: theme, loader, typing, reveal, counters,
   filters, contact form, copy email, active nav, ripple,
   cursor spotlight, card tilt, scroll progress.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  /* =========================
     FOOTER YEAR
  ========================= */

  const year = document.getElementById("y2");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* =========================
     EXPERIENCE COUNTER AUTO COUNT
  ========================= */

  const experienceCounter = document.querySelector('[data-counter="experience"]');
  const experienceCount = document.querySelectorAll("#experience .timeline-item").length;

  if (experienceCounter && experienceCount) {
    experienceCounter.dataset.target = String(experienceCount);
  }

  /* =========================
     THEME SYSTEM
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
      // localStorage may be unavailable in some privacy modes.
    }

    updateThemeToggle();
  }

  const themeToggle = document.getElementById("themeToggle");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      setTheme(effectiveTheme() === "dark" ? "light" : "dark");
    });

    updateThemeToggle();

    if (prefersDark.addEventListener) {
      prefersDark.addEventListener("change", updateThemeToggle);
    } else if (prefersDark.addListener) {
      prefersDark.addListener(updateThemeToggle);
    }
  }

  /* =========================
     LOADER
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

  /* Fallback: never keep loader forever */
  window.setTimeout(hideLoader, 2200);

  /* =========================
     CURSOR SPOTLIGHT
  ========================= */

  if (!prefersReducedMotion.matches && window.matchMedia("(pointer: fine)").matches) {
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
     REVEAL ON SCROLL
  ========================= */

  const revealItems = document.querySelectorAll(".reveal");

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
      {
        threshold: 0.12
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* =========================
     TYPING ANIMATION
  ========================= */

  const typingEl = document.getElementById("typing");

  const roles = [
    "IT Support Technician",
    "Data Analyst",
    "Junior Developer",
    "System Troubleshooting",
    "Excel and SQL Dashboards",
    "KoBoToolbox / ODK Field Data"
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
     STATS COUNTER
  ========================= */

  const counters = document.querySelectorAll(".stat-num");

  function setCounter(el) {
    el.textContent = el.dataset.target || "0";
  }

  function animateCounter(el) {
    const target = Number(el.dataset.target || 0);

    if (prefersReducedMotion.matches || target === 0) {
      setCounter(el);
      return;
    }

    let current = 0;
    const duration = 900;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      current = Math.round(target * eased);
      el.textContent = String(current);

      if (progress < 1) {
        window.requestAnimationFrame(update);
      } else {
        el.textContent = String(target);
      }
    }

    window.requestAnimationFrame(update);
  }

  const statsSection = document.querySelector(".stats");

  if (statsSection && counters.length && "IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            counters.forEach(animateCounter);
            statsObserver.disconnect();
          }
        });
      },
      {
        threshold: 0.3
      }
    );

    statsObserver.observe(statsSection);
  } else {
    counters.forEach(setCounter);
  }

  /* =========================
     SKILL BAR ANIMATION
  ========================= */

  const skillSection = document.querySelector("#skills");
  const skillBars = document.querySelectorAll("#skills .bar-fill");

  function fillSkillBars() {
    skillBars.forEach((bar) => {
      const widthValue = getComputedStyle(bar).getPropertyValue("--w").trim();
      bar.style.width = widthValue || "0%";
    });
  }

  if (skillBars.length) {
    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      fillSkillBars();
    } else if (skillSection) {
      const skillObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              fillSkillBars();
              skillObserver.disconnect();
            }
          });
        },
        {
          threshold: 0.25
        }
      );

      skillObserver.observe(skillSection);
    }
  }

  /* =========================
     PROJECT FILTERS
  ========================= */

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll(".project[data-category]");
  const emptyProjects = document.getElementById("projectEmpty");

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

        if (prefersReducedMotion.matches) {
          project.classList.toggle("is-hidden", !shouldShow);
        } else {
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

        if (shouldShow) visibleCount += 1;
      });

      if (emptyProjects) {
        emptyProjects.hidden = visibleCount !== 0;
      }
    });
  });

  /* =========================
     SMOOTH INTERNAL NAVIGATION
  ========================= */

  const internalLinks = document.querySelectorAll('nav a[href^="#"], .project-actions a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "start"
      });

      target.setAttribute("tabindex", "-1");

      window.setTimeout(() => {
        target.focus({
          preventScroll: true
        });
      }, 350);
    });
  });

  /* =========================
     SCROLL PROGRESS + BACK TO TOP + ACTIVE NAV
  ========================= */

  const progressBar = document.getElementById("progressBar");
  const toTop = document.getElementById("toTop");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

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

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const isActive = href === `#${activeId}`;

      link.classList.toggle("active", isActive);
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
    {
      passive: true
    }
  );

  window.addEventListener("resize", updateScrollUi);

  updateScrollUi();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion.matches ? "auto" : "smooth"
      });
    });
  }

  /* =========================
     CONTACT SERVICE CHIPS
  ========================= */

  const contactForm = document.getElementById("contactForm");
  const contactSubjectField = document.getElementById("contactSubject");
  const contactFormStatus = document.getElementById("contactFormStatus");
  const serviceButtons = document.querySelectorAll(".service-chip");

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

  /* =========================
     CONTACT FORM MAILTO
  ========================= */

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (contactForm.reportValidity && !contactForm.reportValidity()) {
        return;
      }

      const nameField = document.getElementById("contactName");
      const emailField = document.getElementById("contactEmail");
      const messageField = document.getElementById("contactMessage");

      const name = nameField ? nameField.value.trim() : "";
      const email = emailField ? emailField.value.trim() : "";
      const subjectValue = contactSubjectField ? contactSubjectField.value.trim() : "";
      const message = messageField ? messageField.value.trim() : "";

      const selectedService = document.querySelector('.service-chip[aria-pressed="true"]');

      const service =
        subjectValue ||
        (selectedService ? selectedService.dataset.service : "") ||
        "Portfolio contact request";

      const subject = encodeURIComponent(`Portfolio contact: ${service}`);

      const body = encodeURIComponent(
        [
          "Hello Pacifique,",
          "",
          name ? `Name: ${name}` : "",
          email ? `Email: ${email}` : "",
          service ? `Service needed: ${service}` : "",
          "",
          message
        ]
          .filter(Boolean)
          .join("\n")
      );

      if (contactFormStatus) {
        contactFormStatus.textContent = "Opening your email app...";
      }

      window.location.href = `mailto:pacifiquefashaho04@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  /* =========================
     COPY EMAIL
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
     RIPPLE EFFECT
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
     CARD TILT EFFECT
  ========================= */

  const tiltCards = document.querySelectorAll(".project, .skill-card");

  if (!prefersReducedMotion.matches && window.matchMedia("(pointer: fine)").matches) {
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
     MAGNETIC BUTTON EFFECT
  ========================= */

  const magneticButtons = document.querySelectorAll(".btn, .pbtn");

  if (!prefersReducedMotion.matches && window.matchMedia("(pointer: fine)").matches) {
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
     CLOSE OTHER TIMELINE DETAILS OPTIONAL
     Keeps experience section cleaner.
  ========================= */

  const timelineDetails = document.querySelectorAll("#experience details.timeline-card");

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
});