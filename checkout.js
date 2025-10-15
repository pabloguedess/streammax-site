fetch("/api/create-preference", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({}),
})
  .then(res => res.json())
  .then(data => {
    if (data.init_point) {
      window.location.href = data.init_point;
    } else { 
      alert("Erro ao criar preferência de pagamento.");
    }
  })
  .catch(() => {
    alert("Erro de conexão. Verifique sua internet e tente novamente.");
  });
