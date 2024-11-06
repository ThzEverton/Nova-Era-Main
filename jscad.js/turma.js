$(document).ready(function() {
    // Função para carregar os dados do localStorage
    function carregarDados() {
        var turmas = JSON.parse(localStorage.getItem('turmas')) || [];
        var series = JSON.parse(localStorage.getItem('series')) || [];
        var anosLetivos = JSON.parse(localStorage.getItem('anosLetivos')) || [];
        var professores = JSON.parse(localStorage.getItem('professores')) || [];

        return { turmas, series, anosLetivos, professores };
    }

    // Função para preencher os campos de seleção
    function preencherSelects(series, anosLetivos, professores) {
        var serieSelect = $('#serie');
        var anoLetivoSelect = $('#anoLetivo');
        var professorSelect = $('#professor');

        series.forEach(function(serie) {
            serieSelect.append(`<option value="${serie.id}">${serie.nome}</option>`);
        });

        anosLetivos.forEach(function(ano) {
            anoLetivoSelect.append(`<option value="${ano.id}">${ano.ano}</option>`);
        });

        professores.forEach(function(professor) {
            professorSelect.append(`<option value="${professor.id}">${professor.nome}</option>`);
        });
    }

    // Função para preencher a tabela com turmas existentes
    function preencherTabela(turmas) {
        var tbody = $('#turmas');
        tbody.empty();
        turmas.forEach(function(turma) {
            tbody.append(
                `<tr>
                    <th scope="row">${turma.id}</th>
                    <td>${turma.nome}</td>
                    <td>${turma.serie}</td>
                    <td>${turma.anoLetivo}</td>
                    <td>${turma.professor.nome}</td>
                    <td>${turma.descricao}</td>
                    <td>
                        <button class="btn btn-info btn-sm editar" data-id="${turma.id}">Editar</button>
                        <button class="btn btn-danger btn-sm excluir" data-id="${turma.id}">Excluir</button>
                    </td>
                </tr>`
            );
        });
    }

    // Carregar os dados do localStorage
    var { turmas, series, anosLetivos, professores } = carregarDados();

    // Preencher os campos de seleção e a tabela
    preencherSelects(series, anosLetivos, professores);
    preencherTabela(turmas);

    // Manipulador do botão Salvar
$('#salvarTurma').click(function() {
    var nome = $('#nome').val();
    var serieId = $('#serie').val();
    var anoLetivoId = $('#anoLetivo').val();
    var professorId = $('#professor').val();
    var descricao = $('#descricao').val();

    var selectedSerie = series.find(s => s.id == serieId);
    var selectedAnoLetivo = anosLetivos.find(a => a.id == anoLetivoId);
    var selectedProfessor = professores.find(p => p.id == professorId);

    var novaTurma = {
        id: turmas.length + 1,
        nome: nome,
        serie: selectedSerie ? selectedSerie.nome : 'Série não encontrada',
        anoLetivo: selectedAnoLetivo ? selectedAnoLetivo.ano : 'Ano Letivo não encontrado',
        professor: selectedProfessor ? selectedProfessor.nome : 'Professor não encontrado',
        descricao: descricao
    };

    turmas.push(novaTurma);
    localStorage.setItem('turmas', JSON.stringify(turmas));
    preencherTabela(turmas);
    $('#cadastroModal').modal('hide');
});

    // Manipulador do botão Excluir
    $(document).on('click', '.excluir', function() {
        var id = $(this).data('id');
        turmas = turmas.filter(turma => turma.id !== id);
        localStorage.setItem('turmas', JSON.stringify(turmas));
        preencherTabela(turmas);
    });

    // Manipulador do botão Editar
    $(document).on('click', '.editar', function() {
        var id = $(this).data('id');
        var turma = turmas.find(t => t.id === id);

        if (turma) {
            $('#nome').val(turma.nome);
            $('#serie').val(series.find(s => s.nome === turma.serie)?.id || '');
            $('#anoLetivo').val(anosLetivos.find(a => a.ano === turma.anoLetivo)?.id || '');
            $('#professor').val(professores.find(p => p.nome === turma.professor)?.id || '');
            $('#descricao').val(turma.descricao);

            $('#cadastroModal').modal('show');

            // Atualizar o botão Salvar para Atualizar
            $('#salvarTurma').off('click').click(function() {
                turma.nome = $('#nome').val();
                turma.serie = series.find(s => s.id == $('#serie').val())?.nome || 'Série não encontrada';
                turma.anoLetivo = anosLetivos.find(a => a.id == $('#anoLetivo').val())?.ano || 'Ano Letivo não encontrado';
                turma.professor = professores.find(p => p.id == $('#professor').val())?.nome || 'Professor não encontrado';
                turma.descricao = $('#descricao').val();

                localStorage.setItem('turmas', JSON.stringify(turmas));
                preencherTabela(turmas);
                $('#cadastroModal').modal('hide');
            });
        }
    });
});
