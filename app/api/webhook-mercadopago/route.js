import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("🔔 Webhook recebido:", body);

    const payment = body.data?.id;
    if (!payment) return new Response("Sem ID de pagamento", { status: 400 });

    // Buscar detalhes do pagamento no Mercado Pago
    const resp = await fetch(`https://api.mercadopago.com/v1/payments/${payment}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    });
    const data = await resp.json();

    if (data.status === "approved") {
      const email = data.payer?.email;
      if (email) {
        const filePath = path.join(process.cwd(), "app/membros/usuarios.json");
        const usuarios = JSON.parse(fs.readFileSync(filePath, "utf8") || "[]");

        // Adiciona o email se ainda não existir
        if (!usuarios.find(u => u.email === email)) {
          usuarios.push({ email, plano: "vitalicio", status: "ativo" });
          fs.writeFileSync(filePath, JSON.stringify(usuarios, null, 2));
        }

        console.log(`✅ Acesso liberado para: ${email}`);
      }
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Erro no webhook:", err);
    return new Response("Erro interno", { status: 500 });
  }
}
