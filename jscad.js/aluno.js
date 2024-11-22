$(document).ready(function() {
    // Função para carregar os dados do localStorage
    function carregarDados() {
        // Verificar se há dados salvos no localStorage
        var alunos = JSON.parse(localStorage.getItem('alunos')) || [];
        var turmas = JSON.parse(localStorage.getItem('turmas')) || [];

        return { alunos, turmas };
    }

    // Carregar os dados do localStorage
    var { alunos, turmas } = carregarDados();

    // Função para preencher o campo de seleção de turmas
    function preencherSelectTurmas(turmas) {
        var turmaSelect = $('#serie');
        turmaSelect.empty();
        turmaSelect.append('<option value="">Selecione a Turma</option>');
        turmas.forEach(function(turma) {
            turmaSelect.append(`<option value="${turma.id}">${turma.nome}</option>`);
        });
    }

    // Função para preencher a tabela com alunos existentes
    function preencherTabelaAlunos(alunos) {
        var tbody = $('#alunos');
        tbody.empty();
        alunos.forEach(function(aluno) {
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

    // Preencher o campo de seleção e a tabela ao carregar os dados
    preencherSelectTurmas(turmas);
    preencherTabelaAlunos(alunos);

    // Manipulador do botão Salvar (Adicionar ou Editar aluno)
    $('#salvarAluno').click(function() {
        var nome = $('#nome').val();
        var idade = $('#idade').val();
        var email = $('#email').val();
        var cpf = $('#cpf').val();
        var rg = $('#rg').val();
        var turmaId = $('#serie').val();
        var responsavelNome = $('#responsavel_nome').val();
        var responsavelCpf = $('#responsavel_cpf').val();
        var responsavelRg = $('#responsavel_rg').val();
        var responsavelTelefone = $('#responsavel_telefone').val();
        var responsavelEmail = $('#responsavel_email').val();

        var selectedTurma = turmas.find(t => t.id == turmaId);

        if (!selectedTurma) {
            alert('Turma não encontrada');
            return;
        }

        var novoAluno = {
            id: alunos.length + 1,
            nome: nome,
            idade: idade,
            email: email,
            cpf: cpf,
            rg: rg,
            turmaId: selectedTurma.id, // Salva o ID da turma
            turma: selectedTurma.nome, // Nome da turma para exibição
            responsavel: {
                nome: responsavelNome,
                cpf: responsavelCpf,
                rg: responsavelRg,
                telefone: responsavelTelefone,
                email: responsavelEmail
            }
        };

        alunos.push(novoAluno);
        localStorage.setItem('alunos', JSON.stringify(alunos));

        // Atualizar a tabela
        preencherTabelaAlunos(alunos);

        // Fechar o modal
        $('#cadastroModal').modal('hide');
    });

    // Manipulador do botão Excluir
    $(document).on('click', '.excluir', function() {
        var id = $(this).data('id');
        alunos = alunos.filter(aluno => aluno.id !== id); // Remove o aluno
        localStorage.setItem('alunos', JSON.stringify(alunos)); // Atualiza o localStorage
        preencherTabelaAlunos(alunos); // Atualiza a tabela
    });

    // Manipulador do botão Editar
    $(document).on('click', '.editar', function() {
        var id = $(this).data('id');
        var aluno = alunos.find(a => a.id === id);

        $('#nome').val(aluno.nome);
        $('#idade').val(aluno.idade);
        $('#email').val(aluno.email);
        $('#cpf').val(aluno.cpf);
        $('#rg').val(aluno.rg);
        $('#serie').val(aluno.turmaId); // Agora estamos utilizando o ID da turma
        $('#responsavel_nome').val(aluno.responsavel.nome);
        $('#responsavel_cpf').val(aluno.responsavel.cpf);
        $('#responsavel_rg').val(aluno.responsavel.rg);
        $('#responsavel_telefone').val(aluno.responsavel.telefone);
        $('#responsavel_email').val(aluno.responsavel.email);

        $('#cadastroModal').modal('show');

        // Atualizar o botão Salvar para Atualizar
        $('#salvarAluno').off('click').click(function() {
            aluno.nome = $('#nome').val();
            aluno.idade = $('#idade').val();
            aluno.email = $('#email').val();
            aluno.cpf = $('#cpf').val();
            aluno.rg = $('#rg').val();
            aluno.turmaId = $('#serie').val(); // Agora estamos atualizando o ID da turma
            aluno.turma = turmas.find(t => t.id == aluno.turmaId).nome; // Atualiza o nome da turma
            aluno.responsavel.nome = $('#responsavel_nome').val();
            aluno.responsavel.cpf = $('#responsavel_cpf').val();
            aluno.responsavel.rg = $('#responsavel_rg').val();
            aluno.responsavel.telefone = $('#responsavel_telefone').val();
            aluno.responsavel.email = $('#responsavel_email').val();

            localStorage.setItem('alunos', JSON.stringify(alunos));
            preencherTabelaAlunos(alunos);
            $('#cadastroModal').modal('hide');
        });
    });
});
