import { NextResponse } from "next/server";

export async function POST(req) {
  const { email } = await req.json();

  const accessToken = process.env.MP_ACCESS_TOKEN;

  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payer: { email },
        items: [
          {
            title: "StreamMax - Plano Vitalício",
            quantity: 1,
            currency_id: "BRL",
            unit_price: 16.90,
          },
        ],
        payment_methods: {
          excluded_payment_types: [{ id: "ticket" }, { id: "atm" }],
          default_payment_method_id: "pix",
        },
        back_urls: {
          success: "https://streammax-site.vercel.app/sucesso.html",
          failure: "https://streammax-site.vercel.app/checkout.html",
          pending: "https://streammax-site.vercel.app/checkout.html",
        },
        notification_url: "https://streammax-site.vercel.app/api/webhook-mercadopago",
      }),
    });

    const data = await response.json();

    return NextResponse.json({ init_point: data.init_point });
  } catch (err) {
    console.error("Erro ao criar preferência:", err);
    return NextResponse.json({ error: "Erro ao criar preferência" }, { status: 500 });
  }
}
