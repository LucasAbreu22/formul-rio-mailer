<?php

// $dsn = "mysql:host=192.168.0.106;dbname=cilRecanto";
// $username = "alves";
// $password = "1520Alves";
$dsn = "mysql:host=localhost;dbname=cilrecanto";
$username = "root";
$password = "";
// Create connection

try {
  $pdo = new PDO($dsn, $username, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $ex) {
  echo 'Erro: ' . $ex->getMessage();
}