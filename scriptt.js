document.documentElement.classList.add("js");

const menuButton = document.getElementById("btnMenu");
const mobileMenu = document.getElementById("menuMobile");

function closeMenu() {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
  mobileMenu.classList.remove("is-open");
}

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
    mobileMenu.classList.toggle("is-open", !isOpen);
  });

  mobileMenu.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const bookingForm = document.getElementById("formAgenda");
const serviceSelect = document.getElementById("servico");
const totalElement = document.getElementById("total");
const statusElement = document.getElementById("confirmacao");
const dateInput = document.getElementById("data");

function updateTotal() {
  if (!serviceSelect || !totalElement) return;
  const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
  const price = Number(selectedOption?.dataset.preco || 0);
  totalElement.textContent = price.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

if (dateInput) {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  dateInput.min = localToday;
}

serviceSelect?.addEventListener("change", updateTotal);

document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    if (!serviceSelect) return;
    serviceSelect.value = link.dataset.service || "";
    updateTotal();
  });
});

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;

  const formData = new FormData(bookingForm);
  const date = new Date(`${formData.get("data")}T12:00:00`);
  const formattedDate = new Intl.DateTimeFormat("pt-BR").format(date);
  const selectedOption = serviceSelect?.options[serviceSelect.selectedIndex];
  const price = Number(selectedOption?.dataset.preco || 0);
  const formattedPrice = price.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const message = [
    "Olá! Gostaria de solicitar um agendamento com a Alewon Barber.",
    "",
    `Nome: ${formData.get("nome")}`,
    `WhatsApp: ${formData.get("whatsapp")}`,
    `Endereço: ${formData.get("endereco")}`,
    `Data desejada: ${formattedDate}`,
    `Horário desejado: ${formData.get("horario")}`,
    `Serviço: ${formData.get("servico")}`,
    `Valor do serviço: R$ ${formattedPrice}`,
    "",
    "Aguardo a confirmação do horário. Obrigado!"
  ].join("\n");
  const whatsappUrl = `https://wa.me/5511960248301?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");

  if (statusElement) {
    statusElement.textContent = "Revise sua mensagem no WhatsApp e toque em enviar. O horário será confirmado pelo barbeiro.";
    const fallbackLink = document.createElement("a");
    fallbackLink.href = whatsappUrl;
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noopener noreferrer";
    fallbackLink.textContent = " Abrir WhatsApp";
    statusElement.append(fallbackLink);
  }
});

const yearElement = document.getElementById("currentYear");
if (yearElement) yearElement.textContent = String(new Date().getFullYear());

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
