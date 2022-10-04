<?php

header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

error_reporting(E_ALL);

include_once 'connection.php';

$sql = "SELECT * FROM formulario";
$query = $pdo->prepare($sql);

if($query->execute()){
  $call = $query->fetchAll(PDO::FETCH_OBJ);
  echo json_encode($call ,JSON_NUMERIC_CHECK);
}