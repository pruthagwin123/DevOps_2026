const animateCounter = (el, target, suffix = "") => {
  const duration = 1400;
  const start = performance.now();

  const step = (t) => {
    const progress = Math.min(1, (t - start) / duration);
    const value = target * progress;
    el.textContent = `${value.toFixed(2).replace(/\.00$/, "")}${suffix}`;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

const initLanding = () => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });

  animateCounter(document.getElementById("stat-grid"), 84, "%");
  animateCounter(document.getElementById("stat-cost"), 87, "%");
  animateCounter(document.getElementById("stat-mape"), 3.63, "%");
};

document.addEventListener("DOMContentLoaded", initLanding);
