import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN // adicione sua chave no painel da Vercel
});

export async function POST(req) {
  try {
    const { email } = await req.json();

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            title: "StreamMax Plano Vitalício",
            quantity: 1,
            currency_id: "BRL",
            unit_price: 16.9,
          },
        ],
        payer: { email },
        payment_methods: {
          excluded_payment_types: [{ id: "ticket" }],
          installments: 1,
        },
        back_urls: {
          success: "https://streammax-site.vercel.app/sucesso.html",
          failure: "https://streammax-site.vercel.app/erro.html",
        },
        auto_return: "approved",
        notification_url: "https://streammax-site.vercel.app/api/webhook-mercadopago",
      },
    });

    return new Response(JSON.stringify({ init_point: result.init_point }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    return new Response(JSON.stringify({ error: "Erro ao criar pagamento" }), { status: 500 });
  }
}
