document.documentElement.classList.remove("no-js");

const planSelect = document.querySelector("[data-plan-select]");
const monthlyTotal = document.querySelector("[data-plan-total]");
const planForm = document.querySelector("[data-plan-form]");
const formStatus = document.querySelector("[data-form-status]");
const barberWhatsApp = "5511960248301";

function updateSelectedPlan() {
  if (!planSelect || !monthlyTotal) return;

  const option = planSelect.options[planSelect.selectedIndex];
  const price = Number(option.dataset.price);
  monthlyTotal.textContent = price
    ? price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "—";

  document.querySelectorAll("[data-plan-card]").forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.planCard === planSelect.value);
  });
}

planSelect?.addEventListener("change", updateSelectedPlan);

document.querySelectorAll("[data-select-plan]").forEach((link) => {
  link.addEventListener("click", () => {
    if (!planSelect) return;
    planSelect.value = link.dataset.selectPlan || "";
    updateSelectedPlan();
  });
});

planForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!planForm.reportValidity() || !planSelect) return;

  const formData = new FormData(planForm);
  const option = planSelect.options[planSelect.selectedIndex];
  const price = Number(option.dataset.price);
  const formattedPrice = price.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const message = [
    "Olá! Tenho interesse em aderir ao plano mensal recorrente Alewon Barber.",
    "",
    `Nome: ${formData.get("nome")}`,
    `WhatsApp: ${formData.get("whatsapp")}`,
    `Bairro/cidade: ${formData.get("bairro")}`,
    `Plano: ${option.dataset.label}`,
    `Mensalidade informada: R$ ${formattedPrice}`,
    "",
    "Quero confirmar a área atendida, a forma de pagamento, a data de início, a renovação e as regras de uso e cancelamento antes de concluir a adesão.",
    "Também gostaria de combinar meus atendimentos pelo WhatsApp."
  ].join("\n");
  const whatsappUrl = `https://wa.me/${barberWhatsApp}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");

  if (formStatus) {
    formStatus.replaceChildren();
    formStatus.append(document.createTextNode("Revise e envie a mensagem no WhatsApp para falar com o barbeiro. "));

    const fallbackLink = document.createElement("a");
    fallbackLink.href = whatsappUrl;
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noopener noreferrer";
    fallbackLink.textContent = "Abrir WhatsApp";
    formStatus.append(fallbackLink);
  }
});

document.querySelectorAll("[data-current-year]").forEach((year) => {
  year.textContent = String(new Date().getFullYear());
});

const revealElements = document.querySelectorAll(".fade-in");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
