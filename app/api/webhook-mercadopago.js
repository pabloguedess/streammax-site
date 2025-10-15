import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    console.log("📩 Webhook recebido:", req.body);

    const { action, data } = req.body;

    // Apenas processa eventos de pagamento criado
    if (action === "payment.created" || action === "payment.updated") {
      const paymentId = data.id;

      // Busca detalhes do pagamento no Mercado Pago
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      });

      const payment = await response.json();
      console.log("💰 Dados do pagamento:", payment);

      const email = payment.payer?.email;
      const status = payment.status;

      if (status === "approved" && email) {
        const filePath = path.join(process.cwd(), "membros", "usuarios.json");
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        // Verifica se já existe o usuário
        const existe = data.usuarios.find((u) => u.email === email);
        if (!existe) {
          data.usuarios.push({ email, acesso: true });
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
          console.log(`✅ Acesso liberado para ${email}`);
        }
      } else if (status === "cancelled" || status === "refunded") {
        console.log(`❌ Pagamento cancelado ou reembolsado para ${email}`);
      }
    }

    res.status(200).json({ message: "Webhook processado com sucesso" });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    res.status(500).json({ message: "Erro interno", error: error.message });
  }
}
