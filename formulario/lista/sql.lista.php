<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

error_reporting(E_ALL);

include_once 'class/class.connect.php';

$evento = $_POST['event'];

if ($evento == 'getAluno') {
  $sql = "SELECT nome, inscricao, email_enviado 
          FROM aluno";
  $query = $pdo->prepare($sql);
  $query->execute();
  $call = $query->fetchAll(PDO::FETCH_OBJ);
  echo json_encode($call);
}

if ($evento == 'getInfoForm') {
  $sql = "SELECT status, campo_obrigatorio
          FROM formulario";
  $query = $pdo->prepare($sql);
  $query->execute();
  $call = $query->fetchAll(PDO::FETCH_OBJ);
  echo json_encode($call);
}

if ($evento == 'getInfoEmail') {
  $sql = "SELECT *
          FROM email";
  $query = $pdo->prepare($sql);
  $query->execute();
  $call = $query->fetchAll(PDO::FETCH_OBJ);
  echo json_encode($call);
}

if ($evento == 'newEmail') {
  $mail = $_POST['email'];

  $sql = "INSERT INTO email (email)
          VALUE ('$mail')";
  $query = $pdo->prepare($sql);

  if($query->execute()){

    $sql = "SELECT MAX(id_email) as id_email FROM email";
    $query = $pdo->prepare($sql);

    if($query->execute()){
      $call = $query->fetchAll(PDO::FETCH_OBJ);
      echo json_encode($call);
    }else{
      echo json_encode('ERRO INTERNO [3]');
    }
    
  }else{
    echo json_encode('ERRO INTERNO [2]');

  }

  
}

if ($evento == 'edtEmail') {

  $mail = $_POST['email'];
  $id_email = $_POST['id_email'] ;

  $sql = "UPDATE email
          SET email = '$mail'
          WHERE id_email = $id_email";

  $query = $pdo->prepare($sql);

  if($query->execute()){
    echo json_encode('OPERAÇÃO REALIZADA COM SUCESSO!');

  }else{
    echo json_encode('ERRO INTERNO! [4]');
  }
}

if ($evento == 'edtForm') {
  $status = $_POST['statusForm'];
  $obrigatorio = $_POST['obrigatorio'] ;

  $sql = "UPDATE formulario
          set status = '$status', campo_obrigatorio = $obrigatorio";
  $query = $pdo->prepare($sql);
  if($query->execute()){
    echo json_encode('OPERAÇÃO REALIZADA COM SUCESSO!');

  }else{
    echo json_encode('ERRO INTERNO! [1]');
  }
}

if ($evento == 'insert') {

  $dados_alunos = $_POST['dados_alunos'];
  foreach ($dados_alunos as $ln) {
    $nome = $ln['nome'];
    $inscricao = $ln['inscricao'];

    $sql = "INSERT INTO alunos (nome, inscricao, email_enviado)
          VALUES ( '$nome', '$inscricao', 0)";

    $query = $pdo->prepare($sql);
    $query->execute();
  }

  echo json_encode(count($dados_alunos));
}

if ($evento == 'senha') {

  $senha = $_POST['senha'];
  $sql = "SELECT senha FROM senha_formulario
          WHERE senha = '$senha'";

  $query = $pdo->prepare($sql);
  $query->execute();
  $call = $query->fetchAll(PDO::FETCH_OBJ);

  if (empty($call)) {
    echo json_encode("Senha inválida");
  }
}

if ($evento == 'del') {
  $sql = "DELETE FROM aluno";
  $query = $pdo->prepare($sql);
  $query->execute();
  $dir = '../../Mailer/documentos';

  $sql = " ALTER TABLE alunos AUTO_INCREMENT = 1";
  $query = $pdo->prepare($sql);
  $query->execute();

  if(delTree($dir)){

    mkdir($dir);
    chmod($dir, 0777);
  }
}

function delTree($dir) {
  $files = array_diff(scandir($dir), array('.','..'));
   foreach ($files as $file) {
     (is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file");
   }
   return rmdir($dir);
 }