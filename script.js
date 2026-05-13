document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    menu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          menu.classList.remove("open");
          menuToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  const track = document.getElementById("sliderTrack");
  const cards = document.querySelectorAll("#sliderTrack .slide");
  const dotsWrap = document.getElementById("dots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!track || cards.length === 0 || !dotsWrap) return;

  const GAP = 18;
  let index = 0;

  const cardWidth = () => cards[0].getBoundingClientRect().width;

  function maxIndex() {
    const windowEl = track.closest(".sliderWindow");
    if (!windowEl) return cards.length - 1;

    const visible = Math.max(1, Math.floor((windowEl.clientWidth + GAP) / (cardWidth() + GAP)));
    return Math.max(0, cards.length - visible);
  }

  function clampIndex() {
    index = Math.max(0, Math.min(index, maxIndex()));
  }

  function update() {
    clampIndex();
    const offset = (cardWidth() + GAP) * index;
    track.style.transition = "transform .4s ease";
    track.style.transform = `translateX(-${offset}px)`;

    dotsWrap.querySelectorAll(".dot").forEach((d, i) => {
      d.classList.toggle("active", i === index);
    });
  }

  function rebuildDots() {
    dotsWrap.innerHTML = "";
    const steps = maxIndex() + 1;

    for (let i = 0; i < steps; i++) {
      const dot = document.createElement("div");
      dot.className = "dot" + (i === index ? " active" : "");
      dot.addEventListener("click", () => {
        index = i;
        update();
      });
      dotsWrap.appendChild(dot);
    }
  }

  rebuildDots();

  if (nextBtn) nextBtn.addEventListener("click", () => {
    index += 1;
    update();
  });

  if (prevBtn) prevBtn.addEventListener("click", () => {
    index -= 1;
    update();
  });

  let startX = 0;
  let down = false;

  track.addEventListener("touchstart", (e) => {
    down = true;
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    if (!down) return;
    down = false;

    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (diff < -50) index += 1;
    if (diff > 50) index -= 1;
    update();
  });

  window.addEventListener("resize", () => {
    track.style.transition = "none";
    clampIndex();
    rebuildDots();
    update();
  });

  update();
});