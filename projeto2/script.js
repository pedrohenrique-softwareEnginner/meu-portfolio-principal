const SUPABASE_URL = "sb_publishable_AqL_85bfpX_guKPPW6jwqg_qeCdoSAt";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtuaml2Y25ycG5wamN2eWVlenRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM2OTU5MSwiZXhwIjoyMDk1OTQ1NTkxfQ.Y4hx_qbH4QRnBXTCEl7jBVA_PMJFzulFUq4-7jqR7hc";

async function carregarNoticiasDoSupabase() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/noticias?select=*&order=id.desc`, {
            headers: {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        const noticias = await response.json();
        
        const container = document.getElementById('noticias-container');
        container.innerHTML = ""; // Limpa a tela

        noticias.forEach(noticia => {
            const card = document.createElement('div');
            card.className = 'card-noticia';
            // Usa o link do Supabase se existir, senão manda para a home do TecMundo
            const link = noticia.link_noticia || "https://www.tecmundo.com.br";
            
            card.innerHTML = `
                <h2>${noticia.titulo}</h2>
                <p>${noticia.conteudo}</p>
                <a href="${link}" target="_blank">Ler Artigo Completo →</a>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        console.error("Erro ao carregar:", e);
    }
}
carregarNoticiasDoSupabase();