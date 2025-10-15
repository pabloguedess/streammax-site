export default async function handler(req, res) {
  console.log("Webhook recebido:", req.body);

  if (req.body.action === "payment.created") {
    const payment = req.body.data.id;
    // Aqui você pode consultar o status e liberar o usuário
  }

  res.status(200).send("ok");
}
