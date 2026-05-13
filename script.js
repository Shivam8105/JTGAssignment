document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle"),
    menu = document.getElementById("menu"),
    track = document.getElementById("sliderTrack"),
    dotsWrap = document.getElementById("dots"),
    prevBtn = document.getElementById("prevBtn"),
    nextBtn = document.getElementById("nextBtn"),
    slides = track ? [...track.querySelectorAll(".slide")] : [];

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    menu.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          menu.classList.remove("open");
          menuToggle.setAttribute("aria-expanded", "false");
        }
      })
    );
  }

  if (!track || !dotsWrap || !slides.length) return;

  const GAP = 18;
  let index = 0,
    startX = 0,
    down = false;

  const slideWidth = () => slides[0].getBoundingClientRect().width + GAP;
  const maxIndex = () =>
    Math.max(
      0,
      slides.length - Math.max(1, Math.floor(((track.closest(".sliderWindow")?.clientWidth || 0) + GAP) / slideWidth()))
    );

  const update = () => {
    index = Math.max(0, Math.min(index, maxIndex()));
    track.style.transition = "transform .4s ease";
    track.style.transform = `translateX(-${slideWidth() * index}px)`;
    [...dotsWrap.children].forEach((dot, i) => dot.classList.toggle("active", i === index));
  };

  const buildDots = () => {
    dotsWrap.innerHTML = "";
    for (let i = 0; i <= maxIndex(); i++) {
      const dot = document.createElement("div");
      dot.className = `dot${i === index ? " active" : ""}`;
      dot.addEventListener("click", () => {
        index = i;
        update();
      });
      dotsWrap.appendChild(dot);
    }
  };

  buildDots();
  nextBtn?.addEventListener("click", () => { index += 1; update(); });
  prevBtn?.addEventListener("click", () => { index -= 1; update(); });

  track.addEventListener("touchstart", (e) => {
    down = true;
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    if (!down) return;
    down = false;
    const diff = e.changedTouches[0].clientX - startX;
    if (diff < -50) index += 1;
    if (diff > 50) index -= 1;
    update();
  });

  window.addEventListener("resize", () => {
    track.style.transition = "none";
    buildDots();
    update();
  });

  update();
});