/* =========================================================
   Pacifique Fashaho Portfolio
   Main JavaScript
   File: assets/js/main.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
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
