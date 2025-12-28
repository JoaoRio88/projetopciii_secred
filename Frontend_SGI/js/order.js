$(document).ready(function () {
  $("th").click(function () {
    const table = $(this).closest("table"); // Encontra a tabela
    const index = $(this).index(); // Encontra a coluna
    const rows = table
      .find("tbody tr")
      .toArray() // Encontra todas as linhas e transforma em Array
      .sort((a, b) => {
        const valA = $(a).children("td").eq(index).text();
        const valB = $(b).children("td").eq(index).text();
        // Compara números/texto
        return $.isNumeric(valA) && $.isNumeric(valB)
          ? valA - valB // Se números subtrai e descobre o maior
          : valA.localeCompare(valB); // Se texto compara alfabeticamente
      });
    this.asc = !this.asc; // Inverte a ordem
    if (!this.asc) rows.reverse();
    table.children("tbody").append(rows); // Atualiza e reposiciona os elementos na tabela
  });
  aplicarPaginacao();
});

function aplicarPaginacao() {
  const linhasPorPagina = 5;
  const $corpoTabela = $(".table-policia tbody");
  const $linhas = $corpoTabela.find("tr");
  const totalPaginas = Math.ceil($linhas.length / linhasPorPagina);

  // 1. Limpar botões antigos e o contentor
  $("#paginacao").empty();

  // Se houver apenas uma página ou nenhuma, não mostra botões e sai
  if (totalPaginas <= 1) {
    $linhas.show();
    return;
  }

  function mostrarPagina(num) {
    $linhas.hide(); //Esconde todas as linhas
    const inicio = (num - 1) * linhasPorPagina; //Calcula o índice inicial
    const fim = inicio + linhasPorPagina; //Calcula o índice final
    $linhas.slice(inicio, fim).fadeIn(200); //Mostra as linhas da página atual com efeito fadeIn

    // Estilo visual dos botões
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

  // 2. Criar botões no contentor correto
  for (let i = 1; i <= totalPaginas; i++) {
    $("<button>")
      .text(i)
      .attr("data-page", i)
      .addClass("btn-pag")
      .css({ padding: "8px 15px", "border-radius": "4px", cursor: "pointer" })
      .click(function () {
        mostrarPagina(i);
      })
      .appendTo("#paginacao"); // Agora usa o ID correto
  }

  mostrarPagina(1); //Sempre a primeira página ao iniciar
}