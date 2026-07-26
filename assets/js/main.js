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
     MULTILINGUAL TEXT SYSTEM
  ========================= */

  const supportedLanguages = new Set(["en", "fr"]);
  const documentLanguage = (root.lang || "en")
    .toLowerCase()
    .split("-")[0];
  const language = supportedLanguages.has(documentLanguage)
    ? documentLanguage
    : "en";

  const messages = {
    en: {
      theme: {
        switchToLight: "Switch to light mode",
        switchToDark: "Switch to dark mode",
        light: "Light",
        dark: "Dark"
      },
      form: {
        sending: "Sending...",
        submit: "Send Message",
        notConfigured:
          "The contact form is not configured yet. Please use email or WhatsApp.",
        received: "Thank you. Your message has been received.",
        sendingStatus: "Sending your message...",
        serviceError: "The form service returned an error.",
        success:
          "Thank you. Your message has been sent successfully.",
        failure:
          "Your message could not be sent. Please contact Pacifique through email or WhatsApp."
      },
      copyEmail: {
        success: "Email copied to clipboard.",
        failure: "Copy failed. Use the email link instead."
      },
      assistant: {
        dashboard:
          "Your message is ready. Pacifique can help organize data, define KPIs, clean workbooks, and build clear dashboards. Choose Email, WhatsApp, or the contact form below.",
        support:
          "Your message is ready. Pacifique can help with Windows setup, troubleshooting, printers, networks, user support, and basic system maintenance. Choose a contact method below.",
        data:
          "Your message is ready. Pacifique can help clean datasets, check data quality, prepare analysis, and create reports with Excel, SQL, Python, or Google Sheets.",
        field:
          "Your message is ready. Pacifique can help with KoBoToolbox / ODK support, form testing, device setup, data validation, and reporting preparation.",
        opportunity:
          "Your recruiter message is ready. Include the IT Support role, employment or internship type, location or remote arrangement, timeline, and preferred contact method before continuing.",
        fallback:
          "Your message is ready. Choose Email, WhatsApp, or the contact form below to contact Pacifique.",
        emailSubject: "IT Support portfolio contact",
        emailGreeting: "Hello Pacifique,",
        emailClosing: "Best regards,"
      }
    },
    fr: {
      theme: {
        switchToLight: "Passer au mode clair",
        switchToDark: "Passer au mode sombre",
        light: "Clair",
        dark: "Sombre"
      },
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
          "Votre message est pr\u00EAt. Pacifique peut organiser les donn\u00E9es, d\u00E9finir les indicateurs, nettoyer les fichiers et construire des tableaux de bord clairs. Choisissez l\u2019email, WhatsApp ou le formulaire.",
        support:
          "Votre message est pr\u00EAt. Pacifique peut intervenir sur Windows, le d\u00E9pannage, les imprimantes, les r\u00E9seaux et l\u2019assistance aux utilisateurs. Choisissez un moyen de contact.",
        data:
          "Votre message est pr\u00EAt. Pacifique peut nettoyer les jeux de donn\u00E9es, contr\u00F4ler leur qualit\u00E9, pr\u00E9parer les analyses et produire des rapports avec Excel, SQL, Python ou Google Sheets.",
        field:
          "Votre message est pr\u00EAt. Pacifique peut accompagner l\u2019utilisation de KoBoToolbox / ODK, les tests de formulaires, la configuration des appareils, la validation et la pr\u00E9paration des rapports.",
        opportunity:
          "Votre message de recrutement est pr\u00EAt. Pr\u00E9cisez le poste en support informatique, le type d\u2019emploi ou de stage, le lieu ou l\u2019option \u00E0 distance, le calendrier et le moyen de contact souhait\u00E9.",
        fallback:
          "Votre message est pr\u00EAt. Choisissez l\u2019email, WhatsApp ou le formulaire pour contacter Pacifique.",
        emailSubject: "Contact portfolio pour le support informatique",
        emailGreeting: "Bonjour Pacifique,",
        emailClosing: "Cordialement,"
      }
    }
  };

  const strings = messages[language] || messages.en;
  root.dataset.language = language;
  window.PORTFOLIO_LANGUAGE = language;

  /* =========================
     TECHNICAL WORKBENCH COPY
     Phase 4
  ========================= */

  const workbenchScenarioSets = {
    en: {
      windows: {
        statusReady: "Windows and software workflow ready",
        statusRunning: "Running the Windows and software workflow...",
        statusComplete: "Windows and software workflow complete",
        result: "Working state restored",
        linkLabel: "View IT Support Case Study",
        href: "project-it-support-case-study.html",
        steps: [
          "Issue reported",
          "Windows and application checks performed",
          "Root cause isolated",
          "Working state restored"
        ]
      },
      network: {
        statusReady: "Network and printer workflow ready",
        statusRunning: "Running the network and printer workflow...",
        statusComplete: "Network and printer workflow complete",
        result: "Connection or printing restored",
        linkLabel: "View IT Support Case Study",
        href: "project-it-support-case-study.html",
        steps: [
          "Connectivity or printer problem reported",
          "Connection, IP, DNS, driver, and queue checks performed",
          "Fault isolated",
          "Connection or printing restored"
        ]
      },
      setup: {
        statusReady: "Workstation and user setup workflow ready",
        statusRunning: "Running the workstation and user setup workflow...",
        statusComplete: "Workstation and user setup workflow complete",
        result: "Workstation prepared for use",
        linkLabel: "View IT Support Case Study",
        href: "project-it-support-case-study.html",
        steps: [
          "User or workstation requirement received",
          "Windows, applications, account, and peripherals configured",
          "Updates and security settings checked",
          "Workstation prepared for use"
        ]
      }
    },
    fr: {
      windows: {
        statusReady: "Processus Windows et logiciels prêt",
        statusRunning: "Exécution du processus Windows et logiciels...",
        statusComplete: "Processus Windows et logiciels terminé",
        result: "Fonctionnement rétabli",
        linkLabel: "Voir l’étude de cas en support informatique",
        href: "../project-it-support-case-study.html",
        steps: [
          "Problème signalé",
          "Vérifications de Windows et des applications",
          "Cause principale isolée",
          "Fonctionnement rétabli"
        ]
      },
      network: {
        statusReady: "Processus réseau et imprimante prêt",
        statusRunning: "Exécution du processus réseau et imprimante...",
        statusComplete: "Processus réseau et imprimante terminé",
        result: "Connexion ou impression rétablie",
        linkLabel: "Voir l’étude de cas en support informatique",
        href: "../project-it-support-case-study.html",
        steps: [
          "Problème de connectivité ou d’impression signalé",
          "Vérifications de la connexion, de l’IP, du DNS, du pilote et de la file d’attente",
          "Défaillance isolée",
          "Connexion ou impression rétablie"
        ]
      },
      setup: {
        statusReady: "Processus de configuration du poste et de l’utilisateur prêt",
        statusRunning: "Exécution de la configuration du poste et de l’utilisateur...",
        statusComplete: "Configuration du poste et de l’utilisateur terminée",
        result: "Poste de travail prêt à l’emploi",
        linkLabel: "Voir l’étude de cas en support informatique",
        href: "../project-it-support-case-study.html",
        steps: [
          "Besoin de l’utilisateur ou du poste reçu",
          "Windows, applications, compte et périphériques configurés",
          "Mises à jour et paramètres de sécurité vérifiés",
          "Poste de travail prêt à l’emploi"
        ]
      }
    }
  };

  const workbenchScenarios =
    workbenchScenarioSets[language] || workbenchScenarioSets.en;

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
    toggle.setAttribute("aria-label", isDark ? strings.theme.switchToLight : strings.theme.switchToDark);

    if (icon) icon.textContent = isDark ? "☀" : "☾";
    if (text) text.textContent = isDark ? strings.theme.light : strings.theme.dark;

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

  if (loader) {
    loader.classList.add("hide");
    loader.hidden = true;
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
     TECHNICAL WORKBENCH ENGINE
     Phase 4
  ========================= */

  const workbench = document.querySelector("[data-workbench]");

  if (workbench && workbench.dataset.workbenchInitialized !== "true") {
    const controls = workbench.querySelector("[data-workbench-controls]");
    const output = workbench.querySelector("[data-workbench-output]");
    const status = document.getElementById("workbenchStatus");
    const result = workbench.querySelector("[data-workbench-result]");
    const stepsList = document.getElementById("workbenchSteps");
    const caseStudyLink = document.getElementById("workbenchCaseStudyLink");
    const scenarioButtons = Array.from(
      workbench.querySelectorAll("[data-workbench-scenario]")
    );

    const requiredScenarioKeys = ["windows", "network", "setup"];
    const availableScenarioKeys = scenarioButtons.map(
      (button) => button.dataset.workbenchScenario || ""
    );

    const workbenchIsComplete =
      controls &&
      output &&
      status &&
      result &&
      stepsList &&
      caseStudyLink &&
      requiredScenarioKeys.every(
        (key) =>
          availableScenarioKeys.includes(key) &&
          Object.prototype.hasOwnProperty.call(workbenchScenarios, key)
      );

    if (workbenchIsComplete) {
      workbench.dataset.workbenchInitialized = "true";

      let sequenceId = 0;
      let pointerFrameId = 0;
      let pendingWorkbenchPointer = null;
      const activeTimers = new Set();

      function clearWorkbenchTimers() {
        activeTimers.forEach((timerId) => {
          window.clearTimeout(timerId);
        });

        activeTimers.clear();
      }

      function setWorkbenchProgress(completedSteps, totalSteps) {
        const progress = totalSteps > 0
          ? Math.round((completedSteps / totalSteps) * 100)
          : 0;

        workbench.style.setProperty(
          "--workbench-progress",
          `${Math.max(0, Math.min(progress, 100))}%`
        );
      }

      function resetWorkbenchPointer() {
        pendingWorkbenchPointer = null;

        if (pointerFrameId) {
          window.cancelAnimationFrame(pointerFrameId);
          pointerFrameId = 0;
        }

        workbench.dataset.workbenchPointer = "idle";
        workbench.style.setProperty("--workbench-pointer-x", "78%");
        workbench.style.setProperty("--workbench-pointer-y", "12%");
      }

      function updateWorkbenchPointer(event) {
        if (prefersReducedMotion.matches) return;

        pendingWorkbenchPointer = {
          clientX: event.clientX,
          clientY: event.clientY
        };

        if (pointerFrameId) return;

        pointerFrameId = window.requestAnimationFrame(() => {
          const pointer = pendingWorkbenchPointer;

          pendingWorkbenchPointer = null;
          pointerFrameId = 0;

          if (!pointer) return;

          const rect = workbench.getBoundingClientRect();

          if (rect.width <= 0 || rect.height <= 0) return;

          const x = Math.max(0, Math.min(
            ((pointer.clientX - rect.left) / rect.width) * 100,
            100
          ));
          const y = Math.max(0, Math.min(
            ((pointer.clientY - rect.top) / rect.height) * 100,
            100
          ));

          workbench.style.setProperty(
            "--workbench-pointer-x",
            `${x.toFixed(2)}%`
          );
          workbench.style.setProperty(
            "--workbench-pointer-y",
            `${y.toFixed(2)}%`
          );
          workbench.dataset.workbenchPointer = "active";
        });
      }

      function cleanupWorkbenchInteractions() {
        clearWorkbenchTimers();
        resetWorkbenchPointer();
      }

      function scheduleWorkbenchStep(callback, delay) {
        const timerId = window.setTimeout(() => {
          activeTimers.delete(timerId);
          callback();
        }, delay);

        activeTimers.add(timerId);
      }

      function setActiveScenarioButton(activeKey) {
        scenarioButtons.forEach((button) => {
          const isActive =
            button.dataset.workbenchScenario === activeKey;

          button.classList.toggle("is-active", isActive);
          button.setAttribute("aria-pressed", String(isActive));
        });
      }

      function createWorkbenchStep(stepText, index, hidden) {
        const item = document.createElement("li");
        const number = document.createElement("span");
        const label = document.createElement("span");

        number.setAttribute("aria-hidden", "true");
        number.textContent = String(index + 1).padStart(2, "0");
        label.textContent = stepText;

        item.dataset.workbenchStepState = hidden
          ? "pending"
          : "complete";
        item.dataset.workbenchMotion = hidden
          ? "pending"
          : "settled";
        item.hidden = hidden;
        item.append(number, label);

        return item;
      }

      function showCompletedWorkbenchState(
        scenario,
        currentSequenceId,
        { withMotion = false } = {}
      ) {
        if (currentSequenceId !== sequenceId) return;

        const revealState = withMotion ? "visible" : "settled";

        result.textContent = scenario.result;
        result.hidden = false;
        result.dataset.workbenchReveal = revealState;

        caseStudyLink.textContent = scenario.linkLabel;
        caseStudyLink.href = scenario.href;
        caseStudyLink.hidden = false;
        caseStudyLink.dataset.workbenchReveal = revealState;

        setWorkbenchProgress(scenario.steps.length, scenario.steps.length);
        status.textContent = scenario.statusComplete;
        workbench.dataset.workbenchState = "complete";
        output.setAttribute("aria-busy", "false");
      }

      function activateWorkbenchScenario(
        scenarioKey,
        { animate = true, announce = true } = {}
      ) {
        const scenario = workbenchScenarios[scenarioKey];

        if (!scenario) return;

        sequenceId += 1;
        const currentSequenceId = sequenceId;

        clearWorkbenchTimers();
        setActiveScenarioButton(scenarioKey);

        const shouldAnimate =
          animate && !prefersReducedMotion.matches;

        workbench.dataset.workbenchActiveScenario = scenarioKey;
        workbench.dataset.workbenchState = shouldAnimate
          ? "running"
          : "complete";

        output.setAttribute(
          "aria-busy",
          String(shouldAnimate)
        );

        status.textContent = announce && animate
          ? scenario.statusRunning
          : scenario.statusReady;

        result.textContent = scenario.result;
        result.hidden = shouldAnimate;
        result.removeAttribute("data-workbench-reveal");

        caseStudyLink.textContent = scenario.linkLabel;
        caseStudyLink.href = scenario.href;
        caseStudyLink.hidden = shouldAnimate;
        caseStudyLink.removeAttribute("data-workbench-reveal");

        setWorkbenchProgress(
          shouldAnimate ? 0 : scenario.steps.length,
          scenario.steps.length
        );

        stepsList.replaceChildren();

        const stepItems = scenario.steps.map((stepText, index) => {
          const item = createWorkbenchStep(
            stepText,
            index,
            shouldAnimate
          );

          stepsList.appendChild(item);
          return item;
        });

        if (!shouldAnimate) {
          showCompletedWorkbenchState(
            scenario,
            currentSequenceId,
            { withMotion: false }
          );
          return;
        }

        const initialDelay = 140;
        const stepDelay = 300;

        stepItems.forEach((item, index) => {
          scheduleWorkbenchStep(() => {
            if (currentSequenceId !== sequenceId) return;

            item.hidden = false;
            item.dataset.workbenchStepState = "complete";
            item.dataset.workbenchMotion = "entering";
            setWorkbenchProgress(index + 1, stepItems.length);
          }, initialDelay + index * stepDelay);
        });

        scheduleWorkbenchStep(() => {
          showCompletedWorkbenchState(
            scenario,
            currentSequenceId,
            { withMotion: true }
          );
        }, initialDelay + stepItems.length * stepDelay + 120);
      }

      scenarioButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const scenarioKey =
            button.dataset.workbenchScenario || "";

          activateWorkbenchScenario(scenarioKey);
        });
      });

      const defaultScenario =
        workbench.dataset.workbenchDefault || "windows";

      activateWorkbenchScenario(
        defaultScenario,
        { animate: false, announce: false }
      );

      controls.hidden = false;

      if (finePointer.matches) {
        workbench.addEventListener(
          "pointermove",
          updateWorkbenchPointer,
          { passive: true }
        );
        workbench.addEventListener(
          "pointerleave",
          resetWorkbenchPointer
        );
      }

      window.addEventListener(
        "pagehide",
        cleanupWorkbenchInteractions,
        { once: true }
      );

      const reducedMotionChangeHandler = () => {
        if (!prefersReducedMotion.matches) return;

        resetWorkbenchPointer();

        const activeScenario =
          workbench.dataset.workbenchActiveScenario ||
          defaultScenario;

        activateWorkbenchScenario(
          activeScenario,
          { animate: false, announce: false }
        );
      };

      if (prefersReducedMotion.addEventListener) {
        prefersReducedMotion.addEventListener(
          "change",
          reducedMotionChangeHandler
        );
      } else if (prefersReducedMotion.addListener) {
        prefersReducedMotion.addListener(
          reducedMotionChangeHandler
        );
      }
    }
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
     Project filters
  ========================= */

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll(".project[data-category]");
  const emptyProjects = document.getElementById("projectEmpty");

  function updateProjectVisibility(project, shouldShow) {
    project.classList.toggle("is-hidden", !shouldShow);
    project.style.removeProperty("opacity");
    project.style.removeProperty("transform");
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

        scheduleScrollUi(true);
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

      const targetHadTabindex = target.hasAttribute("tabindex");

      if (!targetHadTabindex) {
        target.setAttribute("tabindex", "-1");
      }

      window.setTimeout(() => {
        target.focus({ preventScroll: true });

        if (!targetHadTabindex) {
          target.addEventListener(
            "blur",
            () => {
              target.removeAttribute("tabindex");
            },
            { once: true }
          );
        }
      }, prefersReducedMotion.matches ? 0 : 350);
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

  const sections = Array.from(
    document.querySelectorAll("section[id]")
  );
  const navLinks = document.querySelectorAll("nav a[href]");

  let sectionRanges = [];
  let scrollUiFrameId = 0;
  let sectionMetricsDirty = true;

  function cacheSectionRanges() {
    sectionRanges = sections.map((section) => {
      const top = section.offsetTop - 130;

      return {
        id: section.id,
        top,
        bottom: top + section.offsetHeight
      };
    });
  }

  function updateActiveNavigation() {
    if (!sectionRanges.length || !navLinks.length) return;

    let activeId = "";

    sectionRanges.forEach((range) => {
      if (
        window.scrollY >= range.top &&
        window.scrollY < range.bottom
      ) {
        activeId = range.id;
      }
    });

    if (!activeId) return;

    navLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const isSamePageHash =
        href === `#${activeId}` ||
        href.endsWith(`#${activeId}`);

      link.classList.toggle("active", isSamePageHash);
    });
  }

  function updateScrollUi() {
    updateScrollProgress();
    updateActiveNavigation();
  }

  function scheduleScrollUi(recalculateSections = false) {
    if (recalculateSections) {
      sectionMetricsDirty = true;
    }

    if (scrollUiFrameId) return;

    scrollUiFrameId = window.requestAnimationFrame(() => {
      if (sectionMetricsDirty) {
        cacheSectionRanges();
        sectionMetricsDirty = false;
      }

      updateScrollUi();
      scrollUiFrameId = 0;
    });
  }

  window.addEventListener(
    "scroll",
    () => scheduleScrollUi(),
    { passive: true }
  );
  window.addEventListener(
    "resize",
    () => scheduleScrollUi(true),
    { passive: true }
  );
  window.addEventListener(
    "load",
    () => scheduleScrollUi(true),
    { once: true }
  );

  scheduleScrollUi(true);

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
      contactSubmitText.textContent = isLoading ? strings.form.sending : strings.form.submit;
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
          strings.form.notConfigured,
          "error"
        );
        return;
      }

      // Silently accept likely bot submissions without sending them.
      if (honeypot && honeypot.value.trim()) {
        contactForm.reset();
        setContactFormStatus(
          strings.form.received,
          "success"
        );
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
          strings.form.success,
          "success"
        );
      } catch (error) {
        console.error("Contact form submission failed:", error);

        setContactFormStatus(
          strings.form.failure,
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

        setCopyStatus(strings.copyEmail.success);
      } catch (error) {
        setCopyStatus(strings.copyEmail.failure);
      }
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

        scheduleScrollUi(true);
      });
    });
  }
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
  let assistantFocusTimer = null;
  const assistantReplyTimers = new Set();

  function clearAssistantTimers() {
    window.clearTimeout(assistantCloseTimer);
    window.clearTimeout(assistantFocusTimer);
    assistantCloseTimer = null;
    assistantFocusTimer = null;

    assistantReplyTimers.forEach((timerId) => {
      window.clearTimeout(timerId);
    });
    assistantReplyTimers.clear();
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

  function openChatAssistant() {
    if (!chatAssistant || assistantIsOpen) return;

    window.clearTimeout(assistantCloseTimer);
    assistantCloseTimer = null;
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

    if (assistantLauncher) {
      assistantLauncher.setAttribute("aria-expanded", "false");
    }

    assistantCloseTimer = window.setTimeout(
      () => {
        assistantCloseTimer = null;
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

  function normalizeAssistantText(value) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function includesAssistantKeyword(value, keywords) {
    return keywords.some((keyword) => value.includes(keyword));
  }

  function buildAssistantReply(message) {
    const normalized = normalizeAssistantText(message);

    if (
      includesAssistantKeyword(normalized, [
        "job",
        "opportunity",
        "position",
        "role",
        "career",
        "hire",
        "hiring",
        "recruit",
        "intern",
        "internship",
        "emploi",
        "opportunite",
        "candidature",
        "embauche",
        "recrut",
        "stage"
      ])
    ) {
      return strings.assistant.opportunity;
    }

    if (
      includesAssistantKeyword(normalized, [
        "dashboard",
        "excel",
        "report",
        "rapport",
        "tableau de bord",
        "kpi"
      ])
    ) {
      return strings.assistant.dashboard;
    }

    if (
      includesAssistantKeyword(normalized, [
        "it support",
        "help desk",
        "desktop support",
        "technical support",
        "support",
        "computer",
        "printer",
        "network",
        "informatique",
        "ordinateur",
        "imprimante",
        "reseau",
        "depannage",
        "support technique",
        "technicien support"
      ])
    ) {
      return strings.assistant.support;
    }

    if (
      includesAssistantKeyword(normalized, [
        "data",
        "clean",
        "analysis",
        "sql",
        "python",
        "donnee",
        "nettoyage",
        "analyse"
      ])
    ) {
      return strings.assistant.data;
    }

    if (
      includesAssistantKeyword(normalized, [
        "kobo",
        "odk",
        "field",
        "terrain",
        "collecte"
      ])
    ) {
      return strings.assistant.field;
    }

    return strings.assistant.fallback;
  }

  function updateContactLinks(message) {
    const contactMessage = [
      strings.assistant.emailGreeting,
      "",
      message,
      "",
      strings.assistant.emailClosing
    ].join("\n");

    const encodedMessage = encodeURIComponent(contactMessage);
    const emailSubject = encodeURIComponent(
      strings.assistant.emailSubject
    );

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

    scheduleAssistantReply(
      () => {
        appendChatMessage(
          buildAssistantReply(cleanMessage),
          "assistant"
        );
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

  window.addEventListener(
    "pagehide",
    clearAssistantTimers,
    { once: true }
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && assistantIsOpen) {
      event.preventDefault();
      closeChatAssistant();
    }
  });
});
