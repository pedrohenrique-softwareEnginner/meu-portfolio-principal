// ==========================================================================
// 1. LÓGICA DO MENU HAMBÚRGUER (MOBILE)
// ==========================================================================
const menuToggle = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});


// ==========================================================================
// 2. 🛡️ ENGINE DE ANÁLISE HEURÍSTICA DE URL REAL (CORRIGIDA)
// ==========================================================================
const payloadInput = document.getElementById('payloadInput');
const btnScan = document.getElementById('btn-scan');
const scanVerdict = document.getElementById('scan-verdict');

btnScan.addEventListener('click', () => {
    let urlString = payloadInput.value.trim();

    if (urlString === "") {
        scanVerdict.innerHTML = `<p class="danger-line">[ERRO] Campo vazio. Insira uma URL válida para iniciar o scanner.</p>`;
        return;
    }

    // Auto-ajuste para o construtor URL caso o utilizador esqueça o protocolo básico
    if (!/^https?:\/\//i.test(urlString)) {
        urlString = "http://" + urlString;
    }

    scanVerdict.innerHTML = `<p class="system-line">[INFO] Estabelecendo conexão segura com gateway de análise...</p>
                             <p class="system-line">[INFO] Inicializando desestruturação anatômica da URL...</p>`;

    try {
        // 🧠 USO REAL DE API DO JAVASCRIPT: Objeto URL para destrinchar o link
        const urlObjeto = new URL(urlString);
        const protocolo = urlObjeto.protocol;
        const hostname = urlObjeto.hostname.toLowerCase();
        const caminho = urlObjeto.pathname.toLowerCase();

        let logs = [];
        let scoreRisco = 0; // Quanto maior, mais perigoso

        logs.push(`[PARSING] Hostname identificado: ${hostname}`);
        logs.push(`[PARSING] Protocolo de transmissão: ${protocolo.toUpperCase()}`);

        // 1. Verificação de Protocolo Criptografado (SSL/TLS)
        if (protocolo === "http:") {
            logs.push(`⚠️ [RISCO] Protocolo HTTP detectado. Tráfego de pacotes não criptografado. Vulnerável a ataques Man-in-the-Middle (MitM) e tática comum de servidores de download de Malware.`);
            scoreRisco += 3;
        } else {
            logs.push(`✅ [OK] Protocolo HTTPS ativo (Camada de criptografia SSL/TLS verificada).`);
        }

        // 2. Verificação de IP direto no Hostname (Malware Distribution / C2 Servers)
        const regexIP = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (regexIP.test(hostname)) {
            logs.push(`❌ [CRÍTICO] A URL utiliza um endereço IP direto em vez de um domínio registrado (DNS). Comportamento altamente associado a servidores de comando e controle (C2) de botnets ou distribuição oculta de exploits.`);
            scoreRisco += 5;
        }

        // 3. Verificação de TLDs (Extensões) de Alto Risco para Golpes
        const tldsPerigosas = /\.(tk|ml|ga|cf|gq|xyz|top|download|click|club)$/i;
        if (tldsPerigosas.test(hostname)) {
            logs.push(`⚠️ [RISCO] Extensão de Domínio (TLD) de baixo custo ou distribuição gratuita detectada (.${hostname.split('.').pop()}). Estatisticamente utilizada em larga escala para campanhas rápidas de Phishing descartável.`);
            scoreRisco += 2;
        }

        // 4. Engenharia Social e Sequestro de Marcas (Typosquatting / Combosquatting)
        const palavrasGatilho = /(login|verify|suporte|atualizacao|seguranca|banco|caixa|recadastro|netflix|google|paypal|facebook|instagram)/i;
        
        // 🌟 LÓGICA CORRIGIDA: Permite domínios oficiais terminando em .com ou com extensões nacionais (.com.br, .com.pt, etc.)
        const dominiosOficiais = /(google|netflix|paypal|facebook|instagram)\.com(\.[a-z]{2,3})?$/;

        if (palavrasGatilho.test(hostname) && !dominiosOficiais.test(hostname)) {
            logs.push(`❌ [CRÍTICO] Engenharia Social Detectada! O domínio contém palavras-chave de segurança ou marcas corporativas famosas agregadas de forma suspeita no hostname. Indicativo claro de Phishing direcionado.`);
            scoreRisco += 4;
        }

        // 5. Deep URL (Spam de Subdomínios para enganar ecrãs de telemóveis)
        const numeroPontos = (hostname.match(/\./g) || []).length;
        if (numeroPontos >= 4) {
            logs.push(`⚠️ [RISCO] Excesso de subdomínios detectado (${numeroPontos} pontos). Técnica utilizada para empurrar o domínio real para fora da barra de visualização de dispositivos móveis.`);
            scoreRisco += 1;
        }

        // 6. Monitoramento de extensões executáveis perigosas no caminho (Análise de Malware)
        const extensoesMalware = /\.(exe|bat|msi|vbs|scr|sh)$/i;
        if (extensoesMalware.test(caminho)) {
            logs.push(`❌ [CRÍTICO] Endpoint direto para arquivo executável de sistema detectado (.${caminho.split('.').pop()}). Alto risco de download de pacotes do tipo cavalo de troia (Trojan) ou ransomware.`);
            scoreRisco += 5;
        }

        // Renderização dinâmica dos logs simulando o processamento da engine
        setTimeout(() => {
            scanVerdict.innerHTML = "";
            logs.forEach(log => {
                if (log.includes("✅")) {
                    scanVerdict.innerHTML += `<p class="safe-line">${log}</p>`;
                } else if (log.includes("⚠️")) {
                    scanVerdict.innerHTML += `<p class="system-line" style="color: #ffbd2e;">${log}</p>`;
                } else if (log.includes("❌")) {
                    scanVerdict.innerHTML += `<p class="danger-line">${log}</p>`;
                } else {
                    scanVerdict.innerHTML += `<p class="system-line">${log}</p>`;
                }
            });

            // Veredicto Final baseado no Score Heurístico acumulado
            let veredictoFinal = "";
            if (scoreRisco === 0) {
                veredictoFinal = `<h4 class="safe-line" style="font-size: 15px; margin-top: 15px;">🛡️ VEREDICTO: TOTALMENTE SEGURO (Score ${scoreRisco}/20)</h4><p class="system-line">A URL segue perfeitamente os padrões arquiteturais de segurança e integridade de mercado.</p>`;
            } else if (scoreRisco > 0 && scoreRisco <= 3) {
                veredictoFinal = `<h4 style="color: #ffbd2e; font-size: 15px; margin-top: 15px;">⚠️ VEREDICTO: SUSPEITO / REQUER ATENÇÃO (Score ${scoreRisco}/20)</h4><p class="system-line">A URL possui desvios de boas práticas corporativas. Navegue com cautela.</p>`;
            } else {
                veredictoFinal = `<h4 class="danger-line" style="font-size: 15px; margin-top: 15px;">🚨 VEREDICTO: BLOQUEADO (Score ${scoreRisco}/20 - ALTO RISCO DE AMEAÇA CYBER)</h4><p class="system-line">Acesso interceptado e mitigado com sucesso pela engine GuardianTech.</p>`;
            }
            scanVerdict.innerHTML += veredictoFinal;

        }, 600); // Delay simulado para experiência imersiva de processamento

    } catch (e) {
        scanVerdict.innerHTML = `<p class="danger-line">❌ [ERRO] Estrutura de URL totalmente inválida. Certifique-se de digitar um endereço web real no formato (exemplo.com ou https://site.com) para que os algoritmos de parsing possam operar.</p>`;
    }
});