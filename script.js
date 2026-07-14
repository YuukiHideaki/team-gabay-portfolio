// Shared page behavior for navigation, motion effects, galleries, and the contact form.
const pageName = document.body.dataset.page;
const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");
const toast = document.getElementById("toast");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Adds a soft fade when moving between local HTML pages.
function setupPageTransitions() {
  document.body.classList.add("page-ready");

  window.addEventListener("pageshow", () => {
    document.body.classList.remove("page-leaving");
    document.body.classList.add("page-ready");
  });

  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const url = new URL(link.href, window.location.href);
      const isSameSite = url.origin === window.location.origin;
      const isHtmlPage = url.pathname.endsWith(".html") || url.pathname.endsWith("/");
      const opensNewTab = link.target && link.target !== "_self";
      const downloadsFile = link.hasAttribute("download");
      const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

      if (!isSameSite || !isHtmlPage || opensNewTab || downloadsFile || isModifiedClick || reduceMotion) {
        return;
      }

      event.preventDefault();
      document.body.classList.add("page-leaving");

      window.setTimeout(() => {
        window.location.href = url.href;
      }, 240);
    });
  });
}

// Tilts the home-page device mockup based on pointer position.
function setupMotionEffects() {
  if (reduceMotion) return;

  const heroDevice = document.querySelector(".hero-device");

  if (heroDevice) {
    heroDevice.addEventListener("mousemove", (event) => {
      const rect = heroDevice.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      heroDevice.style.setProperty("--tilt-x", `${x * 7}deg`);
      heroDevice.style.setProperty("--tilt-y", `${y * -5}deg`);
    });

    heroDevice.addEventListener("mouseleave", () => {
      heroDevice.style.setProperty("--tilt-x", "0deg");
      heroDevice.style.setProperty("--tilt-y", "0deg");
    });
  }
}

// Shows a short status message near the bottom of the page.
function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

// Opens and closes the mobile navigation menu.
function setupMobileMenu() {
  if (!menuButton || !mobileMenu) return;

  menuButton.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuButton.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!mobileMenu.contains(event.target) && !menuButton.contains(event.target)) {
      mobileMenu.classList.remove("open");
      menuButton.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

// Marks the matching desktop navigation link for the current page.
function setupActiveLinks() {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === pageName);
  });
}

// Reveals sections as they enter the viewport.
function setupRevealAnimations() {
  const items = document.querySelectorAll(".section-reveal, .reveal-item");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((item, index) => {
    item.style.setProperty("--delay", `${Math.min(index * 45, 220)}ms`);
    observer.observe(item);
  });
}

// Rotates the philosophy cards on the home page.
function setupRotatingCards() {
  if (reduceMotion) return;

  const cards = document.querySelectorAll("[data-rotating-card]");
  if (cards.length === 0) return;

  let activeIndex = 0;

  window.setInterval(() => {
    cards[activeIndex].classList.remove("active");
    activeIndex = (activeIndex + 1) % cards.length;
    cards[activeIndex].classList.add("active");
  }, 2400);
}

// Types and deletes the rotating hero phrases.
function setupTypewriterText() {
  const typewriter = document.querySelector("[data-typewriter]");
  const textTarget = document.querySelector("[data-typewriter-text]");

  if (!typewriter || !textTarget) return;

  const phrases = typewriter.dataset.phrases.split("|");

  if (reduceMotion) {
    textTarget.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let letterIndex = 0;
  let isDeleting = false;

  function typeNextLetter() {
    const currentPhrase = phrases[phraseIndex];
    textTarget.textContent = currentPhrase.slice(0, letterIndex);

    if (!isDeleting && letterIndex < currentPhrase.length) {
      letterIndex += 1;
      window.setTimeout(typeNextLetter, 70);
      return;
    }

    if (!isDeleting) {
      isDeleting = true;
      window.setTimeout(typeNextLetter, 1200);
      return;
    }

    if (letterIndex > 0) {
      letterIndex -= 1;
      window.setTimeout(typeNextLetter, 35);
      return;
    }

    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    window.setTimeout(typeNextLetter, 250);
  }

  typeNextLetter();
}

// Controls the featured-project carousel, including dots, arrows, autoplay, and dragging.
function setupProjectSlider() {
  const slider = document.querySelector("[data-project-slider]");
  if (!slider) return;

  const track = slider.querySelector(".project-slider-track");
  const slides = Array.from(slider.querySelectorAll("[data-project-slide]"));
  const dots = Array.from(slider.querySelectorAll("[data-project-dot]"));
  const prevButton = slider.querySelector("[data-project-prev]");
  const nextButton = slider.querySelector("[data-project-next]");

  if (!track || slides.length === 0) return;

  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  firstClone.setAttribute("aria-hidden", "true");
  lastClone.setAttribute("aria-hidden", "true");
  firstClone.querySelectorAll("a").forEach((link) => link.setAttribute("tabindex", "-1"));
  lastClone.querySelectorAll("a").forEach((link) => link.setAttribute("tabindex", "-1"));
  track.append(firstClone);
  track.prepend(lastClone);

  // Cloned end slides create a smooth looping carousel.
  const allSlides = Array.from(track.querySelectorAll(".project-slide"));
  let currentIndex = 0;
  let positionIndex = 1;
  let autoTimer = null;
  let startX = 0;
  let dragOffset = 0;
  let isDragging = false;
  let movedDuringDrag = false;
  let isSliding = false;

  function getSlideStep() {
    const slide = slides[0];
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 0;
    return slide.getBoundingClientRect().width + gap;
  }

  function updateDots() {
    dots.forEach((dot, index) => {
      const isActive = index === currentIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function setTrackPosition(index, offset = 0, animate = true) {
    track.style.transition = animate ? "" : "none";
    track.style.transform = `translateX(${index * -getSlideStep() + offset}px)`;

    if (!animate) {
      track.getBoundingClientRect();
      track.style.transition = "";
    }
  }

  function moveToSlide(index, offset = 0, animate = true) {
    currentIndex = (index + slides.length) % slides.length;
    positionIndex = currentIndex + 1;
    setTrackPosition(positionIndex, offset, animate);
    updateDots();
  }

  function moveToNextSlide() {
    if (isSliding) return;
    isSliding = true;
    positionIndex += 1;
    currentIndex = (currentIndex + 1) % slides.length;
    setTrackPosition(positionIndex);
    updateDots();
  }

  function moveToPreviousSlide() {
    if (isSliding) return;
    isSliding = true;
    positionIndex -= 1;
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    setTrackPosition(positionIndex);
    updateDots();
  }

  track.addEventListener("transitionend", (event) => {
    if (event.target !== track) return;

    if (positionIndex === allSlides.length - 1) {
      positionIndex = 1;
      setTrackPosition(positionIndex, 0, false);
    }

    if (positionIndex === 0) {
      positionIndex = slides.length;
      setTrackPosition(positionIndex, 0, false);
    }

    isSliding = false;
  });

  function stopAutoSlide() {
    if (autoTimer) {
      window.clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function startAutoSlide() {
    if (reduceMotion) return;
    stopAutoSlide();
    autoTimer = window.setInterval(() => {
      moveToNextSlide();
    }, 6500);
  }

  function restartAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      moveToSlide(index);
      restartAutoSlide();
    });
  });

  prevButton?.addEventListener("click", () => {
    moveToPreviousSlide();
    restartAutoSlide();
  });

  nextButton?.addEventListener("click", () => {
    moveToNextSlide();
    restartAutoSlide();
  });

  track.addEventListener("pointerdown", (event) => {
    if (event.target.closest("a")) return;

    isDragging = true;
    isSliding = false;
    movedDuringDrag = false;
    startX = event.clientX;
    dragOffset = 0;
    slider.classList.add("dragging");
    track.setPointerCapture(event.pointerId);
    stopAutoSlide();
  });

  track.addEventListener("pointermove", (event) => {
    if (!isDragging) return;

    dragOffset = event.clientX - startX;
    if (Math.abs(dragOffset) > 8) movedDuringDrag = true;
    setTrackPosition(positionIndex, dragOffset, false);
  });

  function finishDrag() {
    if (!isDragging) return;

    // Change slides only after a deliberate swipe distance.
    const shouldChangeSlide = Math.abs(dragOffset) > getSlideStep() * 0.18;

    slider.classList.remove("dragging");
    isDragging = false;

    if (shouldChangeSlide) {
      if (dragOffset < 0) {
        moveToNextSlide();
      } else {
        moveToPreviousSlide();
      }
    } else {
      setTrackPosition(positionIndex);
      isSliding = false;
    }

    restartAutoSlide();
  }

  track.addEventListener("pointerup", finishDrag);
  track.addEventListener("pointercancel", finishDrag);
  track.addEventListener("lostpointercapture", finishDrag);

  track.addEventListener("click", (event) => {
    if (!movedDuringDrag) return;
    event.preventDefault();
    movedDuringDrag = false;
  });

  window.addEventListener("resize", () => setTrackPosition(positionIndex, 0, false));

  moveToSlide(0, 0, false);
  startAutoSlide();
}

// Opens project screenshots in a centered preview modal.
function setupLightbox() {
  const lightbox = document.getElementById("imageLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const closeButtons = document.querySelectorAll("[data-lightbox-close]");
  let lastTrigger = null;

  if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxCaption) return;
  document.body.append(lightbox);

  document.querySelectorAll(".screenshot-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      lastTrigger = button;
      lightboxImage.src = button.dataset.full;
      lightboxImage.alt = button.querySelector("img")?.alt || "Project screenshot";
      lightboxTitle.textContent = button.dataset.title || "Project screenshot";
      lightboxCaption.textContent = button.dataset.caption || "";
      lightbox.hidden = false;
      lightbox.scrollTop = 0;
      const panel = lightbox.querySelector(".lightbox-panel");
      panel?.scrollTo({ top: 0, left: 0 });
      lightboxImage.addEventListener("load", () => panel?.scrollTo({ top: 0, left: 0 }), { once: true });
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.classList.add("modal-open");
      lightbox.querySelector("[data-lightbox-close]")?.focus({ preventScroll: true });
    });
  });

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.body.classList.remove("modal-open");
    lastTrigger?.focus();
  }

  closeButtons.forEach((button) => button.addEventListener("click", closeLightbox));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
}

// Validates the demo contact form before showing the success message.
function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    message: document.getElementById("message"),
  };

  const errors = {
    name: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    message: document.getElementById("messageError"),
  };

  function setError(field, message) {
    errors[field].textContent = message;
    fields[field].setAttribute("aria-invalid", message ? "true" : "false");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const message = fields.message.value.trim();
    let hasError = false;

    setError("name", "");
    setError("email", "");
    setError("message", "");

    if (name.length < 2) {
      setError("name", "Please enter at least 2 characters.");
      hasError = true;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("email", "Please enter a valid email address.");
      hasError = true;
    }

    if (message.length < 10) {
      setError("message", "Please write a message with at least 10 characters.");
      hasError = true;
    }

    if (hasError) {
      showToast("Please check the highlighted fields.");
      return;
    }

    form.reset();
    showToast("Message checked. This demo form is ready for front-end validation.");
  });
}

// Initialize only the features that exist on the current page.
setupMobileMenu();
setupPageTransitions();
setupMotionEffects();
setupActiveLinks();
setupRevealAnimations();
setupRotatingCards();
setupTypewriterText();
setupProjectSlider();
setupLightbox();
setupContactForm();
