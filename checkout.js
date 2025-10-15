document.addEventListener("DOMContentLoaded", () => {
  const botao = document.getElementById("botao-pagamento");
  const mensagem = document.getElementById("mensagem");

  botao.addEventListener("click", async () => {
    botao.disabled = true;
    botao.innerText = "⏳ Gerando pagamento...";
    mensagem.textContent = "";

    try {
      const res = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (data.init_point) {
        mensagem.textContent = "✅ Redirecionando para o pagamento...";
        window.location.href = data.init_point;
      } else {
        mensagem.textContent = "⚠️ Erro ao criar o pagamento. Tente novamente.";
        console.error(data);
      }
    } catch (error) {
      mensagem.textContent = "❌ Erro de conexão com o servidor.";
      console.error(error);
    } finally {
      botao.disabled = false;
      botao.innerText = "💳 Pagar com Pix ou Cartão";
    }
  });
});
