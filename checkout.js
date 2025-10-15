document.querySelector("#botao-pagamento").addEventListener("click", async () => {
  const email = document.querySelector("#email").value.trim();
  const botao = document.querySelector("#botao-pagamento");
  const msg = document.querySelector("#mensagem");

  if (!email) {
    alert("Por favor, insira seu e-mail antes de continuar.");
    return;
  }

  botao.disabled = true;
  botao.innerText = "🔄 Processando pagamento...";
  msg.innerText = "";

  try {
    const res = await fetch("/api/create-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.init_point) {
      msg.innerText = "Redirecionando para o Mercado Pago...";
      setTimeout(() => {
        window.location.href = data.init_point;
      }, 1000);
    } else {
      console.error("Erro:", data);
      alert("Erro ao criar pagamento. Tente novamente.");
    }
  } catch (err) {
    alert("Erro de conexão. Verifique sua internet e tente novamente.");
  } finally {
    botao.disabled = false;
    botao.innerText = "💳 Pagar com Pix ou Cartão";
  }
});
