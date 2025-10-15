const btn = document.querySelector("button");
const emailInput = document.querySelector("input");

btn.addEventListener("click", async () => {
  const email = emailInput.value.trim();

  if (!email) {
    alert("Por favor, insira seu e-mail.");
    return;
  }

  try {
    const res = await fetch("/api/create-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Plano Vitalício StreamMax",
        price: 16.90,
        quantity: 1,
        email: email,
      }),
    });

    const data = await res.json();

    if (data.init_point) {
      window.location.href = data.init_point;
    } else {
      console.error("Resposta inválida:", data);
      alert("Erro ao criar preferência de pagamento.");
    }
  } catch (err) {
    console.error(err);
    alert("Erro de conexão. Verifique sua internet e tente novamente.");
  }
});
