const pageName = document.body.dataset.page;
const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");
const toast = document.getElementById("toast");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      }, 180);
    });
  });
}

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

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

function setupActiveLinks() {
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === pageName);
  });
}

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

function setupLightbox() {
  const lightbox = document.getElementById("imageLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const closeButtons = document.querySelectorAll("[data-lightbox-close]");
  let lastTrigger = null;

  if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxCaption) return;

  document.querySelectorAll(".screenshot-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      lastTrigger = button;
      lightboxImage.src = button.dataset.full;
      lightboxImage.alt = button.querySelector("img")?.alt || "Project screenshot";
      lightboxTitle.textContent = button.dataset.title || "Project screenshot";
      lightboxCaption.textContent = button.dataset.caption || "";
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      lightbox.querySelector("[data-lightbox-close]")?.focus();
    });
  });

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    lastTrigger?.focus();
  }

  closeButtons.forEach((button) => button.addEventListener("click", closeLightbox));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
}

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

setupMobileMenu();
setupPageTransitions();
setupActiveLinks();
setupRevealAnimations();
setupLightbox();
setupContactForm();
