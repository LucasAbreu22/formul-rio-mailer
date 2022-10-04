<?php

header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

error_reporting(E_ALL);

include_once 'connection.php';

$inscricao = $_POST['inscricao'];

if($inscricao == ''){
  die("erro: falta inscricao");
}

$sql = "SELECT * FROM aluno WHERE inscricao = $inscricao";
$query = $pdo->prepare($sql);

if($query->execute()){
  $call = $query->fetchAll(PDO::FETCH_OBJ);
  echo json_encode($call ,JSON_NUMERIC_CHECK);
}