const url = 'sql.lista.php'
let obrigatorio = false
let onOff = false
let count = 1
let xmModalEmail


$(function () {

    lista.modal()

    confirma({
        msg: `<span>Senha:</span> <br>
        <input type="password" id="passwordDel"/>`,
        call: () => {
            let senha = $("#passwordDel").val()
            let evento = 'senha'
            $.ajax({
                type: "POST",
                url: url,
                data: {
                    event: evento,
                    senha: senha,
                },

            }).done(function (r) {

                if (r) {
                    show(r)
                    setTimeout(()=>{
                        location.reload()
                    },1000)
                    return false
                }

                lista.getAlunos()
                lista.getInfoForm()
            
                $('#checkCampo').removeAttr('disabled', true)
                $('#fileUpload').removeAttr('disabled', true)
                $('#manutencaoEmail').removeAttr('disabled', true)

                $('.labelUp').removeClass('disabilitado')
                $('#manutencaoEmail').removeClass('disabilitado')

                $("#delete").click(function () {
                    confirma({
                        msg: `<span>Senha:</span> <br>
                        <input type="password" id="passwordDel"/>`,
                        call: () => {
                            let senha = $("#passwordDel").val()
                            let evento = 'senha'
                            $.ajax({
                                type: "POST",
                                url: url,
                                data: {
                                    event: evento,
                                    senha: senha,
                                },
            
                            }).done(function (r) {
                                if (r) {
                                    show(r)
                                    return false
                                }
                                let evento = 'del'
                                $.ajax({
                                    type: "POST",
                                    url: url,
                                    data: {
                                        event: evento,
                                    },
                                }).done(function (r) {
                                    $("#dvExcel").html('')
                                    $("#tableDb").html('')
                                    count = 1
            
                                    $('#delete').addClass('disabilitado')
                                    $('#delete').attr('disabled', true)
            
                                })
                            })
                        }
                    })
            
                })
            
                $("body").on("click", "#upload", function () {
                    
                    confirma({
                        msg: `<span>Senha:</span> <br>
                        <input type="password" id="password"/>`,
                        call: () => {
                            let senha = $("#password").val()
                            let evento = 'senha'
                            $.ajax({
                                type: "POST",
                                url: url,
                                data: {
                                    event: evento,
                                    senha: senha,
                                },
            
                            }).done(function (r) {
                                
                                if (r) {
                                    show(r)
                                    return false
                                }
                                var fileUpload = $("#fileUpload")[0];
            
                                //Validate whether File is valid Excel file.
                                var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
                                if (regex.test(fileUpload.value.toLowerCase())) {
                                    if (typeof (FileReader) != "undefined") {
                                        var reader = new FileReader();
            
                                        //For Browsers other than IE.
                                        if (reader.readAsBinaryString) {
                                            reader.onload = function (e) {
                                                lista.ProcessExcel(e.target.result);
                                            };
                                            reader.readAsBinaryString(fileUpload.files[0]);
                                        } else {
                                            //For IE Browser.
                                            reader.onload = function (e) {
                                                var data = "";
                                                var bytes = new Uint8Array(e.target.result);
                                                for (var i = 0; i < bytes.byteLength; i++) {
                                                    data += String.fromCharCode(bytes[i]);
                                                }
                                                lista.ProcessExcel(data);
                                            };
                                            reader.readAsArrayBuffer(fileUpload.files[0]);
                                        }
                                        $("#iconUp").removeAttr('style');
                                        $("#fileUpload").val('');
                                        $('#upload').addClass('disabilitado')
                                        $('#upload').attr('disabled', true)
                                        
                                    } else {
                                        alert("This browser does not support HTML5.");
                                    }
                                } else {
                                    alert("Por favor inclua um arquivo XLSX.");
                                }
            
                            });
                        }
                    })
            
                });
            
                $('#fileUpload').on('change', function() {
                    $('#iconUp').css('color', '#3BD80D');
                    $('#upload').removeAttr('disabled')
                    $('#upload').removeClass('disabilitado')
            });
            
                $('#checkCampo').click(()=>{
                    obrigatorio = !obrigatorio
                    
                    lista.edtForm()
                    
                })
            
                $('#ativarForm').click(()=>{
                    onOff = !onOff
                    
                    lista.ligarForm()
                    lista.edtForm()
                    
                })
            
                $('#manutencaoEmail').click(()=>{
                    xmModalEmail.open()
                    
                })
            })
        }
    })

})

const lista = (function () {

    let dados_email = {
        id_email: '',
        email: '',
    }

    // gets

    function getAlunos() {
        let evento = 'getAluno'
        $.ajax({
            type: "POST",
            url: url,
            data: {
                event: evento,
            },
        }).done(function (r) {
            if (r != "") {
                let table = `<table class="fl-table" id="tableAluno">
                <tr >
                    <th class='thead'>N&#176;</th>
                    <th class='thead'>Nome</th>
                    <th class='thead'>Inscricao</th>
                    <th class='thead'>Email enviado</th>
                </tr>
                    </table>`
                $('#tableDb').append(table)
                
                $('#delete').removeClass('disabilitado')
                $('#delete').removeAttr('disabled', true)
            }
            
            for (let i in r) {
                let td
                if(r[i].email_enviado == 1){
                    td = `<tr >
                    <td>${count++}</td>
                    <td>${r[i].nome}</td>
                    <td>${r[i].inscricao}</td>
                    <td style="text-align: center;">SIM</td>
                    <!-- <td style="text-align: center;"><i class="fas fa-chevron-down"></i></td> -->

                </tr>`
                }else{
                    td = `<tr>
                    <td>${count++}</td>
                    <td>${r[i].nome}</td>
                    <td>${r[i].inscricao}</td>
                    <td  style="text-align: center;">N&#195;O</td>
                </tr>`
                }
                
                $('#tableAluno').append(td)

                
            }

            // $('.fas').click((e)=>{
            // console.log('event :', $(e).attr('id'));
        
            // })
        })
    }

    function getInfoForm(){
        evento= 'getInfoForm'
        $.ajax({
            type: "POST",
            url: url,
            data: {
                event: evento,
            },

        }).done(function (result) {
            let form = result[0]

            if(form.status == "LIGADO"){
                onOff = true
                ligarForm()
            }

            if(form.campo_obrigatorio == '1'){
                obrigatorio = true
                $('#checkCampo').prop('checked', true)
            }

        });
    }

    function getEmail(){

        evento = 'getInfoEmail'

        $.ajax({
            type: "POST",
            url: url,
            data: {
                event: evento,
            },

        }).done(function (result) {

            if(result[0]){
                dados_email.id_email = result[0].id_email
                dados_email.email = result[0].email
                $('#edtMail').val(dados_email.email)
            }

        });

    }

    // DO
    function ProcessExcel(data) {
        //Read the Excel File data.

        var workbook = XLSX.read(data, {
            type: 'binary'
        });

        //Fetch the name of First Sheet.
        var firstSheet = workbook.SheetNames[0];

        //Read all rows from First Sheet into an JSON array.

        let excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
        let inscricao = []
        let nome = []

        let dados_alunos = []

        
        
        let linhas = 0
        
        for (let i in excelRows) {
        
            inscricao[i] = excelRows[i].LISTA.split("(")[1].split(")")[0]
            nome[i] = excelRows[i].LISTA.split("(")[0]

            dados_alunos[i] = {
                inscricao: excelRows[i].LISTA.split("(")[1].split(")")[0],
                nome: excelRows[i].LISTA.split("(")[0]
            }
            linhas++

        }

        if(linhas > 500){
            show(`Insira uma lista de no máximo 500 alunos por vez! <br>
            (Caso sua lista tenha mais de 500, insira 500 e depois os alunos restantes em outra lista)`)
            linhas = 0
            return false
        }

        $('#delete').removeClass('disabilitado')
        $('#delete').removeAttr('disabled')

        let evento = 'insert'
        $.ajax({
            type: "POST",
            url: url,
            data: {
                event: evento,
                dados_alunos: dados_alunos,
            },

        })

        //Create a HTML Table element.
        var table = $("<table class='fl-table' />");
        table[0].border = "1";

        //Add the header row.
        var row = $(table[0].insertRow(-1));

        //Add the header cells.
        var headerCell = $("<th class='thead'/>");
        headerCell.html("N&#176;");
        row.append(headerCell);

        var headerCell = $("<th class='thead'/>");
        headerCell.html("Nome");
        row.append(headerCell);

        var headerCell = $("<th class='thead'/>");
        headerCell.html("Inscricao");
        row.append(headerCell);

        row.append(headerCell);
        //Add the data rows from Excel file.
        
        for (let i in excelRows) {
            //Add the data row.
            var row = $(table[0].insertRow(-1));
            //Add the data cells.
            var cell = $("<td />");
            cell.html(count++);
            row.append(cell);

            cell = $("<td />");
            cell.html(nome[i]);
            row.append(cell);

            cell = $("<td />");
            cell.html(inscricao[i]);
            row.append(cell);

        }

        var dvExcel = $("#dvExcel");
        dvExcel.html("");
        dvExcel.append(table);
    }

    function ligarForm(){

        if(onOff){
            $('#ativarForm').css('color','rgb(0, 255, 55)')
            $('#statusForm').html(" LIGADO")
        }else{
            $('#ativarForm').css('color','rgb(119, 119, 119)')
            $('#statusForm').html(" DESLIGADO")
        }
    }

    function edtForm(){
        evento = 'edtForm'
        
        if(onOff == true){
            statusForm = 'LIGADO'
        }
        else if(onOff == false){
            statusForm = 'DESLIGADO'
        }
        else{
            show('ERRO INTERNO!')
            return false
        }

        $.ajax({
            type: "POST",
            url: url,
            data: {
                event: evento,
                statusForm: statusForm,
                obrigatorio: obrigatorio,
            },

        }).done(function (result) {
            show(result);

        })
        
    }

    function manutencaoEmail(){
        
        evento = 'edtEmail'

        if(dados_email.id_email == '' && dados_email.email == ''){
            evento = 'newEmail'
        }

        let email = $('#edtMail').val()

        if(email == '' || email == undefined){
            show("CAMPO VAZIO!")
            return false
        }
       
        usuario = email.substring(0, email.indexOf("@"));
        dominio = email.substring(email.indexOf("@")+ 1, email.length);

        if ((usuario.length >=1) && (dominio.length >=3) &&
            (usuario.search("@")==-1) && (dominio.search("@")==-1) &&
            (usuario.search(" ")==-1) && (dominio.search(" ")==-1) &&
            (dominio.search(".")!=-1) && (dominio.indexOf(".") >=1)&&
            (dominio.lastIndexOf(".") < dominio.length - 1)) {
                
        }else{
                setTimeout(()=>{
                    show("EMAIL INVÁLIDO!")
                }, 100)
                return false
        }
       
        $.ajax({
            type: "POST",
            url: url,
            data: {
                event: evento,
                id_email: dados_email.id_email,
                email: email,
            },

        }).done(function (result) {
            
            if(evento == 'newEmail' || result[0].id_email){
                dados_email.email = email
                dados_email.id_email = result[0].id_email
                show('OPERAÇÃO REALIZADA COM SUCESSO!')
            }
            if(evento == 'edtEmail'){
                dados_email.email = email
                show(result)
            }
        });

    }

    // modal
    function modal(){
        xmModalEmail = new xModal.create({
            el: "#xmModalEmail",
            title: `<i class="fas fa-envelope"></i> Email para recebimento`,
            width: "400",
            height: "140",
            onOpen:()=>{
                getEmail();
            },
            buttons:{
                btn1:{
                    html:"Confirmar",
                    click: ()=>{
                        manutencaoEmail();
                    }
                }
            },
        });
    }

    return {
        ProcessExcel: ProcessExcel,
        getAlunos: getAlunos,
        getInfoForm: getInfoForm,
        ligarForm: ligarForm,
        edtForm: edtForm,
        manutencaoEmail: manutencaoEmail,
        modal: modal,
    }
})()