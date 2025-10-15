import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.action === "payment.created") {
      const email = body.data?.payer?.email || body.data?.payer_email;

      if (email) {
        const filePath = path.join(process.cwd(), "membros", "usuarios.json");
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

        // adiciona o email do cliente
        if (!data.usuarios.includes(email)) {
          data.usuarios.push(email);
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        }
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Erro no webhook:", error);
    return new Response("Erro no servidor", { status: 500 });
  }
}
