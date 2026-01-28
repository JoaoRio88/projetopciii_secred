// $(document).ready(function () {
//   $("th").click(function () {
//     const table = $(this).closest("table"); // Encontra a tabela
//     const index = $(this).index(); // Encontra a coluna
//     const rows = table
//       .find("tbody tr")
//       .toArray() // Encontra todas as linhas e transforma em Array
//       .sort((a, b) => {
//         const valA = $(a).children("td").eq(index).text();
//         const valB = $(b).children("td").eq(index).text();
//         // Compara números/texto
//         return $.isNumeric(valA) && $.isNumeric(valB)
//           ? valA - valB // Se números subtrai e descobre o maior
//           : valA.localeCompare(valB); // Se texto compara alfabeticamente
//       });
//     this.asc = !this.asc; // Inverte a ordem
//     if (!this.asc) rows.reverse();
//     table.children("tbody").append(rows); // Atualiza e reposiciona os elementos na tabela
//   });
//   aplicarPaginacao();
// });

// function aplicarPaginacao() {
//   const linhasPorPagina = 5;
//   const $corpoTabela = $(".table-policia tbody");
//   const $linhas = $corpoTabela.find("tr");
//   const totalPaginas = Math.ceil($linhas.length / linhasPorPagina);

//   // 1. Limpar botões antigos e o contentor
//   $("#paginacao").empty();

//   // Se houver apenas uma página ou nenhuma, não mostra botões e sai
//   if (totalPaginas <= 1) {
//     $linhas.show();
//     return;
//   }

//   function mostrarPagina(num) {
//     $linhas.hide(); //Esconde todas as linhas
//     const inicio = (num - 1) * linhasPorPagina; //Calcula o índice inicial
//     const fim = inicio + linhasPorPagina; //Calcula o índice final
//     $linhas.slice(inicio, fim).fadeIn(200); //Mostra as linhas da página atual com efeito fadeIn

//     // Estilo visual dos botões
//     $(".btn-pag").css({
//       background: "#fff",
//       color: "#000",
//       border: "1px solid #ddd",
//     });
//     $(`.btn-pag[data-page="${num}"]`).css({
//       background: "#3b82f6",
//       color: "#fff",
//       border: "1px solid #3b82f6",
//     });
//   }

//   // 2. Criar botões no contentor correto
//   for (let i = 1; i <= totalPaginas; i++) {
//     $("<button>")
//       .text(i)
//       .attr("data-page", i)
//       .addClass("btn-pag")
//       .css({ padding: "8px 15px", "border-radius": "4px", cursor: "pointer" })
//       .click(function () {
//         mostrarPagina(i);
//       })
//       .appendTo("#paginacao"); // Agora usa o ID correto
//   }

//   mostrarPagina(1); //Sempre a primeira página ao iniciar
// }
$(document).ready(function () {
  $("th").click(function () {
    const table = $(".table-policia"); // Seleciona a tabela
    const index = $(this).index();

    // Guarda a ordem atual (ascendente ou descendente)
    this.asc = !this.asc;

    const rows = table
      .find("tbody tr") //Para todas as linhas do corpo da tabela
      .toArray() //Converte para array (para comparar)
      .sort((a, b) => {
        const valA = $(a).children("td").eq(index).text().toUpperCase();
        const valB = $(b).children("td").eq(index).text().toUpperCase();

        //Compara os valores (números ou texto)
        return $.isNumeric(valA) && $.isNumeric(valB)
          ? valA - valB // Números: subtrai
          : valA.localeCompare(valB); // Texto: compara alfabeticamente
      });

    if (!this.asc) rows.reverse(); // Inverte a ordem (se necessário)

    // Adiciona as linhas já ordenadas à tabela
    table.children("tbody").append(rows);

    // Reinicia a paginação com a ordem correta de todos os dados
    aplicarPaginacao();
  });
  aplicarPaginacao();
  validarDatas();
});

function aplicarPaginacao() {
  const linhasPorPagina = 5; // Define o número de linhas por página
  const $corpoTabela = $(".table-policia tbody"); // Seleciona o corpo da tabela
  const $linhas = $corpoTabela.find("tr"); // Seleciona todas as linhas
  const totalPaginas = Math.ceil($linhas.length / linhasPorPagina); // Calcula o total de páginas

  // Limpa a paginação anterior
  $("#paginacao").empty();

  // Esconde tudo antes de calcular a página atual
  $linhas.hide();

  // Se houver nenhuma ou apenas uma página, mostra todas as linhas e sai
  if (totalPaginas <= 1) {
    $linhas.show();
    return;
  }

  function mostrarPagina(num) {
    $linhas.hide(); // Esconde todas as linhas
    const inicio = (num - 1) * linhasPorPagina; // Calcula o índice inicial
    const fim = inicio + linhasPorPagina; // Calcula o índice final

    // Mostra as linhas da página atual com efeito fadeIn
    $linhas.slice(inicio, fim).fadeIn(200);

    // Estilo dos botões
    $(".btn-pag").css({
      background: "#fff",
      color: "#000",
      border: "1px solid #ddd",
    });
    $(`.btn-pag[data-page="${num}"]`).css({
      background: "#3b82f6",
      color: "#fff",
      border: "1px solid #3b82f6",
    });
  }

  // Criar botões
  for (let i = 1; i <= totalPaginas; i++) {
    $("<button>")
      .text(i)
      .attr("data-page", i)
      .addClass("btn-pag")
      .css({
        padding: "8px 15px",
        borderRadius: "5px",
        cursor: "pointer",
        margin: "0 2px",
      })
      .click(function () {
        mostrarPagina(i);
      })
      .appendTo("#paginacao");
  }

  // Volta sempre à página 1 após reordenar ou carregar
  mostrarPagina(1);
}

function validarDatas() {
  // Data atual em formato YYYY-MM-DD, em string dividida por data, ignorando a hora
  const hoje = new Date().toISOString().split("T")[0];
  $('input[type="date"]').attr("max", hoje);
  $("#dataNascimento").attr("min", "1900-01-01");
}
