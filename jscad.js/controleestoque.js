
  function gerarRelatorioPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Começar a adicionar as compras ao relatório
    const compras = JSON.parse(localStorage.getItem('compras')) || [];
    if (compras.length === 0) {
      alert("Nenhuma compra registrada para gerar relatório.");
      return;
    }

    // Adicionar título e cabeçalho de compras
    doc.setFontSize(18);
    doc.text("Relatório de Compras e Baixas de Materiais", 20, 20);

    doc.setFontSize(14);
    doc.text("Compras:", 20, 30);

    doc.setFontSize(12);
    doc.text("Material | Quantidade | Fornecedor | Data | Valor", 20, 40);
    doc.setLineWidth(0.7);
    doc.line(20, 42, 190, 42); // Linha abaixo do cabeçalho de compras

    let yPosition = 45;
    compras.forEach(function(compra, index) {
      doc.text(
        `${compra.material} | ${compra.quantidade} | ${compra.fornecedor} | ${compra.data} | R$ ${compra.valor.toFixed(2)}`,
        20,
        yPosition
      );
      yPosition += 10;
    });

    // Adicionar o total de compras
    const totalCompras = compras.reduce(function(acc, compra) {
      return acc + compra.valor;
    }, 0);
    doc.setFontSize(14);
    doc.text(`Total de Compras: R$ ${totalCompras.toFixed(2)}`, 20, yPosition + 10);
    yPosition += 20;

    // Começar a adicionar as baixas ao relatório
    const baixas = JSON.parse(localStorage.getItem('baixas')) || [];
    if (baixas.length > 0) {
      doc.setFontSize(14);
      doc.text("Baixas:", 20, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.text("Material | Quantidade | Motivo | Data", 20, yPosition);
      doc.setLineWidth(0.7);
      doc.line(20, yPosition + 2, 190, yPosition + 2); // Linha abaixo do cabeçalho de baixas

      yPosition += 10;
      baixas.forEach(function(baixa, index) {
        doc.text(
          `${baixa.material} | ${baixa.quantidade} | ${baixa.motivo} | ${baixa.data}`,
          20,
          yPosition
        );
        yPosition += 10;
      });

      // Adicionar o total de baixas
      const totalBaixas = baixas.reduce(function(acc, baixa) {
        return acc + baixa.quantidade;
      }, 0);
      doc.setFontSize(14);
      doc.text(`Total de Baixas: ${totalBaixas} unidades`, 20, yPosition + 10);
    }

    // Gerar o PDF
    doc.save('relatorio_compras_baixas.pdf');
  }

  // Função para dar baixa no estoque
  function darBaixa(index) {
    const estoque = JSON.parse(localStorage.getItem('estoque')) || [];
    const material = estoque[index];

    // Pergunta a quantidade a ser dada baixa e motivo
    const quantidadeBaixa = prompt(`Informe a quantidade a ser dada baixa para o material "${material.nome}" (Disponível: ${material.quantidade}):`);
    const motivo = prompt("Informe o motivo da baixa:");

    if (quantidadeBaixa && !isNaN(quantidadeBaixa) && quantidadeBaixa <= material.quantidade && motivo) {
      material.quantidade -= parseInt(quantidadeBaixa);

      // Adiciona a baixa ao histórico de baixas
      const baixas = JSON.parse(localStorage.getItem('baixas')) || [];
      const novaBaixa = {
        material: material,
        quantidade: parseInt(quantidadeBaixa),
        motivo: motivo,
        data: new Date().toLocaleDateString()
      };
      baixas.push(novaBaixa);
      localStorage.setItem('baixas', JSON.stringify(baixas));

      // Atualiza o estoque no localStorage
      localStorage.setItem('estoque', JSON.stringify(estoque));

      // Atualiza a tabela de estoque e baixas
      exibirEstoque();
    } else {
      alert('Quantidade ou motivo inválido!');
    }
  }

  // Função para exibir os materiais do estoque na tabela
  function exibirEstoque() {
    const estoque = JSON.parse(localStorage.getItem('estoque')) || [];
    const estoqueTable = document.getElementById('estoque');

    // Limpa a tabela antes de exibir novamente
    estoqueTable.innerHTML = '';

    estoque.forEach((material, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${material.material}</td>
        <td>${material.quantidade}</td>
        <td>
          <button class="btn btn-warning" onclick="darBaixa(${index})">Dar Baixa</button>
        </td>
      `;
      estoqueTable.appendChild(row);
    });
  }

  // Atualiza a tabela quando a página carrega
  window.onload = function() {
    exibirEstoque();

    // Adiciona evento de salvar material
    document.getElementById('salvarMaterial').addEventListener('click', salvarMaterial);
  };

