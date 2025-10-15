// checkout.js

async function pagar() {
  const btn = document.getElementById("btnComprar");
  btn.disabled = true;
  btn.innerText = "Gerando pagamento...";

  try {
    const res = await fetch("/api/create-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (data.init_point) {
      window.location.href = data.init_point;
    } else {
      alert("Erro ao criar pagamento. Tente novamente.");
      console.error(data);
    }
  } catch (error) {
    alert("Erro de conexão com o servidor.");
    console.error(error);
  } finally {
    btn.disabled = false;
    btn.innerText = "Comprar agora";
  }
}
