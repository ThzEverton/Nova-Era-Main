$(document).ready(function () {
    function carregarDados() {
        var alunos = JSON.parse(localStorage.getItem("alunos")) || [];
        var turmas = JSON.parse(localStorage.getItem("turmas")) || [];
        return { alunos, turmas };
    }

    var { alunos, turmas } = carregarDados();
    var editandoAlunoId = null; // Variável de controle para edição

    function preencherSelectTurmas(turmas) {
        var turmaSelect = $("#serie");
        turmaSelect.empty();
        turmaSelect.append('<option value="">Selecione a Turma</option>');
        turmas.forEach(function (turma) {
            turmaSelect.append(`<option value="${turma.id}">${turma.nome}</option>`);
        });
    }

    function preencherTabelaAlunos(alunos) {
        var tbody = $("#alunos");
        tbody.empty();
        alunos.forEach(function (aluno) {
            tbody.append(
                `<tr>
                    <th scope="row">${aluno.id}</th>
                    <td>${aluno.nome}</td>
                    <td>${aluno.idade}</td>
                    <td>${aluno.turma}</td>
                    <td>${aluno.email}</td>
                    <td>
                        <button class="btn btn-info btn-sm editar" data-id="${aluno.id}">Editar</button>
                        <button class="btn btn-danger btn-sm excluir" data-id="${aluno.id}">Excluir</button>
                    </td>
                </tr>`
            );
        });
    }

    preencherSelectTurmas(turmas);
    preencherTabelaAlunos(alunos);

    function validarCamposObrigatorios() {
        var campos = [
            { id: "nome", mensagem: "Por favor, insira o nome do aluno." },
            { id: "idade", mensagem: "Por favor, insira a idade do aluno." },
            { id: "email", mensagem: "Por favor, insira o e-mail do aluno." },
            { id: "cpf", mensagem: "Por favor, insira o CPF do aluno." },
            { id: "rg", mensagem: "Por favor, insira o RG do aluno." },
            { id: "serie", mensagem: "Por favor, selecione uma turma." },
            { id: "responsavel_nome", mensagem: "Por favor, insira o nome do responsável." },
            { id: "responsavel_cpf", mensagem: "Por favor, insira o CPF do responsável." },
            { id: "responsavel_rg", mensagem: "Por favor, insira o RG do responsável." },
            { id: "responsavel_telefone", mensagem: "Por favor, insira o telefone do responsável." },
            { id: "responsavel_email", mensagem: "Por favor, insira o e-mail do responsável." },
        ];

        for (var campo of campos) {
            var valor = $("#" + campo.id).val().trim();
            if (!valor) {
                alert(campo.mensagem);
                $("#" + campo.id).focus();
                return false;
            }
        }
        return true;
    }

    $("#salvarAluno").click(function () {
        if (!validarCamposObrigatorios()) {
            return;
        }

        var nome = $("#nome").val();
        var idade = $("#idade").val();
        var email = $("#email").val();
        var cpf = $("#cpf").val();
        var rg = $("#rg").val();
        var turmaId = $("#serie").val();
        var responsavelNome = $("#responsavel_nome").val();
        var responsavelCpf = $("#responsavel_cpf").val();
        var responsavelRg = $("#responsavel_rg").val();
        var responsavelTelefone = $("#responsavel_telefone").val();
        var responsavelEmail = $("#responsavel_email").val();

        var selectedTurma = turmas.find((t) => t.id == turmaId);

        if (!selectedTurma) {
            alert("Turma não encontrada.");
            return;
        }

        if (editandoAlunoId) {
            // Editar aluno existente
            var aluno = alunos.find((a) => a.id === editandoAlunoId);
            aluno.nome = nome;
            aluno.idade = idade;
            aluno.email = email;
            aluno.cpf = cpf;
            aluno.rg = rg;
            aluno.turmaId = turmaId;
            aluno.turma = selectedTurma.nome;
            aluno.responsavel.nome = responsavelNome;
            aluno.responsavel.cpf = responsavelCpf;
            aluno.responsavel.rg = responsavelRg;
            aluno.responsavel.telefone = responsavelTelefone;
            aluno.responsavel.email = responsavelEmail;

            editandoAlunoId = null; // Resetar a variável de controle
        } else {
            // Adicionar novo aluno
            var novoAluno = {
                id: alunos.length + 1,
                nome: nome,
                idade: idade,
                email: email,
                cpf: cpf,
                rg: rg,
                turmaId: turmaId,
                turma: selectedTurma.nome,
                responsavel: {
                    nome: responsavelNome,
                    cpf: responsavelCpf,
                    rg: responsavelRg,
                    telefone: responsavelTelefone,
                    email: responsavelEmail,
                },
            };

            alunos.push(novoAluno);
        }

        localStorage.setItem("alunos", JSON.stringify(alunos));
        preencherTabelaAlunos(alunos);
        $("#cadastroModal").modal("hide"); // Fecha a modal
    });

    $(document).on("click", ".excluir", function () {
        var id = $(this).data("id");

        if (confirm("Deseja realmente excluir este aluno?")) {
            alunos = alunos.filter((aluno) => aluno.id !== id);
            localStorage.setItem("alunos", JSON.stringify(alunos));
            preencherTabelaAlunos(alunos);
        }
    });

    $(document).on("click", ".editar", function () {
        var id = $(this).data("id");
        var aluno = alunos.find((a) => a.id === id);

        editandoAlunoId = id; // Configurar o ID do aluno sendo editado

        $("#nome").val(aluno.nome);
        $("#idade").val(aluno.idade);
        $("#email").val(aluno.email);
        $("#cpf").val(aluno.cpf);
        $("#rg").val(aluno.rg);
        $("#serie").val(aluno.turmaId);
        $("#responsavel_nome").val(aluno.responsavel.nome);
        $("#responsavel_cpf").val(aluno.responsavel.cpf);
        $("#responsavel_rg").val(aluno.responsavel.rg);
        $("#responsavel_telefone").val(aluno.responsavel.telefone);
        $("#responsavel_email").val(aluno.responsavel.email);

        $("#cadastroModal").modal("show");
    });
});
