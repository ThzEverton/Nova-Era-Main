$(document).ready(function() {
    // Dados simulados dos anos letivos
    var anosLetivos = [
        { id: 1, ano: '2024', descricao: 'Ano letivo de 2024' },
        { id: 2, ano: '2025', descricao: 'Ano letivo de 2025' }
    ];

    var series = JSON.parse(localStorage.getItem('series')) || [];

    // Atualizar o dropdown de anos letivos
    anosLetivos.forEach(function(anoLetivo) {
        $('#anoLetivo').append(`<option value="${anoLetivo.id}">${anoLetivo.ano} (${anoLetivo.descricao})</option>`);
    });

    // Função para atualizar a tabela de séries
    function atualizarTabela() {
        const tableBody = $('#series');
        tableBody.empty();
        series.forEach(function(serie) {
            const anoLetivo = anosLetivos.find(al => al.id === serie.anoLetivo);
            const row = `
                <tr>
                    <th scope="row">${serie.id}</th>
                    <td>${serie.nome}</td>
                    <td>${serie.descricao}</td>
                    <td>${anoLetivo ? anoLetivo.ano : 'Desconhecido'}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarSerie(${serie.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="excluirSerie(${serie.id})">Excluir</button>
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });
    }

    // Adicionar nova série
    $('#salvarSerie').on('click', function() {
        const novaSerie = {
            id: series.length ? series[series.length - 1].id + 1 : 1,
            nome: $('#nome').val(),
            descricao: $('#descricao').val(),
            anoLetivo: parseInt($('#anoLetivo').val())
        };

        series.push(novaSerie);
        localStorage.setItem('series', JSON.stringify(series));
        atualizarTabela();
        $('#cadastroForm')[0].reset();
        $('#cadastroModal').modal('hide');
    });

    // Editar série
    window.editarSerie = function(id) {
        const serie = series.find(serie => serie.id === id);
        if (serie) {
            $('#nome').val(serie.nome);
            $('#descricao').val(serie.descricao);
            $('#anoLetivo').val(serie.anoLetivo);
            $('#salvarSerie').off('click').on('click', function() {
                serie.nome = $('#nome').val();
                serie.descricao = $('#descricao').val();
                serie.anoLetivo = parseInt($('#anoLetivo').val());
                localStorage.setItem('series', JSON.stringify(series));
                atualizarTabela();
                $('#cadastroForm')[0].reset();
                $('#cadastroModal').modal('hide');
            });
            $('#cadastroModal').modal('show');
        }
    };

    // Excluir série
    window.excluirSerie = function(id) {
        series = series.filter(serie => serie.id !== id);
        localStorage.setItem('series', JSON.stringify(series));
        atualizarTabela();
    };

    // Pesquisar série
    $('#pesquisar').on('keyup', function() {
        const valor = $(this).val().toLowerCase();
        $('#series tr').each(function() {
            const nome = $(this).find('td').eq(0).text().toLowerCase();
            $(this).toggle(nome.includes(valor));
        });
    });

    // Inicializa a tabela
    atualizarTabela();
});
