import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  if (body.type === "payment") {
    const paymentId = body.data.id;

    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    });

    const paymentData = await res.json();

    if (paymentData.status === "approved") {
      const email = paymentData.payer.email;
      const password = Math.random().toString(36).substring(2, 10);
      const user = { email, password };

      const filePath = path.join(process.cwd(), "membros", "usuarios.json");
      let users = [];

      if (fs.existsSync(filePath)) {
        users = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      }

      users.push(user);
      fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

      console.log(`✅ Usuário criado: ${email}`);
    }
  }

  return NextResponse.json({ status: "ok" });
}
