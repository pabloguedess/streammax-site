export async function POST(request) {
  try {
    const body = await request.json();
    const { email, status } = body;

    console.log("💬 Webhook recebido:", body);

    if (status === "approved") {
      console.log(`✅ Acesso liberado para: ${email}`);
      // Aqui você pode salvar o email no JSON, banco, etc.
    } else if (status === "refunded" || status === "canceled") {
      console.log(`❌ Acesso removido para: ${email}`);
    }

    return new Response(
      JSON.stringify({ message: "Webhook processado com sucesso", status }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
