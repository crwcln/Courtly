window.onload = function() {
    const appVersion = "1.0.6"; // PICK VERSION
    const versionDisplay = document.getElementById('version-tag');
    if (versionDisplay) {
        versionDisplay.innerText = "Build: " + appVersion;
    }
    const loader = document.getElementById('loader');
    const loaderText = loader.querySelector('p'); // Finds the <p> inside the loader

    // Your list of random phrases
    const phrases = [
        "Preparing the Court...",
        "Inflating the Pickleball...",
        "Cleaning the Kitchen...",
        "Checking the Net Height...",
        "Finding a Fourth Player...",
        "Hydrating for the Match...",
        "Dinking in Progress...",
        "Finding the kitchen...",
        "Checking NVZ violations...",
        "Dinks loading...",
        "Adjusting paddle grip...",
        "Warming up the dinks...",
        "Serving underhand (obviously)...", 
        "Calibrating soft game...",
        "Locating third shot drop...",
        "Avoiding the kitchen (mostly)...",
    ];

    // Pick a random one
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    // Set the text
    if (loaderText) {
        loaderText.innerText = randomPhrase;
    }

    // Existing fade-out logic
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 5000); // Set this to your preferred loading time
    }
};
let historyStack = [];
let targetScore = 11;
let currentMode = 'pickleball';
const tennisPoints = ["0", "15", "30", "40", "AD"];
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
    console.log("Mobile optimization active");
    // You could trigger haptic feedback here later
}

// --- UI CONTROLS ---
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); }

function toggleDropdown(id) {
    const el = document.getElementById(id);
    document.querySelectorAll('.select-options').forEach(opt => { if(opt.id !== id) opt.classList.add('hidden'); });
    el.classList.toggle('hidden');
}

// --- GAME SETTINGS ---
function selectMode(val, label) {
    currentMode = val;
    document.getElementById('selectedMode').innerText = label;
    document.getElementById('modeOptions').classList.add('hidden');
    document.getElementById('targetScoreGroup').classList.toggle('hidden', val === 'tennis');
    resetScores();
}

function setTargetScore(val) {
    targetScore = parseInt(val);
    document.getElementById('selectedScore').innerText = val;
    document.getElementById('scoreOptions').classList.add('hidden');
    document.getElementById('customScoreInput').classList.add('hidden');
    resetScores();
}

// --- SCORING LOGIC ---
function changeScore(teamId, amount) {
    // 1. SAVE the current state BEFORE changing anything
    historyStack.push({
        s1: document.getElementById('score1').innerText,
        s2: document.getElementById('score2').innerText,
        v1: document.getElementById('serve1').classList.contains('hidden'),
        v2: document.getElementById('serve2').classList.contains('hidden')
    });

    // 2. NOW change the score
    let scoreElem = document.getElementById(teamId);
    let current = parseInt(scoreElem.innerText);
    if (current + amount >= 0) {
        scoreElem.innerText = current + amount;
    }
}
function handleTennisScore(el, amount) {
    let index = tennisPoints.indexOf(el.innerText);
    if (amount > 0) {
        if (index < tennisPoints.length - 1) el.innerText = tennisPoints[index + 1];
        else finalizeGame(el.previousElementSibling.previousElementSibling.value);
    } else if (index > 0) el.innerText = tennisPoints[index - 1];
}

function checkLogic() {
    const s1 = (currentMode === 'tennis') ? 0 : parseInt(document.getElementById('score1').innerText);
    const s2 = (currentMode === 'tennis') ? 0 : parseInt(document.getElementById('score2').innerText);
    
    const card1 = document.getElementById('card1');
    const card2 = document.getElementById('card2');
    card1.classList.remove('match-point-card');
    card2.classList.remove('match-point-card');

    if (currentMode !== 'tennis') {
        if (s1 >= targetScore - 1 || s2 >= targetScore - 1) {
            if (s1 >= targetScore || s2 >= targetScore) {
                if (Math.abs(s1 - s2) < 2) showDecisionModal();
                else finalizeGame(s1 > s2 ? "HOME" : "AWAY");
            }
            if (s1 >= targetScore - 1 && s1 > s2) card1.classList.add('match-point-card');
            if (s2 >= targetScore - 1 && s2 > s1) card2.classList.add('match-point-card');
        }
    }
}

// --- MODALS & ALERTS ---
function showDecisionModal() { document.getElementById('decisionModal').classList.remove('hidden'); }

function applyWinByTwo(confirm) {
    document.getElementById('decisionModal').classList.add('hidden');
    if (!confirm) {
        const s1 = parseInt(document.getElementById('score1').innerText);
        finalizeGame(s1 > parseInt(document.getElementById('score2').innerText) ? "HOME" : "AWAY");
    }
}

function showAlert(title, msg) {
    document.getElementById('alertTitle').innerText = title.toUpperCase();
    document.getElementById('alertMessage').innerText = msg;
    const modal = document.getElementById('customAlert');
    
    modal.classList.remove('hidden');

    // Optional: Auto-hide after 4 seconds so the user doesn't have to click X
    setTimeout(() => {
        closeAlert();
    }, 4000);
}

function closeAlert() {
    const modal = document.getElementById('customAlert');
    // Add a slight slide-out animation before hiding
    modal.style.opacity = '0';
    modal.children[0].style.transform = 'translateX(100%)';
    
    setTimeout(() => {
        modal.classList.add('hidden');
        // Reset styles for next time
        modal.style.opacity = '1';
        modal.children[0].style.transform = 'translateX(0)';
    }, 300);
}

// --- ENGINE ---
function setServer(num) {
    document.getElementById('serve1').classList.toggle('hidden', num !== 1);
    document.getElementById('serve2').classList.toggle('hidden', num !== 2);
}

function swapSides() {
    const board = document.getElementById('board');
    board.style.flexDirection = board.style.flexDirection === 'row-reverse' ? 'row' : 'row-reverse';
}

function saveState() {
    historyStack.push({
        s1: document.getElementById('score1').innerText,
        s2: document.getElementById('score2').innerText,
        v1: document.getElementById('serve1').classList.contains('hidden'),
        v2: document.getElementById('serve2').classList.contains('hidden')
    });
}

function undo() {
    if (historyStack.length === 0) return;
    const last = historyStack.pop();
    document.getElementById('score1').innerText = last.s1;
    document.getElementById('score2').innerText = last.s2;
    document.getElementById('serve1').classList.toggle('hidden', last.v1);
    document.getElementById('serve2').classList.toggle('hidden', last.v2);
}

function finalizeGame(winner) { showAlert("Game Over", winner + " Wins!"); resetScores(); }

function resetScores() {
    document.getElementById('score1').innerText = "0";
    document.getElementById('score2').innerText = "0";
}
function triggerVibration() {
    const isVibrateEnabled = document.getElementById('vibrateToggle').checked;
    
    // Check if the browser supports vibration and if user enabled it
    if ("vibrate" in navigator && isVibrateEnabled) {
        navigator.vibrate(50); // A short 50ms pulse
    }
}

// Update your existing score function to include the vibration
function changeScore(scoreId, amount) {
    const scoreElement = document.getElementById(scoreId);
    let currentScore = parseInt(scoreElement.innerText);
    
    // Prevent negative scores
    if (currentScore + amount >= 0) {
        scoreElement.innerText = currentScore + amount;
    }
}
    // ... your existing score logic ...
    
    // Trigger the buzz
    triggerVibration();
    
    // Check logic for wins/alerts
    checkLogic();
// Close dropdowns when clicking outside
window.onclick = function(event) {
    if (!event.target.closest('.custom-select')) {
        const dropdowns = document.getElementsByClassName("select-options");
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.add('hidden');
        }
    }
}

// Enhance the toggle function to rotate the arrow
function toggleDropdown(id) {
    const el = document.getElementById(id);
    const isOpening = el.classList.contains('hidden');
    
    // Close all other dropdowns first
    document.querySelectorAll('.select-options').forEach(opt => opt.classList.add('hidden'));
    
    if (isOpening) {
        el.classList.remove('hidden');
    }
}
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        const panel = document.getElementById('sidebar'); // Double check this ID!
        const overlay = document.getElementById('overlay');
        
        // The Fix: Check if panel exists first
        if (panel && !panel.classList.contains('hidden')) {
            toggleSettings();
        }
    }
});