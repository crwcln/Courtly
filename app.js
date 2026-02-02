const params = new URLSearchParams(window.location.search);
const sport = params.get("sport");

document.getElementById("sportTitle").innerText =
  sport.charAt(0).toUpperCase() + sport.slice(1);

let scoreA = 0;
let scoreB = 0;

function addPoint(team) {
  if (team === "A") scoreA++;
  else scoreB++;

  document.getElementById("scoreA").innerText = scoreA;
  document.getElementById("scoreB").innerText = scoreB;
}

function reset() {
  scoreA = 0;
  scoreB = 0;
  document.getElementById("scoreA").innerText = 0;
  document.getElementById("scoreB").innerText = 0;
}
