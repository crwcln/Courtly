const params = new URLSearchParams(window.location.search);
const sport = params.get("sport");

document.getElementById("sportTitle").innerText =
  sport.charAt(0).toUpperCase() + sport.slice(1);

let pointsA = 0; // 0=Love,1=15,2=30,3=40,4=Adv
let pointsB = 0;
let gamesA = 0;
let gamesB = 0;
let setsA = 0;
let setsB = 0;

const tennisPoints = ["Love", "15", "30", "40", "Adv"];

function addPoint(team) {
  if (sport !== "tennis") {
    // Keep original simple scoring for other sports
    if (team === "A") pointsA++;
    else pointsB++;
    document.getElementById("scoreA").innerText = pointsA;
    document.getElementById("scoreB").innerText = pointsB;
    return;
  }

  // Tennis logic
  if (team === "A") pointsA++;
  else pointsB++;

  // Handle Deuce / Advantage
  if (pointsA >= 3 && pointsB >= 3) {
    if (pointsA === pointsB) {
      // Deuce
      displayScore("Deuce", "Deuce");
      return;
    } else if (pointsA - pointsB === 1) {
      displayScore("Adv", "");
      return;
    } else if (pointsB - pointsA === 1) {
      displayScore("", "Adv");
      return;
    }
  }

  // Check if someone won the game
  if (pointsA >= 4 && pointsA - pointsB >= 2) {
    gamesA++;
    pointsA = 0;
    pointsB = 0;
  } else if (pointsB >= 4 && pointsB - pointsA >= 2) {
    gamesB++;
    pointsA = 0;
    pointsB = 0;
  }

  displayScore(tennisPoints[Math.min(pointsA, 3)], tennisPoints[Math.min(pointsB, 3)]);
  updateGames();
}

function displayScore(a, b) {
  document.getElementById("scoreA").innerText = a;
  document.getElementById("scoreB").innerText = b;
}

function updateGames() {
  // Update game display (optional, could add a new div for games)
  document.getElementById("gameScoreA")?.innerText = gamesA;
  document.getElementById("gameScoreB")?.innerText = gamesB;
}

function reset() {
  pointsA = pointsB = gamesA = gamesB = setsA = setsB = 0;
  displayScore("Love", "Love");
  updateGames();
}
