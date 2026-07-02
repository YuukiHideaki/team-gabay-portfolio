// Navigation buttons use this function instead of normal anchor links.
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);

  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

// Navbar becomes glassy after the user scrolls down.
const navbar = document.getElementById("navbar");

function updateNavbar() {
  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", updateNavbar);
updateNavbar();

// Desktop and mobile nav buttons share the same data-target attribute.
const navButtons = document.querySelectorAll("[data-target]");
const mobileMenu = document.getElementById("mobileMenu");
const menuButton = document.getElementById("menuButton");

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    scrollToSection(button.dataset.target);
    mobileMenu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

menuButton.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

// Simple typewriter effect for the hero subtitle.
const typewriterWords = ["Programmers & Designers", "Web Developers", "IT Students", "Team Gabay"];
const typewriterText = document.getElementById("typewriterText");
const typewriterCursor = document.getElementById("typewriterCursor");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let wordIndex = 0;
let currentText = "";
let deleting = false;

function runTypewriter() {
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

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

revealSections.forEach((section) => revealObserver.observe(section));

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

const fields = {
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
};

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
