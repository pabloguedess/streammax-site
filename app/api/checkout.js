import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const { email } = req.body;

    const preference = {
      items: [
        {
          title: "StreamMax Vitalício",
          quantity: 1,
          currency_id: "BRL",
          unit_price: 16.90
        }
      ],
      payer: { email },
      back_urls: {
        success: "https://streammax-site.vercel.app/sucesso",
        failure: "https://streammax-site.vercel.app/erro",
      },
      auto_return: "approved",
      notification_url: "https://streammax-site.vercel.app/api/webhook-mercadopago"
    };

    const response = await mercadopago.preferences.create(preference);
    return res.status(200).json({ init_point: response.body.init_point });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar checkout' });
  }
}
