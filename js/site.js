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

const interactiveMap = document.querySelector("[data-interactive-map]");
const mapTouchHint = document.querySelector("[data-map-touch-hint]");

function toggleMapDepth() {
  if (!interactiveMap) return;
  const active = interactiveMap.classList.toggle("is-active");
  interactiveMap.setAttribute("aria-pressed", String(active));
  interactiveMap.setAttribute("aria-label", active ? "Desativar visualização 3D do mapa" : "Ativar visualização 3D do mapa");
  if (mapTouchHint) {
    mapTouchHint.lastChild.textContent = active ? " Toque novamente para voltar" : " Toque para explorar em 3D";
  }
}

interactiveMap?.addEventListener("click", toggleMapDepth);
interactiveMap?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  toggleMapDepth();
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

/* Consultative chat: triages visitors to the supported contact channels. */
document.body.insertAdjacentHTML("beforeend", `
  <aside class="chat-widget" data-chat-widget>
    <section class="chat-panel" id="tauge-chat" role="dialog" aria-modal="false" aria-labelledby="chat-title" hidden>
      <header class="chat-panel-header">
        <span class="chat-avatar"><i class="bi bi-chat-dots" aria-hidden="true"></i></span>
        <span class="chat-title"><strong id="chat-title">Tauge Tecnologia</strong><span>Canal de atendimento comercial</span></span>
        <button class="chat-close" type="button" aria-label="Fechar chat" data-chat-close><i class="bi bi-x-lg" aria-hidden="true"></i></button>
      </header>
      <div class="chat-messages" data-chat-messages role="log" aria-live="polite" aria-relevant="additions">
        <div class="chat-message chat-message--assistant">
          <div class="chat-bubble">Olá! Como podemos ajudar sua operação hoje?</div>
          <span class="chat-message-meta">Tauge Tecnologia</span>
        </div>
        <div class="chat-quick-replies" aria-label="Assuntos frequentes">
          <button class="chat-quick-reply" type="button" data-chat-action="diagnostico">Solicitar um diagnóstico</button>
          <button class="chat-quick-reply" type="button" data-chat-action="solucoes">Conhecer soluções</button>
          <button class="chat-quick-reply" type="button" data-chat-action="whatsapp">Falar pelo WhatsApp</button>
        </div>
      </div>
      <div>
        <form class="chat-composer" data-chat-form>
          <label class="visually-hidden" for="chat-message">Escreva sua mensagem</label>
          <textarea id="chat-message" rows="1" maxlength="600" placeholder="Escreva sua mensagem…" data-chat-input></textarea>
          <button class="chat-send" type="submit" aria-label="Enviar mensagem"><i class="bi bi-arrow-up" aria-hidden="true"></i></button>
        </form>
        <p class="chat-disclaimer">Não envie dados sensíveis. Consulte nossa <a href="privacidade.html">Política de Privacidade</a>.</p>
      </div>
    </section>
    <button class="chat-launcher" type="button" aria-expanded="false" aria-controls="tauge-chat" data-chat-toggle>
      <span class="chat-launcher-icon"><i class="bi bi-chat-dots" aria-hidden="true"></i></span>
      <span class="chat-launcher-label"><strong>Vamos conversar por chat</strong><span>Estamos prontos para ajudar</span></span>
    </button>
  </aside>
`);

const chatWidget = document.querySelector("[data-chat-widget]");
const chatPanel = chatWidget?.querySelector(".chat-panel");
const chatToggle = chatWidget?.querySelector("[data-chat-toggle]");
const chatClose = chatWidget?.querySelector("[data-chat-close]");
const chatMessages = chatWidget?.querySelector("[data-chat-messages]");
const chatForm = chatWidget?.querySelector("[data-chat-form]");
const chatInput = chatWidget?.querySelector("[data-chat-input]");
let chatScrollPosition = 0;

function isMobileChat() {
  return window.matchMedia("(max-width: 600px)").matches;
}

function lockChatBackground() {
  if (!isMobileChat()) return;
  chatScrollPosition = window.scrollY;
  document.body.classList.add("chat-open");
  document.body.style.top = `-${chatScrollPosition}px`;
}

function unlockChatBackground() {
  if (!document.body.classList.contains("chat-open")) return;
  document.body.classList.remove("chat-open");
  document.body.style.top = "";
  window.scrollTo(0, chatScrollPosition);
}

function addChatMessage(text, { visitor = false, action } = {}) {
  if (!chatMessages) return;
  const message = document.createElement("div");
  message.className = `chat-message chat-message--${visitor ? "visitor" : "assistant"}`;
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  bubble.textContent = text;
  message.append(bubble);
  if (!visitor) {
    const meta = document.createElement("span");
    meta.className = "chat-message-meta";
    meta.textContent = "Tauge Tecnologia";
    message.append(meta);
  }
  if (action) {
    const link = document.createElement("a");
    link.className = "chat-action-link";
    link.href = action.href;
    link.textContent = action.label;
    if (action.external) {
      link.target = "_blank";
      link.rel = "noopener";
    }
    message.append(link);
  }
  chatMessages.append(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function openChat() {
  if (!chatPanel || !chatToggle) return;
  chatPanel.hidden = false;
  chatToggle.setAttribute("aria-expanded", "true");
  lockChatBackground();
  chatInput?.focus();
}

function closeChat({ restoreFocus = true } = {}) {
  if (!chatPanel || !chatToggle || chatPanel.hidden) return false;
  chatPanel.hidden = true;
  chatToggle.setAttribute("aria-expanded", "false");
  unlockChatBackground();
  if (restoreFocus) chatToggle.focus();
  return true;
}

chatToggle?.addEventListener("click", () => {
  if (chatPanel?.hidden) openChat();
  else closeChat();
});
chatClose?.addEventListener("click", () => closeChat());
chatWidget?.addEventListener("click", (event) => {
  if (isMobileChat() && document.body.classList.contains("chat-open") && event.target === chatWidget) closeChat();
});
chatWidget?.addEventListener("touchmove", (event) => {
  if (document.body.classList.contains("chat-open") && !event.target.closest(".chat-panel")) event.preventDefault();
}, { passive: false });

chatWidget?.querySelectorAll("[data-chat-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.chatAction;
    if (action === "diagnostico") {
      closeChat({ restoreFocus: false });
      window.location.href = "contato.html#formulario";
      return;
    }
    if (action === "solucoes") {
      closeChat({ restoreFocus: false });
      window.location.href = "solucoes.html";
      return;
    }
    addChatMessage("Quero falar pelo WhatsApp.", { visitor: true });
    addChatMessage("Você pode iniciar uma conversa com nossa equipe pelo WhatsApp.", {
      action: { href: "https://wa.me/5585982350090", label: "Abrir WhatsApp", external: true }
    });
  });
});

chatForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = chatInput?.value.trim();
  if (!message) return;
  addChatMessage(message, { visitor: true });
  chatInput.value = "";
  chatInput.style.height = "";
  addChatMessage("Recebemos sua mensagem. Para um atendimento comercial, fale com nossa equipe pelo WhatsApp ou envie o formulário de diagnóstico.", {
    action: { href: "https://wa.me/5585982350090", label: "Continuar no WhatsApp", external: true }
  });
});

chatInput?.addEventListener("input", () => {
  chatInput.style.height = "";
  chatInput.style.height = `${Math.min(chatInput.scrollHeight, 104)}px`;
});

chatInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm?.requestSubmit();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && closeChat()) {
    event.stopImmediatePropagation();
    return;
  }
  if (event.key === "Tab" && !chatPanel?.hidden) {
    const focusable = [...chatPanel.querySelectorAll('a[href], button:not([disabled]), textarea:not([disabled])')].filter((item) => item.offsetParent !== null);
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
}, true);
