import mercadopago from 'mercadopago';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { email } = req.body;

    // Coloque aqui seu token do Mercado Pago
    mercadopago.configure({
      access_token: "APP_USR-3433712951445757-101514-092e34f74eaa81e0abf586bca5b45711-567318971"
    });

    const preference = {
      payer_email: email,
      items: [
        {
          title: "StreamMax - Plano Vitalício",
          quantity: 1,
          currency_id: "BRL",
          unit_price: 16.9
        }
      ],
      payment_methods: {
        excluded_payment_types: [
          { id: "ticket" } // remove boleto
        ],
        default_payment_method_id: null,
        installments: 1
      },
      back_urls: {
        success: "https://streammax-site.vercel.app/sucesso.html",
        failure: "https://streammax-site.vercel.app/erro.html",
        pending: "https://streammax-site.vercel.app/aguardando.html"
      },
      auto_return: "approved",
      external_reference: email
    };

    const result = await mercadopago.preferences.create(preference);

    return res.status(200).json({ init_point: result.body.init_point });

  } catch (error) {
    console.error("Erro no checkout:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
