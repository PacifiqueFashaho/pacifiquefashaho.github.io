  // year
document.getElementById("y2").textContent = new Date().getFullYear();

  // reveal on scroll
  const items = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) e.target.classList.add("show");
    });
  }, {threshold: 0.12});
  items.forEach(el => io.observe(el));

  const typingEl = document.getElementById("typing");
    const roles = [
      "Data Analyst",
      "IT Support",
      "System Troubleshooting",
      "Windows Setup", 
      "Network Configuration",
      "IT Solutions Specialist"
    ];

  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop(){
    const current = roles[roleIndex];

    if(!deleting){
      typingEl.textContent = current.slice(0, charIndex++);
      if(charIndex > current.length){
        deleting = true;
        setTimeout(typeLoop, 1200);
        return;
      }
    } else {
      typingEl.textContent = current.slice(0, charIndex--);
      if(charIndex < 0){
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        charIndex = 0;
      }
    }

    setTimeout(typeLoop, deleting ? 45 : 70);
  }
  typeLoop();

  const counters = document.querySelectorAll(".stat-num");

  function animateCount(el){
    const target = +el.dataset.target;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 60));

    const interval = setInterval(() => {
      current += step;
      if(current >= target){
        el.textContent = target;
        clearInterval(interval);
      } else {
        el.textContent = current;
      }
    }, 20);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        counters.forEach(animateCount);
        statsObserver.disconnect();
      }
    });
  }, {threshold: 0.3});

  const statsSection = document.querySelector(".stats");
  if(statsSection) statsObserver.observe(statsSection);

  const progressBar = document.getElementById("progressBar");
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrolled + "%";
  });

  const toTop = document.getElementById("toTop");
  window.addEventListener("scroll", () => {
    if(window.scrollY > 450) toTop.classList.add("show");
    else toTop.classList.remove("show");
  });

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
    // Animate skill bars when Skills section becomes visible
const skillSection = document.querySelector("#skills");
const skillBars = document.querySelectorAll("#skills .bar-fill");

if (skillSection && skillBars.length) {
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach(b => b.style.width = getComputedStyle(b).getPropertyValue("--w"));
        skillObs.disconnect();
      }
    });
  }, { threshold: 0.25 });

  skillObs.observe(skillSection);
}
