const API_URL = "/api";

$(document).ready(function () {
  // 1. Verificar Login
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userNome = localStorage.getItem("userNome");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Mostrar nome do agente na barra lateral
  $("#agenteNome").text(userNome || "Agente");

  // 2. Controlar Permissões (Botão "Novo")
  // Apenas Admin e Secretariado podem ver o botão de criar
  if (role === "admin" || role === "secretariado") {
    $("#btnNovo").show();
  }

  // 3. Detetar qual tabela carregar com base no ID da tabela no HTML
  if ($("#listaEmpresas").length) {
    carregarEmpresas(token, role);
  } else if ($("#listaIndividuos").length) {
    carregarIndividuos(token, role);
  }
});

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// --- EMPRESAS ---
function carregarEmpresas(token, role) {
  $.ajax({
    url: `${API_URL}/empresas`,
    method: "GET",
    headers: { "auth-token": token },
    success: function (data) {
      const tbody = $("#listaEmpresas");
      tbody.empty();

      if (data.length === 0) {
        tbody.html(
          '<tr><td colspan="6" style="text-align:center">Sem registos encontrados.</td></tr>'
        );
        return;
      }

      data.forEach((emp) => {
        // Lógica da Foto: Se não tiver URL, usa a user.png
        const imgUrl = emp.fotoUrl || 'img/user.png'

        // Botão Apagar: Só para ADMIN
        let btnDelete = "";
        if (role === "admin") {
          btnDelete = `<button onclick="apagarItem('empresas', '${emp._id}')" class="btn-sm btn-danger" style="margin-left:5px;">Eliminar</button>`;
        }

        // Botão Ver Ficha: Todos veem
        const btnVer = `<a href="editarEmpresa.html?id=${emp._id}" class="btn-sm btn-primary" style="text-decoration:none; background:#3b82f6; color:white; margin-right:5px; padding: 5px 10px; border-radius: 4px;">Ver Ficha</a>`;

        tbody.append(`
                    <tr>
                        <td><img src="${imgUrl}" class="table-img"></td>
                        <td><strong>${emp.nome}</strong></td>
                        <td>${emp.nif}</td>
                        <td>${emp.localidade || "-"}</td>
                        <td>${emp.telefone || "-"}</td>
                        <td style="text-align: right;">
                            ${btnVer}
                            ${btnDelete}
                        </td>
                    </tr>
                `);
      });
      if (typeof aplicarPaginacao === "function") {
        aplicarPaginacao();
      }
    },
    error: function (xhr) {
      console.log("Erro:", xhr);
      if (xhr.status === 401 || xhr.status === 403) logout();
    },
  });
}

// --- INDIVÍDUOS ---
function carregarIndividuos(token, role) {
  $.ajax({
    url: `${API_URL}/individuos`,
    method: "GET",
    headers: { "auth-token": token },
    success: function (data) {
      const tbody = $("#listaIndividuos");
      tbody.empty();

      if (data.length === 0) {
        tbody.html(
          '<tr><td colspan="6" style="text-align:center">Sem registos encontrados.</td></tr>'
        );
        return;
      }

      data.forEach((ind) => {
        // ✅ CORREÇÃO: Igual às empresas
        const imgUrl = ind.fotoUrl || 'img/user.png';

        let btnDelete = "";
        if (role === "admin") {
          btnDelete = `<button onclick="apagarItem('individuos', '${ind._id}')" class="btn-sm btn-danger" style="margin-left:5px;">Eliminar</button>`;
        }

        const btnVer = `<a href="editarIndividuo.html?id=${ind._id}" class="btn-sm btn-primary" style="text-decoration:none; background:#3b82f6; color:white; margin-right:5px; padding: 5px 10px; border-radius: 4px;">Ver Ficha</a>`;

        tbody.append(`
          <tr>
            <td><img src="${imgUrl}" class="table-img" onerror="this.src='img/user.png'"></td>
            <td><strong>${ind.nome}</strong></td>
            <td>${ind.nif}</td>
            <td>${ind.profissao || "-"}</td>
            <td>${ind.telefone || "-"}</td>
            <td style="text-align: right;">
              ${btnVer}
              ${btnDelete}
            </td>
          </tr>
        `);
      });
      
      if (typeof aplicarPaginacao === "function") {
        aplicarPaginacao();
      }
    },
    error: function (xhr) {
      console.log("Erro:", xhr);
      if (xhr.status === 401 || xhr.status === 403) logout();
    },
  });
}

// --- FUNÇÃO DE APAGAR (Genérica) ---
function apagarItem(tipo, id) {
  if (
    !confirm(
      "ATENÇÃO: Tem a certeza que deseja eliminar este registo permanentemente?"
    )
  )
    return;

  $.ajax({
    url: `${API_URL}/${tipo}/${id}`,
    method: "DELETE",
    headers: { "auth-token": localStorage.getItem("token") },
    success: function () {
      alert("Registo eliminado.");
      location.reload(); // Recarrega a página para atualizar a lista
    },
    error: function (err) {
      alert(
        "Erro ao apagar: " + (err.responseJSON?.message || "Sem permissão")
      );
    },
  });
}


// --- FUNÇÃO DE Pesuisar/Filtrar  ---
$(document).ready(function() {
    // Escuta o teclado no campo de pesquisa
    $("#inputPesquisa").on("keyup", function() {
        // Obtém o texto digitado e converte para minúsculas (ignore case)
        const filtro = $(this).val().toLowerCase();
        
        // Determina qual a tabela que está a ser visualizada
        const isEmpresa = $("#listaEmpresas").length > 0;
        const linhas = isEmpresa ? $("#listaEmpresas tr") : $("#listaIndividuos tr");

        // Percorre todas as linhas da tabela
        linhas.each(function() {
            const linha = $(this);
            
            // Extrai o texto das colunas específicas
            // eq(1) = Nome/Entidade, eq(2) = NIF, eq(4) = Contacto/Telefone
            const nome = linha.find("td:eq(1)").text().toLowerCase();
            const nif = linha.find("td:eq(2)").text().toLowerCase();
            const contacto = linha.find("td:eq(4)").text().toLowerCase(); 

            // Se o filtro existir em qualquer um dos campos, mostra a linha
            if (nome.includes(filtro) || nif.includes(filtro) || contacto.includes(filtro)) {
                linha.show();
            } else {
                linha.hide();
            }
        });

        // IMPORTANTE: Se o filtro for limpo, reinicia a paginação do order.js
        if (filtro === "" && typeof aplicarPaginacao === "function") {
            aplicarPaginacao();
        }
    });
});