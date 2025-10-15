import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();

    // Apenas processa pagamentos aprovados
    if (data.type === "payment") {
      const paymentId = data.data.id;

      // Pega detalhes da transação no Mercado Pago
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
      });
      const payment = await response.json();

      if (payment.status === "approved" && payment.payer?.email) {
        const email = payment.payer.email.trim().toLowerCase();
        const usuariosPath = path.join(process.cwd(), "app", "membros", "usuarios.json");

        let usuarios = [];
        if (fs.existsSync(usuariosPath)) {
          usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf8"));
        }

        // Verifica se o e-mail já está cadastrado
        const exists = usuarios.some((u) => u.email === email);
        if (!exists) {
          usuarios.push({
            email,
            senha: Math.random().toString(36).slice(-8), // senha aleatória
            dataCadastro: new Date().toISOString(),
          });

          fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
          console.log(`✅ Novo usuário liberado: ${email}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
