export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { email, status } = req.body;

    console.log('📩 Webhook recebido:', req.body);

    if (status === 'approved') {
      // Aqui você pode salvar o email em um banco de dados, planilha, JSON, etc.
      console.log(`✅ Acesso liberado para: ${email}`);
    } else if (status === 'refunded' || status === 'canceled') {
      console.log(`❌ Acesso removido para: ${email}`);
    }

    res.status(200).json({ message: 'Webhook processado com sucesso' });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
