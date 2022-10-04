<?php

header('Access-Control-Allow-Origin: *');
// Permitted types of request
header('Access-Control-Allow-Methods: POST, OPTIONS');

// Describe custom headers
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Range, Content-Disposition, Content-Type');

// A comma-separated list of domains
header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);

// Allow cookie
header('Access-Control-Allow-Credentials: true');


$foto3x4 = 0;
$certidao_nasc = 0;
$declaracao_escolaridade = 0;
$comprovante_residencia = 0;
$copia_cpf = 0;

if ($_POST['foto3x4_nome']) {
    $foto3x4 = 1;
}
if ($_POST['certidao_nasc_nome']) {
    $certidao_nasc = 1;
}

if ($_POST['comprovante_residencia_nome']) {
    $comprovante_residencia = 1;
}
if ($_POST['copia_cpf_nome']) {
    $copia_cpf = 1;
}


if ($foto3x4 == 0 || $certidao_nasc == 0 || $comprovante_residencia == 0 || $copia_cpf == 0) {
    die("erro: falta documentação");
}


$dados_aluno->nome = $_POST['nome_aluno'];
$dados_aluno->inscricao = $_POST['inscricao_aluno'];
$dados_aluno->email_enviado = $_POST['email_enviado'];
$dados_aluno->email_contato = $_POST['email_contato'];


require 'PHPMailerAutoload.php';
include_once 'connection.php';

$dados_aluno->email_enviado++;

$sql = "UPDATE alunos SET email_enviado = $dados_aluno->email_enviado WHERE inscricao = $dados_aluno->inscricao";
$query = $pdo->prepare($sql);

if ($query->execute()) {


    $sql = "SELECT email FROM email WHERE id_email = (SELECT MAX(id_email) FROM email)";
    $query = $pdo->prepare($sql);

    if ($query->execute()){

        $email_recebedor = $query->fetchAll(PDO::FETCH_OBJ);

        $mail = new PHPMailer;

        $mail->SMTPDebug = 0;

        $mail->isSMTP();
        $mail->CharSet = "UTF-8";
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->setLanguage('pt_br', '/optional/path/to/language/directory/');
        $mail->Username = 'inovatecemails@gmail.com';
        $mail->Password = 'Honra2017';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('inovatecemails@gmail.com', 'Formulário');
        $mail->addAddress($email_recebedor[0]->email);

        $mail->addAttachment("documentos/" . $dados_aluno->inscricao . "/" . $_POST["foto3x4_nome"]);
        $mail->addAttachment("documentos/" . $dados_aluno->inscricao . "/" . $_POST["certidao_nasc_nome"]);
        $mail->addAttachment("documentos/" . $dados_aluno->inscricao . "/" . $_POST["comprovante_residencia_nome"]);
        $mail->addAttachment("documentos/" . $dados_aluno->inscricao . "/" . $_POST["copia_cpf_nome"]);

        if ($_POST['copia_rg_responsavel_nome']) {
            $mail->addAttachment("documentos/" . $dados_aluno->inscricao . "/" . $_POST["copia_rg_responsavel_nome"]);
        }
        if ($_POST['declaracao_escolaridade_nome']) {
            $mail->addAttachment("documentos/" . $dados_aluno->inscricao . "/" . $_POST["declaracao_escolaridade_nome"]);
        }

        $mail->isHTML(true);

        $mail->Subject = 'Mensagem do Formulário';
        $mail->Body    = 'Aluno: <b>' . $dados_aluno->nome . '</b>
                        <br>Inscrição: <b>' . $dados_aluno->inscricao . '</b>
                        <br>Email para contato: <b>'.$dados_aluno->email_contato.'</b>
                        <br> <b>Documentos abaixo:</b>';

        if (!$mail->send()) {
            print_r('Mensagem não enviada!');
        } else {
            print_r('Mensagem enviada com sucesso!');
        }
    }
    
}