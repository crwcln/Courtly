// On Load, check if there's a saved favicon
window.onload = () => {
    const savedFavicon = localStorage.getItem('courtlyFavicon');
    if (savedFavicon) {
        document.getElementById('favicon').href = savedFavicon;
        document.getElementById('faviconInput').value = savedFavicon;
    }
};

// Score Logic
function changeScore(id, amount) {
    const element = document.getElementById(id);
    let currentScore = parseInt(element.innerText);
    if (currentScore + amount >= 0) {
        element.innerText = currentScore + amount;
    }
}

function resetScores() {
    if (confirm("Reset current match?")) {
        document.getElementById('score1').innerText = "0";
        document.getElementById('score2').innerText = "0";
    }
}

// Modal Logic
const modal = document.getElementById('settingsModal');
const settingsBtn = document.getElementById('settingsBtn');
const saveBtn = document.getElementById('saveSettings');

settingsBtn.onclick = () => modal.classList.remove('hidden');

saveBtn.onclick = () => {
    const url = document.getElementById('faviconInput').value;
    if (url) {
        document.getElementById('favicon').href = url;
        localStorage.setItem('courtlyFavicon', url); // Saves it for next time!
    }
    modal.classList.add('hidden');
};

// Close modal if clicking outside
window.onclick = (event) => {
    if (event.target == modal) modal.classList.add('hidden');
};
// Load History on Startup
window.onload = () => {
    loadFavicon();
    displayHistory();
};

function saveMatch() {
    const p1Name = document.querySelector('.p1-card .team-name').value;
    const p2Name = document.querySelector('.p2-card .team-name').value;
    const p1Score = document.getElementById('score1').innerText;
    const p2Score = document.getElementById('score2').innerText;

    if (p1Score === "0" && p2Score === "0") return;

    const matchRecord = {
        date: new Date().toLocaleDateString(),
        score: `${p1Name} ${p1Score} - ${p2Score} ${p2Name}`,
        winner: parseInt(p1Score) > parseInt(p2Score) ? p1Name : p2Name
    };

    // Get existing history or start new array
    const history = JSON.parse(localStorage.getItem('courtlyHistory') || '[]');
    history.unshift(matchRecord); // Add to start
    localStorage.setItem('courtlyHistory', JSON.stringify(history));

    displayHistory();
    resetScores();
}

function displayHistory() {
    const container = document.getElementById('historyLog');
    const history = JSON.parse(localStorage.getItem('courtlyHistory') || '[]');
    
    if (history.length === 0) {
        container.innerHTML = '<p class="empty-msg">No matches recorded yet.</p>';
        return;
    }

    container.innerHTML = history.map(match => `
        <div class="history-entry">
            <span>${match.date}</span>
            <span>${match.score}</span>
            <span>Winner: ${match.winner}</span>
        </div>
    `).join('');
}

function clearHistory() {
    if (confirm("Delete all match history?")) {
        localStorage.removeItem('courtlyHistory');
        displayHistory();
    }
}

function loadFavicon() {
    const savedFavicon = localStorage.getItem('courtlyFavicon');
    if (savedFavicon) {
        document.getElementById('favicon').href = savedFavicon;
        document.getElementById('faviconInput').value = savedFavicon;
    }
}
