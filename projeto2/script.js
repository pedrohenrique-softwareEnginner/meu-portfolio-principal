// ==========================================================================
// CONFIGURAÇÃO DO PORTAL TECHPULSE (VERSÃO CORRIGIDA E SEM MODAL)
// ==========================================================================

// ⚠️ ATENÇÃO: Lembra-te de colocar aqui as tuas chaves REAIS do Supabase!
const SUPABASE_URL = "sb_publishable_AqL_85bfpX_guKPPW6jwqg_qeCdoSAt";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtuaml2Y25ycG5wamN2eWVlenRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM2OTU5MSwiZXhwIjoyMDk1OTQ1NTkxfQ.Y4hx_qbH4QRnBXTCEl7jBVA_PMJFzulFUq4-7jqR7hc";

// Elementos da interface (DOM)
const containerNoticias = document.getElementById('noticias-container');
const statusConexao = document.getElementById('status-conexao');

// Função principal para puxar as notícias da nuvem
async function carregarNoticiasDoSupabase() {
    try {
        if (statusConexao) {
            statusConexao.innerText = "⏳ Sincronizando com a Nuvem...";
            statusConexao.style.color = "#38bdf8";
        }

        // Faz o pedido de leitura ordenando pela notícia mais recente (ID decrescente)
        const response = await fetch(`${SUPABASE_URL}/rest/v1/noticias?select=*&order=id.desc`, {
            method: "GET",
            headers: {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Erro na API do Supabase: ${response.status}`);
        }

        const noticias = await response.json();

        // Limpa o container antes de renderizar as novas notícias
        if (containerNoticias) {
            containerNoticias.innerHTML = "";
        } else {
            console.error("Erro: O elemento 'noticias-container' não foi encontrado no HTML.");
            return;
        }

        if (noticias.length === 0) {
            containerNoticias.innerHTML = `<p class="aviso-vazio">Nenhuma notícia encontrada no banco de dados.</p>`;
            if (statusConexao) statusConexao.innerText = "🟢 SISTEMA CONECTADO (VAZIO)";
            return;
        }

        // Percorre cada notícia vinda do banco e monta o card na tela
        noticias.forEach(noticia => {
            // Formata a data obtida do banco para o padrão brasileiro/português
            const dataFormatada = new Date(noticia.created_at).toLocaleString('pt-PT', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // 🌟 AQUI ESTÁ A CORREÇÃO DO LINK VINDOS DA AUTOMAÇÃO
            // Se o robô salvou um link válido, usamos. Se estiver nulo/vazio, usa o link padrão.
            const linkDestino = noticia.link_noticia ? noticia.link_noticia : "https://www.tecmundo.com.br";

            // Cria o elemento HTML do card
            const card = document.createElement('div');
            card.className = 'card-noticia';

            // Monta a estrutura interna do card. 
            // ⚠️ Repara que o botão agora é um link <a> puro, sem eventos JavaScript de clique interceptando!
            card.innerHTML = `
                <div class="card-header">
                    <span class="tag-tech">TECNOLOGIA</span>
                    <span class="data-noticia">${dataFormatada}</span>
                </div>
                <h2 class="titulo-noticia">${noticia.titulo}</h2>
                <p class="descricao-noticia">${noticia.conteudo || 'Clique abaixo para ler a matéria completa diretamente no portal oficial.'}</p>
                <div class="card-footer">
                    <a href="${linkDestino}" target="_blank" rel="noopener noreferrer" class="btn-ler">
                        Ler Artigo Original ↗
                    </a>
                </div>
            `;

            containerNoticias.appendChild(card);
        });

        if (statusConexao) {
            statusConexao.innerText = "🟢 PORTAL SINCRONIZADO EM TEMPO REAL";
            statusConexao.style.color = "#10b981";
        }

    } catch (erro) {
        console.error("Falha ao ler dados do Supabase:", erro);
        if (statusConexao) {
            statusConexao.innerText = "🔴 ERRO DE CONEXÃO COM A NUVEM";
            statusConexao.style.color = "#ef4444";
        }
        if (containerNoticias) {
            containerNoticias.innerHTML = `<p class="erro-mensagem">Não foi possível carregar o feed. Verifique a conexão ou chaves.</p>`;
        }
    }
}

// Inicializa a leitura assim que o site abre
carregarNoticiasDoSupabase();

// Atualiza automaticamente o feed a cada 5 minutos
setInterval(carregarNoticiasDoSupabase, 300000);


// ==========================================================================
// 🛡️ CORREÇÃO DO ERRO DA LINHA 125 (ELEMENTOS SECUNDÁRIOS / BOTÃO DE TEMA)
// ==========================================================================
// Envolvemos a escuta de cliques em verificações "if". 
// Se o botão não existir nesta página específica do portfólio, o código não quebra!

const botaoAlternarTema = document.getElementById('theme-toggle'); // Ajusta para o ID real do teu botão se houver
if (botaoAlternarTema) {
    botaoAlternarTema.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        console.log("Tema alternado com sucesso!");
    });
}