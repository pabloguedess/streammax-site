import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: "APP_USR-3433712951445757-101514-092e34f74eaa81e0abf586bca5b45711-567318971", // 🔴 Substitua aqui pelo seu token real
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
        payment_methods: {
          excluded_payment_types: [
            { id: "ticket" }, // remove boleto
            { id: "atm" },    // remove caixa eletrônico
          ],
          default_payment_method_id: "pix", // Pix como padrão
        },
        back_urls: {
          success: "https://streammax-site.vercel.app/sucesso.html",
          failure: "https://streammax-site.vercel.app/erro.html",
        },
        auto_return: "approved",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro Mercado Pago:", data);
      return NextResponse.json({ error: "Erro ao criar preferência" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    return NextResponse.json({ error: "Erro ao criar preferência" }, { status: 500 });
  }
}
