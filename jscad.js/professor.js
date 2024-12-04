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
                  <td>
                      <button class="btn btn-warning btn-editar" data-index="${index}">Editar</button>
                      <button class="btn btn-danger btn-excluir" data-index="${index}">Excluir</button>
                  </td>
              </tr>
          `;
          tableBody.append(row);
      });

      // Adicionar eventos para os botões de editar e excluir
      $('.btn-editar').click(function() {
          const index = $(this).data('index');
          editarProfessor(index);
      });

      $('.btn-excluir').click(function() {
          const index = $(this).data('index');
          excluirProfessor(index);
      });
  }

  atualizarTabela();

  // Salvar ou editar professor
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

      // Verificar se está editando ou criando um novo professor
      const index = $(this).data('index');  // Recuperar o índice do professor (para edição)
      
      if (index === undefined) {
          // Adicionar novo professor
          professores.push(novoProfessor);
      } else {
          // Editar professor existente
          professores[index] = novoProfessor;
          $(this).removeData('index');  // Limpar o índice após edição
      }

      localStorage.setItem('professores', JSON.stringify(professores));
      atualizarTabela();
      $('#cadastroForm')[0].reset();
      $('#cadastroModal').modal('hide');
  });

  // Função para editar professor
  function editarProfessor(index) {
      const professor = professores[index];
      $('#nome').val(professor.nome);
      $('#especialidade').val(professor.especialidade);
      $('#email').val(professor.email);
      $('#materias').val(professor.materias); // Selecione as matérias associadas ao professor

      // Definir o índice do professor sendo editado
      $('#salvarProfessor').data('index', index); // Armazenar índice para salvar a edição
      $('#cadastroModal').modal('show');
  }

  // Função para excluir professor
  function excluirProfessor(index) {
      if (confirm('Tem certeza que deseja excluir este professor?')) {
          professores.splice(index, 1);
          localStorage.setItem('professores', JSON.stringify(professores));
          atualizarTabela();
      }
  }
});
