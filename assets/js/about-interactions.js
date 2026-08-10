document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".about-hero");
  const sections = {
    story: document.querySelector('[aria-labelledby="story-title"]'),
    disciplines: document.querySelector('[aria-labelledby="disciplines-title"]'),
    places: document.querySelector('[aria-labelledby="places-title"]'),
    values: document.querySelector('[aria-labelledby="values-title"]'),
    timeline: document.querySelector('[aria-labelledby="timeline-title"]')
  };

  if (!hero || Object.values(sections).some((section) => !section)) return;

  const isFrench = document.documentElement.lang.toLowerCase().startsWith("fr");
  const labels = isFrench
    ? {
        navigation: "Explorer mon parcours",
        eyebrow: "Explorer",
        story: "Mon parcours",
        disciplines: "Compétences",
        places: "Lieux",
        values: "Valeurs",
        timeline: "Chronologie"
      }
    : {
        navigation: "Explore my story",
        eyebrow: "Explore",
        story: "My story",
        disciplines: "Capabilities",
        places: "Places",
        values: "Values",
        timeline: "Timeline"
      };

  const navigation = document.createElement("nav");
  navigation.className = "about-journey";
  navigation.setAttribute("aria-label", labels.navigation);

  const eyebrow = document.createElement("span");
  eyebrow.textContent = labels.eyebrow;
  navigation.append(eyebrow);

  const links = document.createElement("div");

  Object.entries(sections).forEach(([id, section]) => {
    section.id = id;

    const link = document.createElement("a");
    link.href = `#${id}`;
    link.dataset.sectionLink = "";
    link.textContent = labels[id];
    link.addEventListener("click", () => {
      window.history.replaceState(null, "", link.hash);
    });
    links.append(link);
  });

  navigation.append(links);
  hero.insertAdjacentElement("afterend", navigation);
});
