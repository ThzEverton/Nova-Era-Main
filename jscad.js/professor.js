$(document).ready(function() {
    // Simular matérias cadastradas
    var materias = JSON.parse(localStorage.getItem('disciplinas')) || [];
    var professores = JSON.parse(localStorage.getItem('professores')) || [];

    // Carregar matérias no select
    if (materias.length === 0) {
      $('#alertMateria').show();
    } else {
      $('#alertMateria').hide();
      materias.forEach(function(materia) {
        $('#materias').append(new Option(materia.nome, materia.codigo));
      });
    }

    // Atualizar tabela de professores
    function atualizarTabela() {
      const tableBody = $('#professores');
      tableBody.empty();
      professores.forEach(function(professor, index) {
        const row = `
          <tr>
            <td>${index + 1}</td>
            <td>${professor.nome}</td>
            <td>${professor.especialidade}</td>
            <td>${professor.email}</td>
            <td><button class="btn btn-warning">Editar</button> <button class="btn btn-danger">Excluir</button></td>
          </tr>
        `;
        tableBody.append(row);
      });
    }

    atualizarTabela();

    // Salvar novo professor
    $('#salvarProfessor').click(function() {
      const nome = $('#nome').val();
      const especialidade = $('#especialidade').val();
      const email = $('#email').val();
      const materiasSelecionadas = $('#materias').val();

      if (!nome || !especialidade || !email || materiasSelecionadas.length === 0) {
        alert('Por favor, preencha todos os campos e selecione pelo menos uma matéria.');
        return;
      }

      const novoProfessor = {
        nome: nome,
        especialidade: especialidade,
        email: email,
        materias: materiasSelecionadas
      };

      professores.push(novoProfessor);
      localStorage.setItem('professores', JSON.stringify(professores));
      atualizarTabela();
      $('#cadastroForm')[0].reset();
      $('#cadastroModal').modal('hide');
    });
  });