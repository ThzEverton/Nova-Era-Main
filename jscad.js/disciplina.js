document.addEventListener('DOMContentLoaded', function() {
  const cadastroForm = document.getElementById('cadastroForm');
  const salvarDisciplinaBtn = document.getElementById('salvarDisciplina');
  const tableBody = document.getElementById('disciplinas');

  // Carregar disciplinas do localStorage
  let disciplinas = JSON.parse(localStorage.getItem('disciplinas')) || [];
  let indexEditando = null; // Variável para armazenar o índice da disciplina que está sendo editada
  atualizarTabela();

  if (salvarDisciplinaBtn) {
    salvarDisciplinaBtn.addEventListener('click', function() {
      if (validarFormulario()) {
        const disciplina = {
          nome: document.getElementById('nome').value,
          codigo: document.getElementById('codigo').value,
          descricao: document.getElementById('descricao').value,
        };

        if (indexEditando !== null) {
          // Atualizar a disciplina existente
          disciplinas[indexEditando] = disciplina;
        } else {
          // Adicionar nova disciplina
          disciplinas.push(disciplina);
        }

        localStorage.setItem('disciplinas', JSON.stringify(disciplinas));
        atualizarTabela();
        cadastroForm.reset();
        $('#cadastroModal').modal('hide');

        // Resetar o índice de edição
        indexEditando = null;
      }
    });
  }

  function validarFormulario() {
    const nome = document.getElementById('nome').value;
    const codigo = document.getElementById('codigo').value;
    const descricao = document.getElementById('descricao').value;

    if (!nome || !codigo || !descricao) {
      alert('Por favor, preencha todos os campos.');
      return false;
    }
    return true;
  }

  function atualizarTabela() {
    tableBody.innerHTML = '';
    disciplinas.forEach((disciplina, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${disciplina.nome}</td>
        <td>${disciplina.codigo}</td>
        <td>${disciplina.descricao}</td>
        <td>
          <button class="btn btn-warning btn-editar" data-index="${index}">Editar</button>
          <button class="btn btn-danger btn-excluir" data-index="${index}">Excluir</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Adicionar eventos aos botões
    document.querySelectorAll('.btn-editar').forEach(button => {
      button.addEventListener('click', editarDisciplina);
    });

    document.querySelectorAll('.btn-excluir').forEach(button => {
      button.addEventListener('click', excluirDisciplina);
    });
  }

  function editarDisciplina(event) {
    const index = event.target.dataset.index;
    const disciplina = disciplinas[index];

    // Preencher formulário com os dados da disciplina
    document.getElementById('nome').value = disciplina.nome;
    document.getElementById('codigo').value = disciplina.codigo;
    document.getElementById('descricao').value = disciplina.descricao;

    // Definir o índice da disciplina sendo editada
    indexEditando = index;

    // Abrir modal
    $('#cadastroModal').modal('show');
  }

  function excluirDisciplina(event) {
    const index = event.target.dataset.index;
    if (confirm('Tem certeza que deseja excluir esta disciplina?')) {
      disciplinas.splice(index, 1);
      localStorage.setItem('disciplinas', JSON.stringify(disciplinas));
      atualizarTabela();
    }
  }
});
