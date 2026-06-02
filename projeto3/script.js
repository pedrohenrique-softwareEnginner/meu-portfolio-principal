// ==========================================================================
// 1. MAPEAMENTO DOS ELEMENTOS DO DOM
// ==========================================================================
const inputLogins = document.getElementById('input-logins');
const inputTraffic = document.getElementById('input-traffic');
const inputGeo = document.getElementById('input-geo');

const valLogins = document.getElementById('val-logins');
const valTraffic = document.getElementById('val-traffic');

const scoreNumber = document.getElementById('score-number');
const riskProgress = document.getElementById('risk-progress');
const riskVerdict = document.getElementById('risk-verdict');
const riskDisplay = document.getElementById('risk-display');
const systemStatus = document.getElementById('system-status');

// ==========================================================================
// 2. FUNÇÃO MATEMÁTICA: CÁLCULO DE SCORE HEURÍSTICO
// ==========================================================================
function calcularRisco() {
    // Captura os valores atuais dos inputs
    const logins = parseInt(inputLogins.value);
    const traffic = parseInt(inputTraffic.value);
    const geoRiscoBase = parseInt(inputGeo.value);

    // Atualiza os contadores numéricos ao lado dos labels
    valLogins.innerText = logins;
    valTraffic.innerText = traffic + " GB/s";

    // 🧮 Algoritmo Ponderado (Heurística Computacional)
    // Logins falhados: peso máximo de 35 pontos (35% do score total)
    const pontosLogins = (logins / 100) * 35;
    
    // Tráfego anómalo: peso máximo de 35 pontos (35% do score total)
    const pontosTráfego = (traffic / 50) * 35;
    
    // Geolocalização: peso máximo de 30 pontos (definido diretamente pelas opções do select)
    // Convertemos a escala original do select (0 a 75) proporcionalmente para o teto de 30 pontos
    const pontosGeo = (geoRiscoBase / 75) * 30;

    // Soma dos pesos e arredondamento para número inteiro
    let scoreTotal = Math.round(pontosLogins + pontosTráfego + pontosGeo);
    
    // Garante que o score nunca ultrapassa o limite matemático de 100
    scoreTotal = Math.min(100, scoreTotal);

    // Atualiza a interface com o resultado obtido
    atualizarInterface(scoreTotal);
}

// ==========================================================================
// 3. ATUALIZAÇÃO REATIVA DA INTERFACE (MUDANÇA DE ESTADOS E CORES)
// ==========================================================================
function atualizarInterface(score) {
    // Exibe o número do score na tela
    scoreNumber.innerText = score;
    
    // Atualiza a largura da barra de progresso dinamicamente
    riskProgress.style.width = score + "%";

    // Limpa as classes de estado anteriores do card de exibição
    riskDisplay.className = "card display-panel";

    // Regras de Negócio baseadas nas faixas de Score de Risco
    if (score <= 30) {
        // 🟢 ESTADO 1: RISCO BAIXO (Sistema Nominal)
        scoreNumber.className = "risk-low";
        riskProgress.style.backgroundColor = "#10b981";
        riskDisplay.classList.add('risk-level-low');
        riskVerdict.innerText = "Tráfego limpo. Nenhuma ação de mitigação é necessária no momento.";
        
        systemStatus.innerText = "SISTEMA NOMINAL";
        systemStatus.className = "status-badge status-green";

    } else if (score > 30 && score <= 65) {
        // 🟡 ESTADO 2: RISCO MÉDIO (Atenção / Monitoramento)
        scoreNumber.className = "risk-medium";
        riskProgress.style.backgroundColor = "#f59e0b";
        riskDisplay.classList.add('risk-level-medium');
        riskVerdict.innerText = "Aviso: Comportamento anómalo detetado na rede. Sistema em observação secundária.";
        
        systemStatus.innerText = "ALERTA MODERADO";
        systemStatus.className = "status-badge status-yellow";

    } else {
        // 🔴 ESTADO 3: RISCO ALTO / CRÍTICO (Mitigação Ativa)
        scoreNumber.className = "risk-high";
        riskProgress.style.backgroundColor = "#ef4444";
        riskDisplay.classList.add('risk-level-high');
        riskVerdict.innerText = "CRÍTICO: Forte indício de ataque de força bruta ou exfiltração de dados! Bloqueando IPs suspeitos na Firewall.";
        
        systemStatus.innerText = "MITIGAÇÃO ATIVA";
        systemStatus.className = "status-badge status-red";
    }
}

// ==========================================================================
// 4. ESCUTA DE EVENTOS EM TEMPO REAL (EVENT LISTENERS)
// ==========================================================================
inputLogins.addEventListener('input', calcularRisco);
inputTraffic.addEventListener('input', calcularRisco);
inputGeo.addEventListener('change', calcularRisco);

// Executa o cálculo inicial assim que a página carrega
calcularRisco();