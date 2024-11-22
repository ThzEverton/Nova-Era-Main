document.addEventListener('DOMContentLoaded', function () {
    // Função para salvar a compra
    document.getElementById('salvarCompra').addEventListener('click', function () {
      var material = document.getElementById('material').value;
      var quantidade = document.getElementById('quantidade').value;
      var fornecedor = document.getElementById('fornecedor').value;
      var data = document.getElementById('data').value;
      var valor = document.getElementById('valor').value;
  
      var compra = {
        material: material,
        quantidade: quantidade,
        fornecedor: fornecedor,
        data: data,
        valor: parseFloat(valor),
        selecionado: false
      };
  
      var compras = JSON.parse(localStorage.getItem('compras')) || [];
      compras.push(compra);
  
      localStorage.setItem('compras', JSON.stringify(compras));
      atualizarTabela();
      $('#cadastroModal').modal('hide');
    });
  
    // Função para atualizar a tabela de compras
    function atualizarTabela() {
      var compras = JSON.parse(localStorage.getItem('compras')) || [];
      var tabelaCompras = document.getElementById('compras');
      tabelaCompras.innerHTML = '';
  
      compras.forEach(function (compra, index) {
        var row = tabelaCompras.insertRow();
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${compra.material}</td>
          <td>${compra.quantidade}</td>
          <td>${compra.fornecedor}</td>
          <td>${compra.data}</td>
          <td>${compra.valor.toFixed(2)}</td>
          <td><input type="checkbox" onclick="selecionarCompra(${index})" ${compra.selecionado ? 'checked' : ''}></td>
          <td><button class="btn btn-danger" onclick="removerCompra(${index})">Remover</button></td>
        `;
      });
    }
  
    // Função para selecionar ou desmarcar uma compra
    window.selecionarCompra = function (index) {
      var compras = JSON.parse(localStorage.getItem('compras')) || [];
      compras[index].selecionado = !compras[index].selecionado;
      localStorage.setItem('compras', JSON.stringify(compras));
    }
  
    // Função para remover uma compra
    window.removerCompra = function (index) {
      var compras = JSON.parse(localStorage.getItem('compras')) || [];
      compras.splice(index, 1);
      localStorage.setItem('compras', JSON.stringify(compras));
      atualizarTabela();
    }
  
    // Função para gerar o relatório em PDF
    window.gerarRelatorioPDF = function () {
      var compras = JSON.parse(localStorage.getItem('compras')) || [];
      var comprasSelecionadas = compras.filter(function (compra) {
        return compra.selecionado;
      });
  
      if (comprasSelecionadas.length === 0) {
        alert("Nenhuma compra selecionada para o relatório.");
        return;
      }
  
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
  
      // Título do Relatório
      doc.setFontSize(18);
      doc.text("Relatório de Compras de Material", 20, 20);
  
      // Adicionar Cabeçalho
      doc.setFontSize(12);
      doc.text("Material | Quantidade | Fornecedor | Data | Valor", 20, 30);
      doc.setLineWidth(0.5);
      doc.line(20, 32, 190, 32); // Linha abaixo do cabeçalho
  
      // Adicionar as compras selecionadas no PDF
      var yPosition = 35;
      comprasSelecionadas.forEach(function (compra, index) {
        doc.text(
          `${compra.material} | ${compra.quantidade} | ${compra.fornecedor} | ${compra.data} | R$ ${compra.valor.toFixed(2)}`,
          20,
          yPosition
        );
        yPosition += 10;
      });
  
      // Adicionar o total no final do relatório
      var total = comprasSelecionadas.reduce(function (acc, compra) {
        return acc + compra.valor;
      }, 0);
      doc.setFontSize(14);
      doc.text(`Total: R$ ${total.toFixed(2)}`, 20, yPosition + 10);
  
      // Gerar o PDF
      doc.save('relatorio_compras_material.pdf');
    }
  
    // Inicializar a tabela de compras
    atualizarTabela();
  });
  