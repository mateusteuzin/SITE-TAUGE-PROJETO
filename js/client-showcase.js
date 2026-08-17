(function () {
  "use strict";

  const clients = [
    { name: "Unimed", logo: "assets/clients/unimed.webp", segment: "Saúde", featured: true },
    { name: "Unifor", logo: "assets/clients/unifor.webp", segment: "Educação", featured: true },
    { name: "Grupo Aço Cearense", logo: "assets/clients/grupo-aco-cearense.webp", segment: "Indústria", featured: true },
    { name: "Supermercado São Luiz", logo: "assets/clients/supermercado-sao-luiz.webp", segment: "Varejo", featured: true },
    { name: "Casa Pio", logo: "assets/clients/casa-pio.png", segment: "Varejo" },
    { name: "Cegás", logo: "assets/clients/cegas.webp", segment: "Energia e utilities", featured: true },
    { name: "Eletra Energy Solutions", logo: "assets/clients/eletra-energy.webp", segment: "Energia e utilities", featured: true },
    { name: "Hospital Uniclinic", logo: "assets/clients/hospital-uniclinic.webp", segment: "Saúde", featured: true },
    { name: "C. Rolim Engenharia", logo: "assets/clients/c-rolim.webp", segment: "Construção e engenharia", featured: true },
    { name: "Grupo Engipec", logo: "assets/clients/grupo-engipec.webp", segment: "Construção e engenharia" },
    { name: "Hospital Prontocárdio", logo: "assets/clients/hospital-prontocardio.webp", segment: "Saúde" },
    { name: "Ferronorte", logo: "assets/clients/ferronorte.webp", segment: "Indústria" },
    { name: "Têxtil União", logo: "assets/clients/textil-uniao.webp", segment: "Indústria" },
    { name: "Tuboarte", logo: "assets/clients/tuboarte.webp", segment: "Indústria" },
    { name: "Verbras", logo: "assets/clients/verbras.webp", segment: "Indústria" },
    { name: "J17 Bank", logo: "assets/clients/j17-bank.webp", segment: "Financeiro" },
    { name: "Mobit", logo: "assets/clients/mobit.webp", segment: "Tecnologia e serviços" },
    { name: "Fruta Polpa", logo: "assets/clients/fruta-polpa.webp", segment: "Distribuição e alimentos" },
    { name: "Italap Diagnóstico", logo: "assets/clients/italap-diagnostico.webp", segment: "Saúde" },
  ];

  function initials(name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function createClientCard(client) {
    const card = document.createElement("article");
    card.className = "client-logo-card";
    card.setAttribute("data-reveal", "");
    card.setAttribute("aria-label", `${client.name} — ${client.segment}`);

    const image = document.createElement("img");
    image.src = client.logo;
    image.alt = `Logo ${client.name}`;
    image.loading = "lazy";
    image.decoding = "async";
    image.width = 240;
    image.height = 104;

    const fallback = document.createElement("span");
    fallback.className = "client-logo-fallback";
    fallback.hidden = true;

    const fallbackMark = document.createElement("b");
    fallbackMark.textContent = initials(client.name);
    const fallbackName = document.createElement("small");
    fallbackName.textContent = client.name;
    fallback.append(fallbackMark, fallbackName);

    const label = document.createElement("span");
    label.className = "client-logo-label";
    label.textContent = client.segment;

    image.addEventListener("error", () => {
      image.remove();
      fallback.hidden = false;
      card.classList.add("has-logo-fallback");
    });

    card.append(image, fallback, label);
    return card;
  }

  function renderClients(container) {
    const featuredOnly = container.hasAttribute("data-featured");
    const source = featuredOnly ? clients.filter((client) => client.featured) : clients;
    const fragment = document.createDocumentFragment();
    const isMarquee = Boolean(container.closest("[data-client-marquee]"));
    const displayClients = isMarquee ? [...source, ...source] : source;
    displayClients.forEach((client) => fragment.append(createClientCard(client)));
    container.replaceChildren(fragment);
    container.removeAttribute("aria-busy");
    container.closest("[data-client-marquee]")?.removeAttribute("aria-busy");
  }

  document.querySelectorAll("[data-client-grid]").forEach(renderClients);
})();
