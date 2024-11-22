// Função genérica para aplicar máscara
function aplicarMascara(input, mascara) {
    input.addEventListener("input", () => {
      let valor = input.value.replace(/\D/g, ""); // Remove caracteres não numéricos
      let resultado = "";
  
      let i = 0;
      for (let m of mascara) {
        if (m === "#") {
          if (valor[i]) {
            resultado += valor[i++];
          } else {
            break;
          }
        } else {
          resultado += m;
        }
      }
      input.value = resultado;
    });
  }
  
  // Bloquear letras no campo de idade
  function bloquearLetras(input) {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    });
  }
  
  // Bloquear números no campo de nome
  function bloquearNumeros(input) {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[0-9]/g, ""); // Remove números
    });
  }
  
  // Inicializa máscaras e validações ao carregar a página
  document.addEventListener("DOMContentLoaded", () => {
    // Aplicar máscara para CPF
    const cpfInput = document.getElementById("cpf");
    if (cpfInput) aplicarMascara(cpfInput, "###.###.###-##");

    const cpfInputresp = document.getElementById("responsavel_cpf");
    if (cpfInputresp) aplicarMascara(cpfInputresp, "###.###.###-##");
  
    
    // Aplicar máscara para RG
    const rgInput = document.getElementById("rg");
    if (rgInput) aplicarMascara(rgInput, "##.###.###-#");
    const rgInputresp = document.getElementById("responsavel_rg");
    if (rgInputresp) aplicarMascara(rgInputresp, "##.###.###-#");



    // Aplicar máscara para Telefone
    const telefoneInput = document.getElementById("telefone");
    if (telefoneInput) aplicarMascara(telefoneInput, "(##) #####-####");
    // Aplicar máscara para Telefone
    const telefoneInputresp = document.getElementById("responsavel_telefone");
    if (telefoneInputresp) aplicarMascara(telefoneInputresp, "(##) #####-####");


  
    // Bloquear letras no campo de idade
    const idadeInput = document.getElementById("idade");
    if (idadeInput) bloquearLetras(idadeInput);
  
    // Bloquear números no campo de nome
    const nomeInput = document.getElementById("nome");
    if (nomeInput) bloquearNumeros(nomeInput);
    const nomeInputresp = document.getElementById("responsavel_nome");
    if (nomeInputresp) bloquearNumeros(nomeInputresp);
  });
  