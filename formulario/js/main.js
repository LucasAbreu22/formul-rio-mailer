let nome_documento = "";
let documentos_nomes = {};
$(function () {
  $("#loading").hide();

  confirmar_inscricao.getInfoForm()

  $("#inscricao").focusout(function () {
    confirmar_inscricao.getAluno();
  });

  $("#enviar").click(function () {
    confirmar_inscricao.enviar();
  });

  $(document).on("change", "#foto3x4", function (e) {
    nome_documento = "foto3x4.";

    confirmar_inscricao.salvar_documento(this, nome_documento);
  });

  $(document).on("change", "#certidao_nasc", function (e) {
    nome_documento = "certidao_nasc.";

    confirmar_inscricao.salvar_documento(this, nome_documento);
  });

  $(document).on("change", "#declaracao_escolaridade", function (e) {
    nome_documento = "declaracao_escolaridade.";

    confirmar_inscricao.salvar_documento(this, nome_documento);
  });

  $(document).on("change", "#comprovante_residencia", function (e) {
    nome_documento = "comprovante_residencia.";

    confirmar_inscricao.salvar_documento(this, nome_documento);
  });

  $(document).on("change", "#copia_cpf", function (e) {
    nome_documento = "copia_cpf.";

    confirmar_inscricao.salvar_documento(this, nome_documento);
  });

  $(document).on("change", "#copia_rg_responsavel", function (e) {
    nome_documento = "copia_rg_responsavel.";

    confirmar_inscricao.salvar_documento(this, nome_documento);
  });
});

const confirmar_inscricao = (function () {
  let dados_aluno = {
    nome: "",
    inscricao: "",
    email_contato: "",
    email_enviado: "",
  };

  let campo_obrigatorio = false

  let url_mailer = "../Mailer/index.php";
  let url_salvar_arquivo = "../Mailer/salvar_arquivo.php";


  function tipoArquivo(documento){
    let tipo_arquivo
    
    if(documento.files[0].type == "application/pdf"){
      tipo_arquivo = 'pdf'
      return tipo_arquivo
    } 
    if(documento.files[0].type == "image/jpg"){
      tipo_arquivo = 'jpg'
      return tipo_arquivo
    } 
    if(documento.files[0].type == "image/jpeg"){
      tipo_arquivo = 'jpeg'
      return tipo_arquivo
    } 
    if(documento.files[0].type == "image/png"){
      tipo_arquivo = 'png'
      return tipo_arquivo
    }
  }

  function salvar_documento(documento, nome_documento) {
    if (dados_aluno.inscricao == "") {
      show("Preencha o campo do inscricao!");
      return false
    }

    if (dados_aluno.nome == "") {
      show("Preencha o campo do nome!");
      return false
    }
    

    if (
      documento.files[0].type == "application/pdf" ||
      documento.files[0].type == "image/jpg" ||
      documento.files[0].type == "image/jpeg" ||
      documento.files[0].type == "image/png"
    ) {
      $("#loading").show();
      $("#enviar").hide();

      let tipo_arquivo = tipoArquivo(documento);

      if(documento.files[0].type == "image/jpg" ||
          documento.files[0].type == "image/jpeg" ||
          documento.files[0].type == "image/png"){

            const compressor = new Compress()

            const files = [documento.files[0]]
            compressor.compress(files, {
              size: 4,
              quality: 0.35
            }).then((results) => {
              let documentos_convertido = {
                arquivo: results[0].prefix + results[0].data,
                name: nome_documento + tipo_arquivo,
              };
              const output = results[0]
              if (nome_documento == "foto3x4.") {
                documentos_nomes.foto3x4 = documentos_convertido.name;
              }
              if (nome_documento == "certidao_nasc.") {
                documentos_nomes.certidao_nasc = documentos_convertido.name;
              }
              if (nome_documento == "declaracao_escolaridade.") {
                documentos_nomes.declaracao_escolaridade = documentos_convertido.name;
              }
              if (nome_documento == "comprovante_residencia.") {
                documentos_nomes.comprovante_residencia = documentos_convertido.name;
              }
              if (nome_documento == "copia_cpf.") {
                documentos_nomes.copia_cpf = documentos_convertido.name;
              }
              if (nome_documento == "copia_rg_responsavel.") {
                documentos_nomes.copia_rg_responsavel = documentos_convertido.name;
              }

      
              $.ajax({
                type: "POST",
                url: url_salvar_arquivo,
                data: {
                  nome_aluno: dados_aluno.nome,
                  inscricao_aluno: dados_aluno.inscricao,
                  arquivo: documentos_convertido.arquivo,
                  arquivo_nome: documentos_convertido.name,
                },
              }).done(function () {
                $("#loading").hide();
                $("#enviar").show();
              });
            })

      }

      else if(documento.files[0].type == "application/pdf"){

        var fReader = new FileReader();

      fReader.readAsDataURL(documento.files[0]);

      fReader.onloadend = function (event) {
        let documentos_convertido = {
          arquivo: event.target.result,
          name: nome_documento + tipo_arquivo,
        };


        if (nome_documento == "foto3x4.") {
          documentos_nomes.foto3x4 = documentos_convertido.name;
        }
        if (nome_documento == "certidao_nasc.") {
          documentos_nomes.certidao_nasc = documentos_convertido.name;
        }
        if (nome_documento == "declaracao_escolaridade.") {
          documentos_nomes.declaracao_escolaridade = documentos_convertido.name;
        }
        if (nome_documento == "comprovante_residencia.") {
          documentos_nomes.comprovante_residencia = documentos_convertido.name;
        }
        if (nome_documento == "copia_cpf.") {
          documentos_nomes.copia_cpf = documentos_convertido.name;
        }
        if (nome_documento == "copia_rg_responsavel.") {
          documentos_nomes.copia_rg_responsavel = documentos_convertido.name;
        }
         
        $.ajax({
          type: "POST",
          url: url_salvar_arquivo,
          data: {
            nome_aluno: dados_aluno.nome,
            inscricao_aluno: dados_aluno.inscricao,
            arquivo: documentos_convertido.arquivo,
            arquivo_nome: documentos_convertido.name,
          },
        }).done(function () {
          $("#loading").hide();
          $("#enviar").show();
        });
      };

      }

      else{
        show("ERRO INTERNO 1")
      }

      
    } else {
      show(
        "O arquivo '" +
          nome_documento +
          `' não atende os requisitos! <br> São aceitos apenas PDF, JPG, JPEG e PNG.`
      );

      if (nome_documento == "foto3x4.") {
        $("#foto3x4").val("");
        documentos_nomes.foto3x4 = "";
      }
      if (nome_documento == "certidao_nasc.") {
        $("#certidao_nasc").val("");
        documentos_nomes.certidao_nasc = "";
      }
      if (nome_documento == "declaracao_escolaridade.") {
        $("#declaracao_escolaridade").val("");
        documentos_nomes.declaracao_escolaridade = "";
      }
      if (nome_documento == "comprovante_residencia.") {
        $("#comprovante_residencia").val("");
        documentos_nomes.comprovante_residencia = "";
      }
      if (nome_documento == "copia_cpf.") {
        $("#copia_cpf").val("");
        documentos_nomes.copia_cpf = "";
      }
      if (nome_documento == "copia_rg_responsavel.") {
        $("#copia_rg_responsavel").val("");
        documentos_nomes.copia_rg_responsavel = "";
      }
    }
  }

  function enviar() {

    dados_aluno.email_contato = $("#email_contato").val()

    if (dados_aluno.email_contato == "") {
      show("Preencha o campo de email!");
      return false
    }

    usuario = dados_aluno.email_contato.substring(0, dados_aluno.email_contato.indexOf("@"));
    dominio = dados_aluno.email_contato.substring(dados_aluno.email_contato.indexOf("@")+ 1, dados_aluno.email_contato.length);

    if ((usuario.length >=1) && (dominio.length >=3) &&
        (usuario.search("@")==-1) && (dominio.search("@")==-1) &&
        (usuario.search(" ")==-1) && (dominio.search(" ")==-1) &&
        (dominio.search(".")!=-1) && (dominio.indexOf(".") >=1)&&
        (dominio.lastIndexOf(".") < dominio.length - 1)) {
        } else{
          return false
        }

    confirma({
      msg:`<span style="color:red;">Em caso de envios inválidos da documentação, pode ocasionar na perda da vaga!</span>`,
      call:()=>{

        if(campo_obrigatorio == true){

          if ($("#copia_rg_responsavel")[0].files[0] == undefined) {
            documentos_1();
          } 
          
          else {
            documentos_2();
          }

        }else if(campo_obrigatorio == false){

          if ($("#copia_rg_responsavel")[0].files[0] == undefined && $("#declaracao_escolaridade")[0].files[0] == undefined) {
            documentos_3();
          } 
          
          else if ($("#declaracao_escolaridade")[0].files[0] == undefined){
            documentos_4();
          }
          else if ($("#copia_rg_responsavel")[0].files[0] == undefined){
            documentos_6();
          }
          else{
            documentos_5();
          }

        }else{
          show('ERRO INTERNO')
        }

        
      }
    })
    
  }

  // tem foto, certidao, desclaracao, comprov, copia cpf
  async function documentos_1() {
    let documentos = {
      foto3x4: $("#foto3x4")[0],
      certidao_nasc: $("#certidao_nasc")[0],
      declaracao_escolaridade: $("#declaracao_escolaridade")[0],
      comprovante_residencia: $("#comprovante_residencia")[0],
      copia_cpf: $("#copia_cpf")[0],
    };

    if (documentos.foto3x4.files[0] == undefined) {
      show("Não há documento de foto 3x4 anexado ao formulário!");
      return false;
    }

    if (documentos.certidao_nasc.files[0] == undefined) {
      show("Não há documento de certidão de nascimento anexado ao formulário!");
      return false;
    }

    if (documentos.declaracao_escolaridade.files[0] == undefined) {
      show(
        "Não há documento de declaração de escolaridade anexado ao formulário!"
      );
      return false;
    }

    if (documentos.comprovante_residencia.files[0] == undefined) {
      show(
        "Não há documento de comprovante de residência anexado ao formulário!"
      );
      return false;
    }

    if (documentos.copia_cpf.files[0] == undefined) {
      show("Não há documento de cópia do CPF anexado ao formulário!");
      return false;
    }

    if (dados_aluno.inscricao == "") {
      show("Preencha o campo do inscricao!");
      return false;
    }

    if (dados_aluno.nome == "") {
      show("Preencha o campo do nome!");
      return false;
    } else {
      count = 0;
      $("#enviar").prop("disabled", true);
      $("#enviar").hide();
      $("#loading").show();
      show("O envio pode demorar um pouco devido ao tamanho dos arquivos!");
      for (let i in documentos) {
        if (
          documentos[i].files[0].type == "application/pdf" ||
          documentos[i].files[0].type == "image/jpg" ||
          documentos[i].files[0].type == "image/jpeg" ||
          documentos[i].files[0].type == "image/png"
        ) {
          count++;
          if (count == 5) {

            enviar_email(documentos_nomes)
            
          }
        } else {
          show(
            "O arquivo '" +
              documentos[i].files[0].name +
              `' não atende os requisitos! <br> São aceitos apenas PDF, JPG, JPEG e PNG.`
          );
          return;
        }
      }
    }
  }

  // tem todos os documentos
  async function documentos_2() {
    let documentos = {
      foto3x4: $("#foto3x4")[0],
      certidao_nasc: $("#certidao_nasc")[0],
      declaracao_escolaridade: $("#declaracao_escolaridade")[0],
      comprovante_residencia: $("#comprovante_residencia")[0],
      copia_cpf: $("#copia_cpf")[0],
      copia_rg_responsavel: $("#copia_rg_responsavel")[0],
    };

    if (documentos.foto3x4.files[0] == undefined) {
      show("Não há documento de foto 3x4 anexado ao formulário!");
      return false;
    }

    if (documentos.certidao_nasc.files[0] == undefined) {
      show("Não há documento de certidão de nascimento anexado ao formulário!");
      return false;
    }

    if (documentos.declaracao_escolaridade.files[0] == undefined) {
      show(
        "Não há documento de declaração de escolaridade anexado ao formulário!"
      );
      return false;
    }

    if (documentos.comprovante_residencia.files[0] == undefined) {
      show(
        "Não há documento de comprovante de residência anexado ao formulário!"
      );
      return false;
    }

    if (documentos.copia_cpf.files[0] == undefined) {
      show("Não há documento de cópia do CPF anexado ao formulário!");
      return false;
    }

    if (dados_aluno.inscricao == "") {
      show("Preencha o campo do inscricao!");
      return false;
    }

    if (dados_aluno.nome == "") {
      show("Preencha o campo do nome!");
      return false;
    } else {
      let count = 0;

      $("#enviar").prop("disabled", true);
      $("#enviar").hide();
      $("#loading").show();
      show("O envio pode demorar um pouco devido ao tamanho dos arquivos!");
      for (let i in documentos) {
        if (
          documentos[i].files[0].type == "application/pdf" ||
          documentos[i].files[0].type == "image/jpg" ||
          documentos[i].files[0].type == "image/jpeg" ||
          documentos[i].files[0].type == "image/png"
        ) {
          count++;

          if (count == 6) {
            enviar_email(documentos_nomes)
          }
        } else {
          show(
            "O arquivo '" +
              documentos[i].files[0].name +
              `' não atende os requisitos! <br> São aceitos apenas PDF, JPG, JPEG e PNG.`
          );
          return;
        }
      }
    }
  }

// sem declaracao e sem rg responsaveç
  async function documentos_3() {
    let documentos = {
      foto3x4: $("#foto3x4")[0],
      certidao_nasc: $("#certidao_nasc")[0],
      comprovante_residencia: $("#comprovante_residencia")[0],
      copia_cpf: $("#copia_cpf")[0],
    };

    if (documentos.foto3x4.files[0] == undefined) {
      show("Não há documento de foto 3x4 anexado ao formulário!");
      return false;
    }

    if (documentos.certidao_nasc.files[0] == undefined) {
      show("Não há documento de certidão de nascimento anexado ao formulário!");
      return false;
    }

    if (documentos.comprovante_residencia.files[0] == undefined) {
      show(
        "Não há documento de comprovante de residência anexado ao formulário!"
      );
      return false;
    }

    if (documentos.copia_cpf.files[0] == undefined) {
      show("Não há documento de cópia do CPF anexado ao formulário!");
      return false;
    }

    if (dados_aluno.inscricao == "") {
      show("Preencha o campo do inscricao!");
      return false;
    }

    if (dados_aluno.nome == "") {
      show("Preencha o campo do nome!");
      return false;
    } else {
      count = 0;
      $("#enviar").prop("disabled", true);
      $("#enviar").hide();
      $("#loading").show();
      show("O envio pode demorar um pouco devido ao tamanho dos arquivos!");
      for (let i in documentos) {
        if (
          documentos[i].files[0].type == "application/pdf" ||
          documentos[i].files[0].type == "image/jpg" ||
          documentos[i].files[0].type == "image/jpeg" ||
          documentos[i].files[0].type == "image/png"
        ) {
          count++;
          
          if (count == 4) {

            enviar_email(documentos_nomes)

          }
        } else {
          show(
            "O arquivo '" +
              documentos[i].files[0].name +
              `' não atende os requisitos! <br> São aceitos apenas PDF, JPG, JPEG e PNG.`
          );
          return;
        }
      }
    }
  }

// sem declaracao e com rg responsaveç
  async function documentos_4() {
    let documentos = {
      foto3x4: $("#foto3x4")[0],
      certidao_nasc: $("#certidao_nasc")[0],
      comprovante_residencia: $("#comprovante_residencia")[0],
      copia_cpf: $("#copia_cpf")[0],
      copia_rg_responsavel: $("#copia_rg_responsavel")[0],
    };

    if (documentos.foto3x4.files[0] == undefined) {
      show("Não há documento de foto 3x4 anexado ao formulário!");
      return false;
    }

    if (documentos.certidao_nasc.files[0] == undefined) {
      show("Não há documento de certidão de nascimento anexado ao formulário!");
      return false;
    }

    if (documentos.comprovante_residencia.files[0] == undefined) {
      show(
        "Não há documento de comprovante de residência anexado ao formulário!"
      );
      return false;
    }

    if (documentos.copia_cpf.files[0] == undefined) {
      show("Não há documento de cópia do CPF anexado ao formulário!");
      return false;
    }

    if (documentos.copia_rg_responsavel.files[0] == undefined) {
      show("Não há documento de cópia do RG do responsável anexado ao formulário!");
      return false;
    }

    if (dados_aluno.inscricao == "") {
      show("Preencha o campo do inscricao!");
      return false;
    }

    if (dados_aluno.nome == "") {
      show("Preencha o campo do nome!");
      return false;
    } else {
      let count = 0;

      $("#enviar").prop("disabled", true);
      $("#enviar").hide();
      $("#loading").show();
      show("O envio pode demorar um pouco devido ao tamanho dos arquivos!");
      for (let i in documentos) {
        if (
          documentos[i].files[0].type == "application/pdf" ||
          documentos[i].files[0].type == "image/jpg" ||
          documentos[i].files[0].type == "image/jpeg" ||
          documentos[i].files[0].type == "image/png"
        ) {
          count++;

          if (count == 5) {
            enviar_email(documentos_nomes)
          }
        } else {
          show(
            "O arquivo '" +
              documentos[i].files[0].name +
              `' não atende os requisitos! <br> São aceitos apenas PDF, JPG, JPEG e PNG.`
          );
          return;
        }
      }
    }
  }

// com declaracao e com rg responsaveç
  async function documentos_5() {
    let documentos = {
      foto3x4: $("#foto3x4")[0],
      certidao_nasc: $("#certidao_nasc")[0],
      declaracao_escolaridade: $("#declaracao_escolaridade")[0],
      comprovante_residencia: $("#comprovante_residencia")[0],
      copia_cpf: $("#copia_cpf")[0],
      copia_rg_responsavel: $("#copia_rg_responsavel")[0],
    };


    if (documentos.foto3x4.files[0] == undefined) {
      show("Não há documento de foto 3x4 anexado ao formulário!");
      return false;
    }

    if (documentos.certidao_nasc.files[0] == undefined) {
      show("Não há documento de certidão de nascimento anexado ao formulário!");
      return false;
    }

    if (documentos.comprovante_residencia.files[0] == undefined) {
      show(
        "Não há documento de comprovante de residência anexado ao formulário!"
      );
      return false;
    }

    if (documentos.copia_cpf.files[0] == undefined) {
      show("Não há documento de cópia do CPF anexado ao formulário!");
      return false;
    }


    if (dados_aluno.inscricao == "") {
      show("Preencha o campo do inscricao!");
      return false;
    }

    if (dados_aluno.nome == "") {
      show("Preencha o campo do nome!");
      return false;
    } else {
      let count = 0;

      $("#enviar").prop("disabled", true);
      $("#enviar").hide();
      $("#loading").show();
      show("O envio pode demorar um pouco devido ao tamanho dos arquivos!");
      for (let i in documentos) {
        if (
          documentos[i].files[0].type == "application/pdf" ||
          documentos[i].files[0].type == "image/jpg" ||
          documentos[i].files[0].type == "image/jpeg" ||
          documentos[i].files[0].type == "image/png"
        ) {
          count++;

          if (count == 6) {
            enviar_email(documentos_nomes)
          }
        } else {
          show(
            "O arquivo '" +
              documentos[i].files[0].name +
              `' não atende os requisitos! <br> São aceitos apenas PDF, JPG, JPEG e PNG.`
          );
          return;
        }
      }
    }
  }

// com declaracao e sem rg responsaveç
  async function documentos_6() {
    let documentos = {
      foto3x4: $("#foto3x4")[0],
      certidao_nasc: $("#certidao_nasc")[0],
      declaracao_escolaridade: $("#declaracao_escolaridade")[0],
      comprovante_residencia: $("#comprovante_residencia")[0],
      copia_cpf: $("#copia_cpf")[0],
    };


    if (documentos.foto3x4.files[0] == undefined) {
      show("Não há documento de foto 3x4 anexado ao formulário!");
      return false;
    }

    if (documentos.certidao_nasc.files[0] == undefined) {
      show("Não há documento de certidão de nascimento anexado ao formulário!");
      return false;
    }

    if (documentos.comprovante_residencia.files[0] == undefined) {
      show(
        "Não há documento de comprovante de residência anexado ao formulário!"
      );
      return false;
    }

    if (documentos.copia_cpf.files[0] == undefined) {
      show("Não há documento de cópia do CPF anexado ao formulário!");
      return false;
    }


    if (dados_aluno.inscricao == "") {
      show("Preencha o campo do inscricao!");
      return false;
    }

    if (dados_aluno.nome == "") {
      show("Preencha o campo do nome!");
      return false;
    } else {
      let count = 0;

      $("#enviar").prop("disabled", true);
      $("#enviar").hide();
      $("#loading").show();
      show("O envio pode demorar um pouco devido ao tamanho dos arquivos!");
      for (let i in documentos) {
        if (
          documentos[i].files[0].type == "application/pdf" ||
          documentos[i].files[0].type == "image/jpg" ||
          documentos[i].files[0].type == "image/jpeg" ||
          documentos[i].files[0].type == "image/png"
        ) {
          count++;

          if (count == 5) {
            enviar_email(documentos_nomes)
          }
        } else {
          show(
            "O arquivo '" +
              documentos[i].files[0].name +
              `' não atende os requisitos! <br> São aceitos apenas PDF, JPG, JPEG e PNG.`
          );
          return;
        }
      }
    }
  }

  function enviar_email(documentos_nomes){
    $.ajax({
      type: "POST",
      url: url_mailer,
      data: {
        nome_aluno: dados_aluno.nome,
        inscricao_aluno: dados_aluno.inscricao,
        email_enviado: dados_aluno.email_enviado,
        email_contato: dados_aluno.email_contato,

        foto3x4_nome: documentos_nomes.foto3x4,
        certidao_nasc_nome: documentos_nomes.certidao_nasc,
        declaracao_escolaridade_nome: documentos_nomes.declaracao_escolaridade,
        comprovante_residencia_nome: documentos_nomes.comprovante_residencia,
        copia_cpf_nome: documentos_nomes.copia_cpf,
        copia_rg_responsavel_nome: documentos_nomes.copia_rg_responsavel,
      },
    }).done(function (result) {
      $("#inscricao").val("");
      $("#name").val("");
      $("#email_contato").val("");
      $("#foto3x4").val("");
      $("#certidao_nasc").val("");
      $("#declaracao_escolaridade").val("");
      $("#comprovante_residencia").val("");
      $("#copia_cpf").val("");
      $("#copia_rg_responsavel").val("");

      dados_aluno = {
        nome: "",
        inscricao: "",
        email_enviado: "",
      };

      show(result);
      $("#loading").hide();

      $("#enviar").removeAttr("disabled", true);
      $("#enviar").show();
    });
  }

  function getAluno() {
    inscricao = $("#inscricao").val().trim();

    if (inscricao == "") {
      show("Campo de inscrição vazio!");
      $("#inscricao").val("");
      $("#name").val("");
      return false;
    }

    if (!Number(inscricao)) {
      show("Não é um número!");
      return false;
    }

    $.ajax({
      type: "POST",
      url: "../Mailer/sql.aluno.php",
      data: { inscricao: inscricao },
    }).done(function (result) {

      if (result.length == 0) {
        show("Aluno não contemplado!");

        $("#inscricao").val("");
        $("#name").val("");
        
        dados_aluno = {
          nome: '',
          inscricao: '',
          email_enviado: '',
        };
        return false;
      }

      if (result[0].email_enviado >= 1) {
        show(
          `O aluno ${result[0].nome} já está com email encaminhado!<br> Em caso de envio errado de documentos, entrar em contato com CIL Recanto.`
        );
        $("#inscricao").val("");
        $("#name").val("");

        dados_aluno = {
          nome: '',
          inscricao: '',
          email_enviado: '',
        };
        return false;
      }

      dados_aluno = {
        nome: result[0].nome,
        inscricao: result[0].inscricao,
        email_enviado: result[0].email_enviado,
      };
      $("#name").val(result[0].nome);
    });
  }

  function getInfoForm(){
    $.ajax({
      type: "POST",
      url: "../Mailer/sql.form.php",
      data: {},
    }).done(function (result) {

      if(result[0].status == 'DESLIGADO'){
        $('.content').remove()
        show('FORA DO PERÍODO DE EFETIVAÇÃO!')
      }
      if(result[0].campo_obrigatorio == 1){
        $('#lblDeclaracao').html('Declaração de escolaridade ou certificado*')
          campo_obrigatorio = true
      }

    })
  }

  return {
    enviar: enviar,
    getAluno: getAluno,
    salvar_documento: salvar_documento,
    getInfoForm: getInfoForm,
  };
})();
