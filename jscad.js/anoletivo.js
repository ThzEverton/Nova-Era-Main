$(document).ready(function() {
    var anosLetivos = JSON.parse(localStorage.getItem('anosLetivos')) || [];

    // Função para atualizar a tabela de anos letivos
    function atualizarTabela() {
      const tableBody = $('#anoLetivos');
      tableBody.empty();
      anosLetivos.forEach(function(anoLetivo, index) {
        const row = `
          <tr>
            <th scope="row">${anoLetivo.id}</th>
            <td>${anoLetivo.ano}</td>
            <td>${anoLetivo.descricao}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="editarAnoLetivo(${anoLetivo.id})">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="excluirAnoLetivo(${anoLetivo.id})">Excluir</button>
            </td>
          </tr>
        `;
        tableBody.append(row);
      });
    }

    // Adicionar novo ano letivo
    $('#salvarAnoLetivo').on('click', function() {
      const novoAnoLetivo = {
        id: anosLetivos.length ? anosLetivos[anosLetivos.length - 1].id + 1 : 1,
        ano: $('#ano').val(),
        descricao: $('#descricao').val()
      };

      anosLetivos.push(novoAnoLetivo);
      localStorage.setItem('anosLetivos', JSON.stringify(anosLetivos));
      atualizarTabela();
      $('#cadastroForm')[0].reset();
      $('#cadastroModal').modal('hide');
    });

    // Editar ano letivo
    window.editarAnoLetivo = function(id) {
      const anoLetivo = anosLetivos.find(ano => ano.id === id);
      if (anoLetivo) {
        $('#ano').val(anoLetivo.ano);
        $('#descricao').val(anoLetivo.descricao);
        $('#salvarAnoLetivo').off('click').on('click', function() {
          anoLetivo.ano = $('#ano').val();
          anoLetivo.descricao = $('#descricao').val();
          localStorage.setItem('anosLetivos', JSON.stringify(anosLetivos));
          atualizarTabela();
          $('#cadastroForm')[0].reset();
          $('#cadastroModal').modal('hide');
        });
        $('#cadastroModal').modal('show');
      }
    };

    // Excluir ano letivo
    window.excluirAnoLetivo = function(id) {
      anosLetivos = anosLetivos.filter(ano => ano.id !== id);
      localStorage.setItem('anosLetivos', JSON.stringify(anosLetivos));
      atualizarTabela();
    };

    // Pesquisar ano letivo
    $('#pesquisar').on('keyup', function() {
      const valor = $(this).val().toLowerCase();
      $('#anoLetivos tr').each(function() {
        const ano = $(this).find('td').eq(0).text().toLowerCase();
        $(this).toggle(ano.includes(valor));
      });
    });

    // Inicializa a tabela
    atualizarTabela();
  });