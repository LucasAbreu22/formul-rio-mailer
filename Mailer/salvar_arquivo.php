<?php

header('Access-Control-Allow-Origin: *');
// Permitted types of request
header('Access-Control-Allow-Methods: POST, OPTIONS');

// Describe custom headers
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Range, Content-Disposition, Content-Type');

// A comma-separated list of domains
// header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);

// Allow cookie
header('Access-Control-Allow-Credentials: true');

$inscricao = $_POST['inscricao_aluno'];
$name = $_POST['arquivo_nome'];
$arquivo = $_POST['arquivo'];

mkdir("documentos/" . $inscricao);
chmod("documentos/" . $inscricao, 0777);

list($tipo, $dados) = explode(';', $arquivo);

list(, $dados) = explode(',', $dados);

$dados = base64_decode($dados);

file_put_contents("documentos/" . $inscricao . "/" . $name, $dados);
