document.addEventListener("DOMContentLoaded", () => {
  const sections = {
    story: document.querySelector('[aria-labelledby="story-title"]'),
    disciplines: document.querySelector('[aria-labelledby="disciplines-title"]'),
    places: document.querySelector('[aria-labelledby="places-title"]'),
    values: document.querySelector('[aria-labelledby="values-title"]'),
    timeline: document.querySelector('[aria-labelledby="timeline-title"]')
  };

  if (Object.values(sections).some((section) => !section)) return;
  Object.entries(sections).forEach(([id, section]) => { section.id = id; });

  if ("IntersectionObserver" in window) {
    const viewed = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || viewed.has(entry.target.id)) return;
        viewed.add(entry.target.id);
        window.portfolioAnalytics?.track("about_section_view", entry.target.id);
      });
    }, { threshold: 0.55 });
    Object.values(sections).forEach((section) => observer.observe(section));
  }
});
