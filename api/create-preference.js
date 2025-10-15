// /api/create-preference.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: "Bearer APP_USR-3433712951445757-101514-092e34f74eaa81e0abf586bca5b45711-567318971",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            title: "Plano vitalício StreamMax",
            quantity: 1,
            currency_id: "BRL",
            unit_price: 16.9,
          },
        ],
        back_urls: {
          success: "https://streammax-site.vercel.app/sucesso.html",
          failure: "https://streammax-site.vercel.app/erro.html",
        },
         payment_methods: {
        excluded_payment_types: [
          { id: "ticket" }, // exclui boleto
          { id: "atm" }, // exclui débito automático/caixa eletrônico
          { id: "debit_card" }, // exclui cartão de débito
        ],
        default_payment_method_id: "pix", // Pix vem primeiro
      },
        auto_return: "approved",
      }),
    });

    const data = await response.json();

    if (data.init_point) {
      return res.status(200).json({ init_point: data.init_point });
    } else {
      console.error("Erro na resposta do Mercado Pago:", data);
      return res.status(500).json({ error: "Erro ao criar preferência de pagamento" });
    }
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
