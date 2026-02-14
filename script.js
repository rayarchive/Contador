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

function updateDisplay() {
    const taxa = OBRAS_CADASTRADAS > 0 ? Math.round((OBRAS_LIDAS / OBRAS_CADASTRADAS) * 100) : 0;
    document.getElementById('obras-lidas').textContent = OBRAS_LIDAS;
    document.getElementById('obras-cadastradas').textContent = OBRAS_CADASTRADAS;
    document.getElementById('obras-andamento').textContent = OBRAS_ANDAMENTO;
    document.getElementById('progress-bar-fill').style.width = taxa + '%';
    document.getElementById('progress-percent').textContent = taxa + '%';
}

function updateStats(tipo, change) {
    if (tipo === 'LIDAS') {
        OBRAS_LIDAS += change;
        if (OBRAS_LIDAS < 0) OBRAS_LIDAS = 0; 
    } else {
        OBRAS_CADASTRADAS += change;
        if (OBRAS_CADASTRADAS < 0) OBRAS_CADASTRADAS = 0; 
    }
    OBRAS_ANDAMENTO = Math.max(0, OBRAS_CADASTRADAS - OBRAS_LIDAS);
    saveStats();
    updateDisplay();
}

function toggleBackupPanel() {
    const panel = document.getElementById('backup-panel');
    panel.classList.toggle('backup-hidden');
    document.getElementById('backup-data').value = "";
}

function generateBackup() {
    const data = { lidas: OBRAS_LIDAS, cadastradas: OBRAS_CADASTRADAS };
    const jsonString = JSON.stringify(data);
    const area = document.getElementById('backup-data');
    area.value = jsonString;
    area.select();
    alert("Código gerado! Copie o texto que apareceu no campo.");
}

function restoreBackup() {
    let rawData = document.getElementById('backup-data').value.trim();
    if (!rawData) return alert("Cole o código primeiro.");

    try {
        const cleanData = rawData.replace(/[\u201C\u201D]/g, '"');
        const data = JSON.parse(cleanData);
        
        if (data.lidas !== undefined && data.cadastradas !== undefined) {
            OBRAS_LIDAS = parseInt(data.lidas);
            OBRAS_CADASTRADAS = parseInt(data.cadastradas);
            OBRAS_ANDAMENTO = Math.max(0, OBRAS_CADASTRADAS - OBRAS_LIDAS);
            
            saveStats();
            updateDisplay();
            toggleBackupPanel();
            alert("Restaurado com sucesso!");
        } else {
            alert("O código não contém os dados necessários.");
        }
    } catch (e) {
        alert("Erro ao ler código. Certifique-se de copiar o texto completo, incluindo as chaves { }.");
        console.error(e);
    }
}

loadStats();
updateDisplay();
