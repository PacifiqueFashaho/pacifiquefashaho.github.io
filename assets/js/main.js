document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const root = document.documentElement;

  const year = document.getElementById("y2");
  if (year) year.textContent = new Date().getFullYear();

  function effectiveTheme() {
    return root.dataset.theme || (prefersDark.matches ? "dark" : "light");
  }

  function updateThemeToggle() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    const isDark = effectiveTheme() === "dark";
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    toggle.querySelector(".theme-toggle-icon").textContent = isDark ? "☀" : "☾";
    toggle.querySelector(".theme-toggle-text").textContent = isDark ? "Light" : "Dark";
  }

  function setTheme(theme) {
    root.dataset.theme = theme;
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch (error) {}
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

  const revealItems = document.querySelectorAll(".reveal");
  if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("show"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

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
      const current = roles[roleIndex];
      typingEl.textContent = current.slice(0, charIndex);

      if (!deleting && charIndex <= current.length) {
        charIndex += 1;
      } else if (deleting && charIndex >= 0) {
        charIndex -= 1;
      }

      if (charIndex > current.length) {
        deleting = true;
        window.setTimeout(typeLoop, 1200);
        return;
      }

      if (charIndex < 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        charIndex = 0;
      }

      window.setTimeout(typeLoop, deleting ? 45 : 70);
    }

    typeLoop();
  }

  const counters = document.querySelectorAll(".stat-num");

  function setCounter(el) {
    el.textContent = el.dataset.target || "0";
  }

  function animateCount(el) {
    const target = Number(el.dataset.target || 0);
    if (prefersReducedMotion.matches || target === 0) {
      setCounter(el);
      return;
    }

    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const interval = window.setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        window.clearInterval(interval);
      } else {
        el.textContent = current;
      }
    }, 20);
  }

  const statsSection = document.querySelector(".stats");
  if (statsSection && counters.length && "IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          counters.forEach(animateCount);
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  } else {
    counters.forEach(setCounter);
  }

  const skillSection = document.querySelector("#skills");
  const skillBars = document.querySelectorAll("#skills .bar-fill");

  function fillSkillBars() {
    skillBars.forEach((bar) => {
      bar.style.width = getComputedStyle(bar).getPropertyValue("--w");
    });
  }

  if (skillBars.length) {
    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      fillSkillBars();
    } else if (skillSection) {
      const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fillSkillBars();
            skillObserver.disconnect();
          }
        });
      }, { threshold: 0.25 });
      skillObserver.observe(skillSection);
    }
  }

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
        project.classList.toggle("is-hidden", !shouldShow);
        if (shouldShow) visibleCount += 1;
      });

      if (emptyProjects) emptyProjects.hidden = visibleCount !== 0;
    });
  });

  document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth", block: "start" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  const progressBar = document.getElementById("progressBar");
  const toTop = document.getElementById("toTop");

  function updateScrollUi() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = scrolled + "%";
    if (toTop) {
      const shouldShow = window.scrollY > 450;
      toTop.hidden = !shouldShow;
      toTop.classList.toggle("show", shouldShow);
    }
  }

  window.addEventListener("scroll", updateScrollUi, { passive: true });
  updateScrollUi();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const nameField = document.getElementById("contactName");
      const emailField = document.getElementById("contactEmail");
      const messageField = document.getElementById("contactMessage");
      const name = nameField ? nameField.value.trim() : "";
      const email = emailField ? emailField.value.trim() : "";
      const message = messageField ? messageField.value.trim() : "";
      const subject = encodeURIComponent("Portfolio contact request");
      const body = encodeURIComponent([
        name ? `Name: ${name}` : "",
        email ? `Email: ${email}` : "",
        "",
        message || "Hello Pacifique,"
      ].filter(Boolean).join("\n"));

      window.location.href = `mailto:pacifiquefashaho04@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});
