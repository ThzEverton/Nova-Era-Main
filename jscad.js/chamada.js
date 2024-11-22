$(document).ready(function () {
    // Função para carregar os dados dos alunos (ajustar conforme necessário)
    function carregarAlunos(turmaId) {
        // Exemplo: Carregar alunos do localStorage ou outra fonte
        var alunos = JSON.parse(localStorage.getItem('alunos')) || [];

        // Filtrar os alunos pela turma selecionada
        return alunos.filter(aluno => aluno.turmaId === turmaId);
    }

    // Preencher a tabela com os alunos
    function preencherTabelaAlunos(alunos) {
        var tbody = $('#listaAlunos');
        tbody.empty();

        if (alunos.length === 0) {
            tbody.append('<tr><td colspan="3">Nenhum aluno encontrado para esta turma.</td></tr>');
            return;
        }

        alunos.forEach((aluno, index) => {
            tbody.append(`
                <tr>
                    <td>${index + 1}</td>
                    <td>${aluno.nome}</td>
                    <td>
                        <input type="checkbox" class="presenca-checkbox" data-id="${aluno.id}">
                        <span class="presenca-label">Presente</span>
                    </td>
                </tr>
            `);
        });

        // Adicionar evento ao checkbox para alternar entre Presente e Falta
        $('.presenca-checkbox').change(function () {
            var isChecked = $(this).is(':checked');
            var label = $(this).next('.presenca-label');
            if (isChecked) {
                label.text('Presente').removeClass('falta').addClass('presenca');
            } else {
                label.text('Falta').removeClass('presenca').addClass('falta');
            }
        });
    }

    // Evento para carregar a lista de alunos
    $('#carregarLista').click(function () {
        var turmaId = $('#turma').val();
        if (!turmaId) {
            alert('Selecione uma turma primeiro!');
            return;
        }

        var alunos = carregarAlunos(parseInt(turmaId));
        preencherTabelaAlunos(alunos);

        // Mostrar a tabela
        $('#tabelaChamada').show();
    });

    // Função para carregar turmas no dropdown
    function carregarTurmas() {
        var turmas = JSON.parse(localStorage.getItem('turmas')) || [];
        var turmaSelect = $('#turma');
        turmaSelect.empty();
        turmaSelect.append('<option value="">Selecione a Turma</option>');
        turmas.forEach(turma => {
            turmaSelect.append(`<option value="${turma.id}">${turma.nome}</option>`);
        });
    }

    // Inicializar a página carregando as turmas
    carregarTurmas();
});
