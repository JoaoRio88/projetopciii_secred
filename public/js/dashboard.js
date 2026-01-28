const API_URL = '/api';

$(document).ready(function() {
    checkAuth();
    loadDashboardData();
    
    // Mostrar nome do agente
    $('#agenteNome').text(localStorage.getItem('userNome') || 'Desconhecido');
});

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

function loadDashboardData() {
    // Vamos buscar Empresas e Indivíduos em paralelo
    $.when(
        $.get({ url: `${API_URL}/empresas`, headers: { 'auth-token': localStorage.getItem('token') } }),
        $.get({ url: `${API_URL}/individuos`, headers: { 'auth-token': localStorage.getItem('token') } })
    ).done(function(respEmpresas, respIndividuos) {
        
        // 1. A resposta do $.when vem em arrays [data, status, xhr]
        const empresas = respEmpresas[0];
        const individuos = respIndividuos[0];

        // 2. Atualizar KPIs (Esquerda)
        const totalEmp = empresas.length;
        const totalInd = individuos.length;
        
        animateValue("countEmpresas", 0, totalEmp, 1000);
        animateValue("countIndividuos", 0, totalInd, 1000);
        animateValue("countTotal", 0, totalEmp + totalInd, 1500);

        // 3. Gerar Feed de "Últimas Atualizações" (Direita)
        // Juntar as duas listas e adicionar um tipo para sabermos qual é qual
        const listaUnificada = [
            ...empresas.map(e => ({ ...e, tipo: 'Empresa', dataRef: e.dataRegisto })),
            ...individuos.map(i => ({ ...i, tipo: 'Indivíduo', dataRef: i.dataRegisto }))
        ];

        // Ordenar por data (Mais recente primeiro)
        listaUnificada.sort((a, b) => new Date(b.dataRef) - new Date(a.dataRef));

        // Preencher HTML
        const feedContainer = $('#feedList');
        feedContainer.empty();

        if (listaUnificada.length === 0) {
            feedContainer.html('<p style="text-align:center; color:#666;">Sem atividade recente.</p>');
            return;
        }

        // Mostrar apenas os últimos 7 registos
        listaUnificada.slice(0, 10).forEach(item => {
            const dataObj = new Date(item.dataRef);
            const dataStr = dataObj.toLocaleDateString() + ' ' + dataObj.toLocaleTimeString();
            
            // Lógica da Imagem: Se tiver foto usa, senão usa img/user.png
            // Nota: Se for empresa sem foto, podes querer um ícone diferente, mas para já fica o user.png ou logo genérico
            let imgIcon = 'img/user.png'; 
            if (item.fotoUrl) {
                // Aqui terias de ter o caminho correto do backend se fosse upload real
                // Como exemplo, assumimos que fotoUrl é um link ou base64
                imgIcon = item.fotoUrl ? `${item.fotoUrl}` : 'img/user.png';
            }

            const htmlItem = `
                <div class="feed-item">
                    <img src="${imgIcon}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid #334155;">
                    <div class="feed-info">
                        <h4>NOVO REGISTO: ${item.tipo}</h4>
                        <p>Foi adicionado <strong>${item.nome}</strong> (${item.nif}) à base de dados.</p>
                    </div>
                    <div class="feed-time">${dataStr}</div>
                </div>
            `;
            feedContainer.append(htmlItem);
        });

    }).fail(function(xhr, status, error) {
        console.error("ERRO DETALHADO:", xhr.responseText);
        console.error("Status:", status);
        console.error("Error:", error);
        
        // Se for erro de autenticação (401 ou 403), manda para o login
        if(xhr.status === 401 || xhr.status === 403) {
            alert("Sessão expirada. Por favor faça login novamente.");
            logout();
        } else {
            alert("Erro de comunicação: " + (xhr.responseText || "Verifique a consola (F12)"));
        }
    });
}

// Efeito visual de contagem nos números
function animateValue(id, start, end, duration) {
    if (start === end) return;
    const range = end - start;
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    const obj = document.getElementById(id);
    const timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}