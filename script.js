let historyStack = [];

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function changeScore(id, amount) {
    saveState();
    const el = document.getElementById(id);
    let val = parseInt(el.innerText) + amount;
    if (val >= 0) el.innerText = val;
}

function setServer(num) {
    saveState();
    document.getElementById('serve1').classList.toggle('hidden', num !== 1);
    document.getElementById('serve2').classList.toggle('hidden', num !== 2);
}

function saveState() {
    historyStack.push({
        s1: document.getElementById('score1').innerText,
        s2: document.getElementById('score2').innerText,
        serv1: document.getElementById('serve1').classList.contains('hidden'),
        serv2: document.getElementById('serve2').classList.contains('hidden')
    });
}

function undo() {
    if (historyStack.length === 0) return;
    const last = historyStack.pop();
    document.getElementById('score1').innerText = last.s1;
    document.getElementById('score2').innerText = last.s2;
    document.getElementById('serve1').classList.toggle('hidden', last.serv1);
    document.getElementById('serve2').classList.toggle('hidden', last.serv2);
}

function swapSides() {
    const board = document.getElementById('board');
    board.style.flexDirection = board.style.flexDirection === 'row-reverse' ? 'row' : 'row-reverse';
}

function applyFavicon() {
    const url = document.getElementById('faviconInput').value;
    if (url) {
        document.getElementById('favicon').href = url;
        localStorage.setItem('courtlyFavicon', url);
        toggleSidebar();
    }
}

// Load saved favicon on start
window.onload = () => {
    const saved = localStorage.getItem('courtlyFavicon');
    if (saved) document.getElementById('favicon').href = saved;
};