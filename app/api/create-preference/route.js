import { NextResponse } from "next/server";
import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export async function POST(request) {
  try {
    const body = await request.json();

    const preference = {
      items: [
        {
          title: body.title || "StreamMax Vitalício",
          quantity: body.quantity || 1,
          currency_id: "BRL",
          unit_price: Number(body.price) || 16.9,
        },
      ],
      payer: {
        email: body.email,
      },
      payment_methods: {
        excluded_payment_types: [
          { id: "ticket" },
          { id: "atm" },
          { id: "bank_transfer" },
        ],
        installments: 1,
      },
      back_urls: {
        success: "https://streammax-site.vercel.app/sucesso",
        failure: "https://streammax-site.vercel.app/erro",
        pending: "https://streammax-site.vercel.app/pendente",
      },
      auto_return: "approved",
      notification_url: "https://streammax-site.vercel.app/api/webhook-mercadopago",
    };

    const result = await mercadopago.preferences.create(preference);
    return NextResponse.json({ init_point: result.body.init_point });
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    return NextResponse.json(
      { error: "Falha ao gerar o pagamento" },
      { status: 500 }
    );
  }
}
