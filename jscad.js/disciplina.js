document.addEventListener('DOMContentLoaded', function() {
    const cadastroForm = document.getElementById('cadastroForm');
    const salvarDisciplinaBtn = document.getElementById('salvarDisciplina');
    const tableBody = document.getElementById('disciplinas');

    // Carregar disciplinas do localStorage
    const disciplinas = JSON.parse(localStorage.getItem('disciplinas')) || [];
    atualizarTabela();

    if (salvarDisciplinaBtn) {
      salvarDisciplinaBtn.addEventListener('click', function() {
        if (validarFormulario()) {
          const disciplina = {
            nome: document.getElementById('nome').value,
            codigo: document.getElementById('codigo').value,
            descricao: document.getElementById('descricao').value
          };
          disciplinas.push(disciplina);
          localStorage.setItem('disciplinas', JSON.stringify(disciplinas));
          adicionarDisciplinaTabela(disciplina);
          cadastroForm.reset();
          $('#cadastroModal').modal('hide');
        }
      });
    }

    function validarFormulario() {
      console.log('Validando formulário.');
      const nome = document.getElementById('nome').value;
      const codigo = document.getElementById('codigo').value;
      const descricao = document.getElementById('descricao').value;
  
      if (!nome || !codigo || !descricao) {
        alert('Por favor, preencha todos os campos.');
        return false;
      }
      return true;
    }

    function adicionarDisciplinaTabela(disciplina) {
      console.log('Adicionando disciplina:', disciplina);
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>#</td>
        <td>${disciplina.nome}</td>
        <td>${disciplina.codigo}</td>
        <td>${disciplina.descricao}</td>
        <td><button class="btn btn-warning">Editar</button> <button class="btn btn-danger">Excluir</button></td>
      `;
      tableBody.appendChild(row);
    }

    function atualizarTabela() {
      tableBody.innerHTML = '';
      disciplinas.forEach(disciplina => {
        adicionarDisciplinaTabela(disciplina);
      });
    }
  });