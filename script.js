const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Navigation buttons either scroll within the page or move to another page.
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);

  if (section) {
    section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }
}

// Navbar becomes glassy after the user scrolls down.
const navbar = document.getElementById("navbar");
const scrollProgress = document.getElementById("scrollProgress");

function updateNavbar() {
  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

function updateScrollProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

  scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
}

function updateScrollState() {
  updateNavbar();
  updateActiveNav();
  updateScrollProgress();
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateNavbar();
updateScrollProgress();

// Desktop and mobile nav buttons share the same data-target attribute.
const navButtons = document.querySelectorAll("[data-target]");
const navActionButtons = document.querySelectorAll("[data-target], [data-href]");
const pageSections = document.querySelectorAll("main section");
const mobileMenu = document.getElementById("mobileMenu");
const menuButton = document.getElementById("menuButton");
const currentPage = document.body.dataset.page || "home";

navActionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.href) {
      window.location.href = button.dataset.href;
    } else {
      scrollToSection(button.dataset.target);
    }

    mobileMenu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

menuButton.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (event) => {
  const clickedInsideMenu = mobileMenu.contains(event.target);
  const clickedMenuButton = menuButton.contains(event.target);

  if (!clickedInsideMenu && !clickedMenuButton) {
    mobileMenu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    mobileMenu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    closeScreenshotLightbox();
  }
});

// Highlights the current section in the navbar.
function updateActiveNav() {
  let currentSection = "home";
  const marker = window.innerHeight * 0.35;

  if (currentPage !== "home") {
    currentSection = currentPage;
  } else {
    pageSections.forEach((section) => {
      const rect = section.getBoundingClientRect();

      if (rect.top <= marker && rect.bottom > marker) {
        currentSection = section.id;
      }
    });
  }

  navActionButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.target === currentSection && !button.dataset.href);
  });
}

updateActiveNav();

// Simple typewriter effect for the hero subtitle.
const typewriterWords = ["Programmers & Designers", "Web Developers", "IT Students", "Team Gabay"];
const typewriterText = document.getElementById("typewriterText");
const typewriterCursor = document.getElementById("typewriterCursor");

let wordIndex = 0;
let currentText = "";
let deleting = false;

function runTypewriter() {
  if (!typewriterText || !typewriterCursor) {
    return;
  }

  if (reduceMotion) {
    typewriterText.textContent = typewriterWords[0];
    typewriterCursor.style.display = "none";
    return;
  }

  const fullWord = typewriterWords[wordIndex];
  let delay = deleting ? 45 : 80;

  if (!deleting && currentText === fullWord) {
    delay = 1800;
  }

  window.setTimeout(() => {
    if (!deleting && currentText === fullWord) {
      deleting = true;
      runTypewriter();
      return;
    }

    if (deleting && currentText === "") {
      deleting = false;
      wordIndex = (wordIndex + 1) % typewriterWords.length;
      runTypewriter();
      return;
    }

    currentText = deleting
      ? fullWord.slice(0, currentText.length - 1)
      : fullWord.slice(0, currentText.length + 1);

    typewriterText.textContent = currentText;
    runTypewriter();
  }, delay);
}

runTypewriter();

// Reveal sections when they enter the screen.
const revealSections = document.querySelectorAll(".reveal-section");
const allRevealItems = [];
const revealSelectors = [
  ".member-card",
  ".skills-card",
  ".stacked-cards .glass-card",
  ".project-card",
  ".project-index-panel",
  ".roadmap-compass",
  ".detail-card",
  ".screenshot-card",
  ".timeline-item",
  ".roadmap-summary",
  ".roadmap-step",
  ".role-card",
  ".gallery-project-group",
  ".philosophy-card",
  ".contact-info",
  ".contact-form",
];

revealSections.forEach((section) => {
  const sectionRevealItems = section.querySelectorAll(revealSelectors.join(","));

  sectionRevealItems.forEach((item, index) => {
    item.classList.add("reveal-item");
    item.style.setProperty("--reveal-delay", `${Math.min(index * 90, 450)}ms`);
    allRevealItems.push(item);
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.01 }
);

revealSections.forEach((section) => revealObserver.observe(section));

const revealItemObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { rootMargin: "0px 0px -10% 0px", threshold: 0.01 }
);

allRevealItems.forEach((item) => revealItemObserver.observe(item));

// Screenshot gallery lightbox.
const screenshotLightbox = document.getElementById("screenshotLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCaption = document.getElementById("lightboxCaption");
const screenshotZoomTriggers = document.querySelectorAll(".screenshot-zoom-trigger");
const zoomInButton = document.querySelector("[data-zoom-in]");
const zoomOutButton = document.querySelector("[data-zoom-out]");
const zoomResetButton = document.querySelector("[data-zoom-reset]");
let activeLightboxTrigger = null;
let lightboxZoom = 1;

function updateLightboxZoom() {
  if (!lightboxImage || !zoomResetButton) {
    return;
  }

  lightboxImage.style.width = `${lightboxZoom * 100}%`;
  zoomResetButton.textContent = `${Math.round(lightboxZoom * 100)}%`;
}

function openScreenshotLightbox(trigger) {
  if (!screenshotLightbox || !lightboxImage || !lightboxTitle || !lightboxCaption) {
    return;
  }

  activeLightboxTrigger = trigger;
  lightboxZoom = 1;
  lightboxImage.src = trigger.dataset.full;
  lightboxImage.alt = trigger.querySelector("img")?.alt || trigger.dataset.title || "Project screenshot";
  lightboxTitle.textContent = trigger.dataset.title || "Project screenshot";
  lightboxCaption.textContent = trigger.dataset.caption || "";
  updateLightboxZoom();
  screenshotLightbox.hidden = false;
  document.body.style.overflow = "hidden";
  screenshotLightbox.querySelector("[data-lightbox-close]")?.focus();
}

function closeScreenshotLightbox() {
  if (!screenshotLightbox || screenshotLightbox.hidden) {
    return;
  }

  screenshotLightbox.hidden = true;
  lightboxImage.removeAttribute("src");
  lightboxImage.removeAttribute("style");
  document.body.style.overflow = "";
  activeLightboxTrigger?.focus();
  activeLightboxTrigger = null;
}

screenshotZoomTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openScreenshotLightbox(trigger));
});

document.querySelectorAll("[data-lightbox-close]").forEach((button) => {
  button.addEventListener("click", closeScreenshotLightbox);
});

zoomInButton?.addEventListener("click", () => {
  lightboxZoom = Math.min(lightboxZoom + 0.25, 3);
  updateLightboxZoom();
});

zoomOutButton?.addEventListener("click", () => {
  lightboxZoom = Math.max(lightboxZoom - 0.25, 0.75);
  updateLightboxZoom();
});

zoomResetButton?.addEventListener("click", () => {
  lightboxZoom = 1;
  updateLightboxZoom();
});

// Glass cards react subtly to cursor position.
const glassCards = document.querySelectorAll(".glass-card");

glassCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const pointerX = ((event.clientX - rect.left) / rect.width) * 100;
    const pointerY = ((event.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--pointer-x", `${pointerX}%`);
    card.style.setProperty("--pointer-y", `${pointerY}%`);
  });
});

// Small toast helper for contact form feedback.
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// Contact form validation.
const contactForm = document.getElementById("contactForm");
const submitButton = document.getElementById("submitButton");

const fields = contactForm
  ? {
  name: {
    input: document.getElementById("name"),
    error: document.getElementById("nameError"),
  },
  email: {
    input: document.getElementById("email"),
    error: document.getElementById("emailError"),
  },
  message: {
    input: document.getElementById("message"),
    error: document.getElementById("messageError"),
  },
}
  : {};

function clearErrors() {
  Object.values(fields).forEach((field) => {
    field.error.textContent = "";
    field.input.removeAttribute("aria-invalid");
  });
}

function validateForm() {
  const errors = {
    name: fields.name.input.value.trim() ? "" : "Please enter your name.",
    email: fields.email.input.value.trim()
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.input.value)
        ? ""
        : "Please enter a valid email address."
      : "Please enter your email.",
    message: fields.message.input.value.trim() ? "" : "Please write a short message.",
  };

  Object.keys(errors).forEach((key) => {
    fields[key].error.textContent = errors[key];

    if (errors[key]) {
      fields[key].input.setAttribute("aria-invalid", "true");
    } else {
      fields[key].input.removeAttribute("aria-invalid");
    }
  });

  return errors;
}

function focusFirstError(errors) {
  if (errors.name) {
    fields.name.input.focus();
  } else if (errors.email) {
    fields.email.input.focus();
  } else if (errors.message) {
    fields.message.input.focus();
  }
}

if (contactForm && submitButton) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const errors = validateForm();

    if (errors.name || errors.email || errors.message) {
      focusFirstError(errors);
      showToast("Please check the highlighted fields.");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    // Fake delay so the user can see the sending state.
    window.setTimeout(() => {
      contactForm.reset();
      clearErrors();
      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
      showToast("Message sent! We'll get back to you soon.");
    }, 1200);
  });
}
