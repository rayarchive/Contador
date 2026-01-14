const QUOTES = [
    { text: "Cada livro é um sonho que você segura em suas mãos.", author: "Neil Gaiman" },
    { text: "A leitura é para a mente o que o exercício é para o corpo.", author: "Joseph Addison" },
    { text: "Ler é viajar sem sair do lugar.", author: "Victor Hugo" },
    { text: "Livros são magia portátil.", author: "Stephen King" }
];

let currentQuoteIndex = 0;
function displayQuote() {
    const qText = document.getElementById('quote-text');
    const qAuth = document.getElementById('quote-author');
    if(!qText) return;
    qText.style.opacity = '0';
    setTimeout(() => {
        qText.textContent = `"${QUOTES[currentQuoteIndex].text}"`;
        qAuth.textContent = `– ${QUOTES[currentQuoteIndex].author} –`;
        qText.style.opacity = '1';
        currentQuoteIndex = (currentQuoteIndex + 1) % QUOTES.length;
    }, 800);
}
setInterval(displayQuote, 10000);
displayQuote();

const KEYS = { LIDAS: 'chicLidas', CADASTRADAS: 'chicCadas', ANDAMENTO: 'chicAnda' };
let OBRAS_LIDAS, OBRAS_CADASTRADAS, OBRAS_ANDAMENTO;

function loadStats() {
    OBRAS_LIDAS = parseInt(localStorage.getItem(KEYS.LIDAS)) || 0;
    OBRAS_CADASTRADAS = parseInt(localStorage.getItem(KEYS.CADASTRADAS)) || 0;
    OBRAS_ANDAMENTO = Math.max(0, OBRAS_CADASTRADAS - OBRAS_LIDAS);
}

function saveStats() {
    localStorage.setItem(KEYS.LIDAS, OBRAS_LIDAS);
    localStorage.setItem(KEYS.CADASTRADAS, OBRAS_CADASTRADAS);
    localStorage.setItem(KEYS.ANDAMENTO, OBRAS_ANDAMENTO);
}

// --- EXPLOSÃO DE CORAÇÕES ---
function spawnSparkles() {
    const holder = document.getElementById('particles-holder');
    const bar = document.getElementById('progress-bar-fill');
    const xPos = bar.offsetWidth;

    for (let i = 0; i < 22; i++) {
        const p = document.createElement('div');
        p.className = 'particle'; 

        p.style.left = `${xPos}px`;
        p.style.top = '50%';

        const tx = (Math.random() - 0.2) * 160;
        const ty = (Math.random() - 0.5) * 130;
        p.style.setProperty('--tx', `${tx}px`);
        p.style.setProperty('--ty', `${ty}px`);

        holder.appendChild(p);
        setTimeout(() => p.remove(), 1200);
    }
}

function updateDisplay(sparkle = false) {
    const taxa = OBRAS_CADASTRADAS > 0 ? Math.round((OBRAS_LIDAS / OBRAS_CADASTRADAS) * 100) : 0;
    
    document.getElementById('obras-lidas').textContent = OBRAS_LIDAS;
    document.getElementById('obras-cadastradas').textContent = OBRAS_CADASTRADAS;
    document.getElementById('obras-andamento').textContent = OBRAS_ANDAMENTO;
    
    document.getElementById('progress-bar-fill').style.width = taxa + '%';
    document.getElementById('progress-percent').textContent = taxa + '%';

    if (sparkle && taxa > 0) setTimeout(spawnSparkles, 150);
}

function updateStats(tipo, change) {
    let sparkle = false;

    if (tipo === 'LIDAS') {
        OBRAS_LIDAS += change;
        if (OBRAS_LIDAS < 0) OBRAS_LIDAS = 0; 
        if (change > 0) sparkle = true;
    } else {
        OBRAS_CADASTRADAS += change;
        if (OBRAS_CADASTRADAS < 0) OBRAS_CADASTRADAS = 0; 
    }
    
    OBRAS_ANDAMENTO = OBRAS_CADASTRADAS - OBRAS_LIDAS;
    if (OBRAS_ANDAMENTO < 0) OBRAS_ANDAMENTO = 0;
    
    saveStats();
    updateDisplay(sparkle);
}

// --- FUNÇÕES DO PAINEL DE BACKUP (JSON PURO) ---
function toggleBackupPanel() {
    const panel = document.getElementById('backup-panel');
    panel.classList.toggle('backup-hidden');
    // Limpa o textarea ao abrir/fechar
    document.getElementById('backup-data').value = "";
}

function generateBackup() {
    const data = {
        lidas: OBRAS_LIDAS,
        cadastradas: OBRAS_CADASTRADAS,
        timestamp: new Date().toLocaleString()
    };
    
    // Converte para JSON legível
    const jsonString = JSON.stringify(data, null, 2);
    document.getElementById('backup-data').value = jsonString;
    
    // Seleciona o texto automaticamente para facilitar a cópia
    const textarea = document.getElementById('backup-data');
    textarea.select();
    
    alert("Código JSON gerado com sucesso!");
}

function restoreBackup() {
    const jsonString = document.getElementById('backup-data').value;
    if (!jsonString) return alert("Por favor, cole o código JSON para restaurar.");

    try {
        const data = JSON.parse(jsonString);
        
        // Verificação básica de integridade
        if (data.lidas === undefined || data.cadastradas === undefined) {
            throw new Error("Formato inválido");
        }

        if (confirm(`Restaurar estes dados?\nLidas: ${data.lidas}\nCadastradas: ${data.cadastradas}`)) {
            OBRAS_LIDAS = parseInt(data.lidas);
            OBRAS_CADASTRADAS = parseInt(data.cadastradas);
            OBRAS_ANDAMENTO = Math.max(0, OBRAS_CADASTRADAS - OBRAS_LIDAS);
            
            saveStats();
            updateDisplay();
            toggleBackupPanel();
            alert("Backup restaurado com sucesso!");
        }
    } catch (e) {
        alert("Erro: O texto colado não é um backup válido. Verifique se copiou o JSON completo.");
    }
}

loadStats();
updateDisplay();
