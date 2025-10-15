import MercadoPago from "mercadopago";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { email } = req.body;

    const token = process.env.MP_ACCESS_TOKEN;

    if (!token) {
      console.error("❌ Token do Mercado Pago não encontrado.");
      return res.status(500).json({ error: "Token ausente" });
    }

    MercadoPago.configure({
      access_token: token,
    });

    const preference = await MercadoPago.preferences.create({
      items: [
        {
          title: "Plano Vitalício StreamMax",
          quantity: 1,
          unit_price: 16.9,
          currency_id: "BRL",
        },
      ],
      payer: {
        email,
      },
      payment_methods: {
        excluded_payment_types: [
          { id: "ticket" },
          { id: "atm" },
        ],
        installments: 1,
      },
      back_urls: {
        success: "https://streammax-site.vercel.app/sucesso",
        failure: "https://streammax-site.vercel.app/erro",
        pending: "https://streammax-site.vercel.app/pendente",
      },
      auto_return: "approved",
    });

    return res.status(200).json({
      init_point: preference.body.init_point,
    });
  } catch (error) {
    console.error("❌ Erro na rota /api/create-preference:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
