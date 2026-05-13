document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle"),
    menu = document.getElementById("menu"),
    track = document.getElementById("sliderTrack"),
    dotsWrap = document.getElementById("sliderDots"),
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

  if (!track || !slides.length) return;

  const GAP = 18;
  const origSlideCount = slides.length;
  const visibleCount = 3;
  const dotCount = Math.min(5, origSlideCount);
  const startClones = slides.slice(-visibleCount).map((slide) => slide.cloneNode(true));
  const endClones = slides.slice(0, visibleCount).map((slide) => slide.cloneNode(true));

  startClones.forEach((slide) => track.insertBefore(slide, track.firstChild));
  endClones.forEach((slide) => track.appendChild(slide));

  let index = visibleCount;

  const allSlides = [...track.querySelectorAll(".slide")];
  const slideWidth = () => allSlides[visibleCount].getBoundingClientRect().width + GAP;
  const dots = [];

  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement("span");
      dot.className = "sliderDot";
      dotsWrap.appendChild(dot);
      dots.push(dot);
    }
  }

  const setActiveDot = () => {
    if (!dots.length) return;
    const realIndex = ((index - visibleCount) % origSlideCount + origSlideCount) % origSlideCount;
    const activeDot = realIndex % dotCount;

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === activeDot);
    });
  };

  const update = () => {
    track.style.transition = "transform 0.6s ease";
    track.style.transform = `translateX(-${slideWidth() * index}px)`;
    setActiveDot();
  };

  track.addEventListener("transitionend", () => {
    if (index === origSlideCount + visibleCount) {
      track.style.transition = "none";
      index = visibleCount;
      track.style.transform = `translateX(-${slideWidth() * index}px)`;
      setActiveDot();
    }
  });

  const autoSlide = () => {
    index++;
    update();
  };

  setInterval(autoSlide, 1000);
  update();
});