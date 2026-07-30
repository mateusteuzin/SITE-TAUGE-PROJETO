const page = document.body.dataset.page;
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const submenuToggle = document.querySelector("[data-submenu-toggle]");
const navGroup = submenuToggle?.closest(".nav-group");
const main = document.querySelector("main");
const footer = document.querySelector("footer");

document.documentElement.classList.add("reveal-ready");
document.querySelector(`[data-nav-link="${page}"]`)?.setAttribute("aria-current", "page");

function setPageInert(value) {
  [main, footer].forEach((element) => {
    if (!element) return;
    if (value) element.setAttribute("inert", "");
    else element.removeAttribute("inert");
  });
}

function closeNavigation({ restoreFocus = false } = {}) {
  nav?.classList.remove("open");
  document.body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Abrir menu");
  setPageInert(false);
  if (restoreFocus) navToggle?.focus();
}

navToggle?.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") === "true";
  if (open) {
    closeNavigation({ restoreFocus: true });
    return;
  }
  nav?.classList.add("open");
  document.body.classList.add("nav-open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Fechar menu");
  setPageInert(true);
  nav?.querySelector("a")?.focus();
});

submenuToggle?.addEventListener("click", () => {
  const open = submenuToggle.getAttribute("aria-expanded") === "true";
  submenuToggle.setAttribute("aria-expanded", String(!open));
  navGroup?.classList.toggle("submenu-open", !open);
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 1040) closeNavigation();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavigation({ restoreFocus: true });
    navGroup?.classList.remove("submenu-open");
    submenuToggle?.setAttribute("aria-expanded", "false");
  }

  if (event.key === "Tab" && nav?.classList.contains("open")) {
    const focusable = [...nav.querySelectorAll('a[href], button:not([disabled])'), navToggle].filter((item) => {
      if (item.offsetParent === null) return false;
      if (item.closest(".submenu") && !navGroup?.classList.contains("submenu-open")) return false;
      return true;
    });
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
});

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 1040) closeNavigation();
});

if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        instance.unobserve(entry.target);
      }
    });
  }, { threshold: .1, rootMargin: "0px 0px -30px" });
  document.querySelectorAll("[data-reveal]").forEach((item) => observer.observe(item));
} else {
  document.querySelectorAll("[data-reveal]").forEach((item) => item.classList.add("visible"));
}

document.querySelectorAll("[data-contact-form]").forEach((form) => {
  const status = form.querySelector("[data-form-status]");
  const fields = form.querySelectorAll("input, select, textarea");

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      field.removeAttribute("aria-invalid");
      if (status) {
        status.textContent = "";
        status.classList.remove("success");
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const invalidFields = [...fields].filter((field) => !field.checkValidity());
    fields.forEach((field) => field.toggleAttribute("aria-invalid", !field.checkValidity()));

    if (invalidFields.length) {
      if (status) status.textContent = "Revise os campos destacados antes de continuar.";
      invalidFields[0].focus();
      return;
    }

    const data = new FormData(form);
    const subject = encodeURIComponent(`Contato pelo site — ${data.get("empresa") || data.get("nome")}`);
    const body = encodeURIComponent(
      `Nome: ${data.get("nome") || ""}\nEmpresa: ${data.get("empresa") || ""}\nE-mail: ${data.get("email") || ""}\nTelefone: ${data.get("telefone") || ""}\nInteresse: ${data.get("interesse") || ""}\n\nMensagem:\n${data.get("mensagem") || ""}`
    );

    if (status) {
      status.textContent = "Mensagem preparada. Seu aplicativo de e-mail será aberto.";
      status.classList.add("success");
    }
    window.setTimeout(() => {
      window.location.href = `mailto:comercial@tauge.com.br?subject=${subject}&body=${body}`;
    }, 250);
  });
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const hero = document.querySelector("[data-hero]");
const heroScene = document.querySelector("[data-hero-scene]");
const canUseHeroParallax = matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");

if (hero && heroScene && canUseHeroParallax.matches) {
  let frame;

  hero.addEventListener("pointermove", (event) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const bounds = hero.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - .5) * -10;
      const y = ((event.clientY - bounds.top) / bounds.height - .5) * -7;
      heroScene.style.setProperty("--hero-x", `${x.toFixed(2)}px`);
      heroScene.style.setProperty("--hero-y", `${y.toFixed(2)}px`);
    });
  });

  hero.addEventListener("pointerleave", () => {
    cancelAnimationFrame(frame);
    heroScene.style.setProperty("--hero-x", "0px");
    heroScene.style.setProperty("--hero-y", "0px");
  });
}
