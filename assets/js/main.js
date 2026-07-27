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
      }
    },
    fr: {
      theme: {
        switchToLight: "Passer au mode clair",
        switchToDark: "Passer au mode sombre",
        light: "Clair",
        dark: "Sombre"
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
        linkLabel: "View Network & Printer Case Study",
        href: "project-network-printer-case-study.html",
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
        linkLabel: "View Workstation Setup Case Study",
        href: "project-workstation-user-setup.html",
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
        linkLabel: "Voir l’étude réseau et imprimante",
        href: "project-network-printer-case-study.html",
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
        linkLabel: "Voir la configuration du poste",
        href: "project-workstation-user-setup.html",
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
});
