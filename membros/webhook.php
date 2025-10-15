<?php
header('Content-Type: application/json');

// Captura os dados do webhook da Ticto
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Verifica se tem e-mail
if (!isset($data['buyer']['email'])) {
  http_response_code(400);
  echo json_encode(['status' => 'erro', 'mensagem' => 'Payload inválido']);
  exit;
}

$email = strtolower(trim($data['buyer']['email']));
$file = 'usuarios.json';

// Cria arquivo se não existir
if (!file_exists($file)) {
  file_put_contents($file, json_encode(['usuarios' => []], JSON_PRETTY_PRINT));
}

// Lê e adiciona novo usuário
$usuarios = json_decode(file_get_contents($file), true);
if (!in_array($email, $usuarios['usuarios'])) {
  $usuarios['usuarios'][] = $email;
  file_put_contents($file, json_encode($usuarios, JSON_PRETTY_PRINT));
}

echo json_encode(['status' => 'ok', 'mensagem' => "Usuário $email liberado com sucesso."]);
?>
