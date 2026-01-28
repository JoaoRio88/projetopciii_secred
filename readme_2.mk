# 🛡️ GUIA DE INSTALAÇÃO: PROJETO SGI POLICIAL

Este guia foi criado para te ajudar a colocar o **Sistema de Gestão de Investigação** a funcionar do zero. Segue os passos pela ordem indicada.

---

## 📋 1. PRÉ-REQUISITOS (Instalar antes de começar)

Antes de abrires as pastas do projeto, precisas de ter estas duas ferramentas instaladas:

1.  **Node.js:** É o que permite correr o servidor. [Faz o download aqui](https://nodejs.org/) (escolhe a versão "LTS").
2.  **MongoDB Community Server:** É a base de dados onde guardamos os suspeitos e crimes. [Faz o download aqui](https://www.mongodb.com/try/download/community).
3.  **VS Code + Live Server:** Certifica-te que tens o VS Code instalado e, dentro dele, instala a extensão chamada **"Live Server"** (ícone de uma antena azul).

---

## ⚙️ PASSO 1: PREPARAR O BACKEND (O Motor)

O Backend é o responsável por ligar o site à base de dados.

1.  Abre a pasta **`backend`** do projeto.
2.  Clica com o botão direito num espaço vazio da pasta e seleciona **"Abrir no Terminal"** (ou CMD).
3.  No terminal que abriu, escreve o comando abaixo e prime Enter:
    ```bash
    npm install
    ```
    *Isto vai descarregar as peças necessárias para o servidor funcionar. Aguarda até terminar.*

---

## 🗄️ PASSO 2: CRIAR A BASE DE DADOS (Utilizadores)

Agora vamos criar os acessos (Comandante, Agentes, etc.) na tua base de dados local.

1.  Ainda no mesmo terminal, escreve:
    ```bash
    node seed.js
    ```
2.  Deverás ver a mensagem: **"Utilizadores criados com sucesso!"**.

---

## 🚀 PASSO 3: LIGAR O SERVIDOR API

Agora vamos pôr o sistema a comunicar com a porta 5000.

1.  No terminal, escreve o comando final:
    ```bash
    node server.js
    ```
2.  **MUITO IMPORTANTE:** Verás a mensagem: `Servidor a funcionar na porta 5000`. 
3.  **NÃO FECHES ESTA JANELA.** Se fechares o terminal, o site deixará de conseguir guardar ou ler dados.

---

## 💻 PASSO 4: ABRIR O FRONTEND (A Interface)

Como estamos a usar uma API, não podes simplesmente clicar duas vezes no ficheiro HTML. Precisas de usar o **Live Server**.

1.  [cite_start]Abre a pasta **`Frontend_SGI`** [cite: 535] dentro do teu **VS Code**.
2.  [cite_start]Localiza o ficheiro **`login.html`** [cite: 362] na lista de ficheiros à esquerda.
3.  Clica com o botão direito em cima do `login.html` e escolhe **"Open with Live Server"**.
4.  O teu browser vai abrir o portal de acesso oficial do SGI.

---

## 🔐 CREDENCIAIS DE ACESSO (Para Testes)

Usa estes dados para testar os diferentes níveis de autorização do sistema:

| Perfil | Utilizador | Password | O que pode fazer? |
| :--- | :--- | :--- | :--- |
| **Comandante** | `comandante` | `admin123` | **Acesso Total**: Criar, editar e apagar qualquer registo. |
| **Secretariado** | `secretaria` | `sec123` | **Gestão**: Criar e editar fichas, mas não pode apagar nada. |
| **Patrulha** | `patrulha01` | `patrulha123` | **Consulta**: Só consegue ver os dados (campos bloqueados). |

---

## 📝 NOTAS IMPORTANTES

* **Fotos e PDFs:** Se as fotos não aparecerem nos PDFs, verifica se tens uma pasta chamada `uploads` dentro da pasta `backend`.
* **Erro de Ligação:** Se o site disser "Erro ao ligar", confirma se o terminal do Passo 3 ainda está aberto e a correr.
* [cite_start]**Localhost:** O site corre em `http://127.0.0.1:5500` e a base de dados em `http://localhost:5000`[cite: 185, 287, 512].

---
**Projeto desenvolvido para a disciplina de Programação de Computadores III.**