const CATEGORIES = ["squad","gender","magic","grimoire","origin","rank"];
const MAX_GUESSES = Infinity;

let guesses = [];
let gameOver = false;

// ============================================================
// UI FUNCTIONS (reuse yours)
// ============================================================

function addRow(char, results) {
  const row = document.createElement("div");
  row.className = "guess-row";
  row.style.gridTemplateColumns = "160px repeat(6, 1fr)";

  const nc = document.createElement("div");
  nc.className = "cell cell-name";
  nc.textContent = char.name;
  row.appendChild(nc);

  CATEGORIES.forEach((cat, i) => {
    const c = document.createElement("div");
    c.className =
      "cell " +
      (results[i] === "correct"
        ? "cell-correct"
        : results[i] === "partial"
        ? "cell-partial"
        : "cell-wrong");

    c.textContent = char[cat];
    row.appendChild(c);
  });

  document.getElementById("guesses").appendChild(row);
}

function updateAttempts() {
  document.getElementById("attempts-badge").textContent =
    gameOver ? "" : `${guesses.length} guesses`;
}

// ============================================================
// API CALL
// ============================================================

async function submitGuess(name) {
  if (gameOver) return;

  const res = await fetch("/api/guess", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name })
  });

  if (!res.ok) {
    shake();
    return;
  }

  const data = await res.json();

  addRow(data.data, data.result);

  guesses.push(name);

  if (data.correct) {
    endGame(true, data.data.name);
  }

  updateAttempts();
}

// ============================================================
// GAME END
// ============================================================

function endGame(won, name) {
  gameOver = true;

  const banner = document.getElementById("result-banner");
  banner.style.display = "block";

  if (won) {
    banner.className = "win";
    banner.innerHTML = `🍀 Correct! It was <strong>${name}</strong>`;
  } else {
    banner.className = "lose";
    banner.innerHTML = `😔 You lost`;
  }
}

// ============================================================
// INPUT HANDLING
// ============================================================

document.getElementById("guess-btn").addEventListener("click", () => {
  const input = document.getElementById("search-input");
  submitGuess(input.value.trim());
  input.value = "";
});

document.getElementById("search-input").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    submitGuess(e.target.value.trim());
    e.target.value = "";
  }
});

function shake() {
  const inp = document.getElementById("search-input");
  inp.style.animation = "none";
  inp.offsetHeight;
  inp.style.animation = "shake 0.4s ease";
}