// checkout.js — StreamMax Checkout

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");
  const emailInput = document.getElementById("email");
  const payButton = document.getElementById("pay-button");
  const statusText = document.getElementById("status");

  // Quando o cliente clica em "Pagar com Pix ou Cartão"
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
      alert("Por favor, digite um e-mail válido.");
      return;
    }

    payButton.disabled = true;
    statusText.textContent = "Processando pagamento...";

    try {
      // Cria a preferência de pagamento
      const response = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar pagamento.");
      }

      const data = await response.json();

      if (data.init_point) {
        // Redireciona o cliente para o checkout seguro do Mercado Pago
        window.location.href = data.init_point;
      } else {
        throw new Error("Não foi possível iniciar o pagamento.");
      }

    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão. Verifique sua internet e tente novamente.");
      payButton.disabled = false;
      statusText.textContent = "";
    }
  });
});
