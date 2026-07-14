/* =========================================================
   TOI TCTC Environmental Awareness Registration Portal
   script.js

   Handles:
   - Registration form with client-side validation
   - Google Apps Script Web App integration
   - Auto-generated fake email & password
   - Particle animation on hero canvas
   - Scroll reveal animations
   - Mobile menu toggle
   - Header scroll effect
   - Preloader
   - Success overlay with confetti
   - Fallback to Google Form if script URL not set

   >>> IMPORTANT: Set your Google Apps Script Web App URL below <<<
   Follow the README for setup instructions.
   ========================================================= */

// ==========================================
// 🔧 CONFIGURATION — Edit these values
// ==========================================

/**
 * Google Apps Script Web App URL
 * Deploy your Apps Script as a web app and paste the URL here.
 * Leave as empty string "" to use Google Form fallback.
 */
const APPS_SCRIPT_URL = "";

/**
 * Google Form fallback URL
 * Used when APPS_SCRIPT_URL is not set.
 */
const GOOGLE_FORM_URL = "https://forms.gle/iarizn2PDbgThaSZ7";

/**
 * Redirect URL after successful registration
 */
const TCTC_REDIRECT_URL = "https://toitctc.com/?utm_source=chatgpt.com";

// ==========================================
// 🚀 INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initPreloader();
  initParticles();
  initScrollReveal();
  initHeaderScroll();
  initMobileMenu();
  initRegistrationForm();
  initOverlay();
});

// ==========================================
// ⏳ PRELOADER
// ==========================================

function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.classList.add("loaded");
      // Remove from DOM after animation
      setTimeout(() => preloader.remove(), 600);
    }, 800);
  });
}

// ==========================================
// ✨ PARTICLE ANIMATION (Hero Canvas)
// ==========================================

function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.3 - 0.2,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.7
        ? "rgba(242, 165, 65, OPACITY)"  // Gold
        : "rgba(78, 196, 163, OPACITY)", // Teal
    };
  }

  function initParticleArray() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 80);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace("OPACITY", p.opacity.toString());
      ctx.fill();

      // Update position
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;

      // Gentle opacity pulsing
      p.opacity += (Math.random() - 0.5) * 0.01;
      p.opacity = Math.max(0.05, Math.min(0.6, p.opacity));
    });

    animationId = requestAnimationFrame(drawParticles);
  }

  resize();
  initParticleArray();
  drawParticles();

  window.addEventListener("resize", () => {
    resize();
    initParticleArray();
  });
}

// ==========================================
// 👁 SCROLL REVEAL
// ==========================================

function initScrollReveal() {
  const revealTargets = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    // Fallback: show everything
    revealTargets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealTargets.forEach((el) => observer.observe(el));
}

// ==========================================
// 📌 HEADER SCROLL EFFECT
// ==========================================

function initHeaderScroll() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 20) {
            header.classList.add("scrolled");
          } else {
            header.classList.remove("scrolled");
          }
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
}

// ==========================================
// 📱 MOBILE MENU
// ==========================================

function initMobileMenu() {
  const toggle = document.getElementById("mobileMenuToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
    toggle.classList.toggle("is-active");
  });
}

/** Closes mobile menu (called from nav link onclick) */
function closeMenu() {
  const nav = document.getElementById("mainNav");
  const toggle = document.getElementById("mobileMenuToggle");
  if (nav) nav.classList.remove("is-open");
  if (toggle) toggle.classList.remove("is-active");
}

// ==========================================
// 📝 REGISTRATION FORM
// ==========================================

function initRegistrationForm() {
  const form = document.getElementById("registrationForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate
    if (!validateForm()) return;

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.classList.add("is-loading");

    // Gather form data
    const studentName = document.getElementById("studentName").value.trim();
    const parentName = document.getElementById("parentName").value.trim();
    const studentClass = document.getElementById("studentClass").value.trim();
    const schoolName = document.getElementById("schoolName").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();

    // The direct action URL of the Google Form
    const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSdaWFrbuUXFLfYSuJIyfXuB6UxK-tWER1S_PEwv2caJoSYPFg/formResponse";
    
    // Create FormData object matching the Google Form entry IDs
    const formData = new URLSearchParams();
    formData.append("entry.2005620554", studentName);
    formData.append("entry.839337160", parentName);
    formData.append("entry.260223400", studentClass);
    formData.append("entry.1065046570", city);
    formData.append("entry.1166974658", state);
    formData.append("entry.462576747", schoolName);

    try {
      // Submit via fetch using no-cors mode to bypass CORS block
      await fetch(GOOGLE_FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      });
    } catch (err) {
      console.warn("Direct form submission had an error:", err);
    }

    // Direct redirect to TCTC site regardless of the fetch response (since no-cors is opaque)
    submitBtn.classList.remove("is-loading");
    window.location.href = TCTC_REDIRECT_URL;
    form.reset();
  });
}

// ==========================================
// ✅ FORM VALIDATION
// ==========================================

function validateForm() {
  let isValid = true;
  const fields = [
    { id: "studentName", groupId: "studentNameGroup", required: true },
    { id: "parentName", groupId: "parentNameGroup", required: true },
    { id: "studentClass", groupId: "classGroup", required: true },
    { id: "schoolName", groupId: "schoolGroup", required: true },
    { id: "city", groupId: "cityGroup", required: true },
    { id: "state", groupId: "stateGroup", required: true },
  ];

  fields.forEach(({ id, groupId, required }) => {
    const input = document.getElementById(id);
    const group = document.getElementById(groupId);
    const value = input.value.trim();

    // Clear previous error
    group.classList.remove("has-error");
    input.classList.remove("error");

    if (required && !value) {
      group.classList.add("has-error");
      input.classList.add("error");
      isValid = false;
      return;
    }
  });

  return isValid;
}

// ==========================================
// 🔑 FAKE EMAIL & PASSWORD GENERATION
// ==========================================

/**
 * Generates a unique fake email based on user's first name.
 * Format: name + random 3-digit number + @gmail.com
 * Examples: rahul845@gmail.com, student102@gmail.com
 */
function generateFakeEmail(firstName) {
  const name = firstName.toLowerCase().replace(/[^a-z]/g, "") || "user";
  const num = Math.floor(Math.random() * 900) + 100; // 100-999
  return `${name}${num}@gmail.com`;
}

/**
 * Generates a fake password.
 * Format: CapitalizedName + @ + random 4-digit number
 * Examples: Rahul@8452, User@6521, Atul@9043
 */
function generateFakePassword(firstName) {
  const name = firstName.trim() || "User";
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const num = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
  return `${capitalized}@${num}`;
}

// ==========================================
// 🌐 GOOGLE APPS SCRIPT SUBMISSION
// ==========================================

/**
 * Sends form data to Google Apps Script Web App.
 * The script writes data to a Google Sheet including
 * auto-generated email and password columns.
 */
async function submitToAppsScript(data) {
  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  // no-cors mode returns opaque response, so we assume success
  // if no network error was thrown
  return true;
}

// ==========================================
// 🎉 SUCCESS OVERLAY & CONFETTI
// ==========================================

function initOverlay() {
  const overlay = document.getElementById("confirmOverlay");
  const closeBtn = document.getElementById("closeOverlay");

  if (closeBtn) {
    closeBtn.addEventListener("click", hideOverlay);
  }

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) hideOverlay();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay && !overlay.hidden) hideOverlay();
  });
}

function showSuccessOverlay() {
  const overlay = document.getElementById("confirmOverlay");
  if (!overlay) return;

  overlay.hidden = false;
  document.body.style.overflow = "hidden";

  // Launch confetti
  launchConfetti();
}

function hideOverlay() {
  const overlay = document.getElementById("confirmOverlay");
  if (!overlay) return;

  overlay.hidden = true;
  document.body.style.overflow = "";
}

/**
 * Creates a celebratory confetti animation.
 */
function launchConfetti() {
  const container = document.getElementById("confettiContainer");
  if (!container) return;

  const colors = ["#f2a541", "#4ec4a3", "#22c55e", "#f7c948", "#ff6b6b", "#146356", "#ffffff"];
  const confettiCount = 60;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = Math.random() * 8 + 4 + "px";
    confetti.style.height = Math.random() * 8 + 4 + "px";
    confetti.style.animationDuration = Math.random() * 2 + 2 + "s";
    confetti.style.animationDelay = Math.random() * 0.8 + "s";

    // Random shapes
    if (Math.random() > 0.5) {
      confetti.style.borderRadius = "50%";
    } else {
      confetti.style.borderRadius = "2px";
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    }

    container.appendChild(confetti);
  }

  // Clean up confetti after animation
  setTimeout(() => {
    container.innerHTML = "";
  }, 4000);
}
