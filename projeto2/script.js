// ==========================================================================
// 1. CONFIGURAÇÃO E CONEXÃO COM O SUPABASE
// ==========================================================================
const SUPABASE_URL = "https://knjivcnrpnpjcvyeeztj.supabase.co"; 
const SUPABASE_ANON_KEY = "sb_publishable_AqL_85bfpX_guKPPW6jwqg_qeCdoSAt"; // COLE A SUA CHAVE COMPLETA AQUI

// CORREÇÃO: Usamos o nome 'clienteSupabase' para evitar conflito com a biblioteca oficial
const clienteSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// ==========================================================================
// 2. LÓGICA DE ALTERNAÇÃO E PERSISTÊNCIA DE TEMA (DARK/LIGHT)
// ==========================================================================
const themeToggleBtn = document.getElementById('theme-toggle');
const bodyElement = document.body;

const temaSalvo = localStorage.getItem('themePreference');
if (temaSalvo === 'dark') {
    bodyElement.className = 'dark-mode';
    themeToggleBtn.innerHTML = '🌙 Dark Mode';
} else {
    bodyElement.className = 'light-mode';
    themeToggleBtn.innerHTML = '☀️ Light Mode';
}

themeToggleBtn.addEventListener('click', () => {
    if (bodyElement.classList.contains('light-mode')) {
        bodyElement.className = 'dark-mode';
        localStorage.setItem('themePreference', 'dark');
        themeToggleBtn.innerHTML = '🌙 Dark Mode';
    } else {
        bodyElement.className = 'light-mode';
        localStorage.setItem('themePreference', 'light');
        themeToggleBtn.innerHTML = '☀️ Light Mode';
    }
});


// ==========================================================================
// 3. ☁️ REQUISIÇÃO ASSÍNCRONA: BUSCANDO A NOTÍCIA ATIVA NA NUVEM
// ==========================================================================
let noticiaDoDiaGlobal = null; 

async function buscarNoticiaDoBanco() {
    document.getElementById('main-title').innerText = "Conectando ao banco de dados Supabase...";
    document.getElementById('main-excerpt').innerText = "Aguardando resposta da API Cloud...";

    try {
        // CORREÇÃO: Usando a nova variável 'clienteSupabase'
        const { data, error } = await clienteSupabase
            .from('noticias')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
            noticiaDoDiaGlobal = data[0]; 

            const dataCriacao = new Date(noticiaDoDiaGlobal.created_at);
            const dataFormatada = `${String(dataCriacao.getDate()).padStart(2, '0')}/${String(dataCriacao.getMonth() + 1).padStart(2, '0')}/${dataCriacao.getFullYear()}`;

            // Tratamento extra caso os campos ainda estejam NULL no banco
            const tituloFinal = noticiaDoDiaGlobal.titulo || "Título não preenchido no banco";
            const resumoFinal = noticiaDoDiaGlobal.resumo || "Resumo não preenchido no banco";

            document.getElementById('main-title').innerText = tituloFinal;
            document.getElementById('main-excerpt').innerText = resumoFinal;
            document.getElementById('news-date').innerText = dataFormatada;
            document.getElementById('news-status').innerText = "Live Cloud Feed Ativo";
            document.getElementById('news-status').style.backgroundColor = "#00CC66"; 

        } else {
            document.getElementById('main-title').innerText = "Nenhuma notícia cadastrada ou acesso negado (RLS).";
            document.getElementById('main-excerpt').innerText = "Verifique as permissões de leitura no Supabase.";
        }

    } catch (erroConexao) {
        console.error("Erro na requisição da API:", erroConexao);
        document.getElementById('main-title').innerText = "Falha de Comunicação com a Nuvem";
        document.getElementById('main-excerpt').innerText = "Erro ao conectar. Verifique o console do navegador.";
    }
}

buscarNoticiaDoBanco();


// ==========================================================================
// 4. 🔗 INTERAÇÃO REAL: ABERTURA DO MODAL DINÂMICO
// ==========================================================================
const modal = document.getElementById('news-modal');
const closeModalBtn = document.getElementById('close-modal');
const btnLerArtigoCompleto = document.querySelector('.read-more');

const modalTitle = document.getElementById('modal-title');
const modalBadge = document.getElementById('modal-badge');
const modalBodyText = document.getElementById('modal-body-text');
const modalMeta = document.getElementById('modal-meta');

btnLerArtigoCompleto.addEventListener('click', (e) => {
    e.preventDefault();
    if (!noticiaDoDiaGlobal) return; 
    
    modalBadge.innerText = noticiaDoDiaGlobal.tag || "Sem Tag";
    modalTitle.innerText = noticiaDoDiaGlobal.titulo || "Sem título";
    modalBodyText.innerText = noticiaDoDiaGlobal.conteudo_completo || "Conteúdo completo não cadastrado no banco ainda."; 
    modalMeta.innerText = `Fonte: Banco Supabase Cloud • Publicado em ${document.getElementById('news-date').innerText}`;
    
    modal.classList.add('active');
});

document.querySelectorAll('.card-link').forEach((linkCard) => {
    linkCard.addEventListener('click', (e) => {
        e.preventDefault();
        const cardPai = linkCard.parentElement;
        modalBadge.innerText = cardPai.querySelector('.badge-tag').innerText;
        modalTitle.innerText = cardPai.querySelector('h3').innerText;
        modalBodyText.innerText = cardPai.querySelector('p').innerText + " Este módulo demonstra a integração assíncrona estável da aplicação.";
        modalMeta.innerText = "TechPulse Redação";
        modal.classList.add('active');
    });
});

closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });