const teams = ["Tým 1", "Tým 2", "Tým 3", "Tým 4", "Tým 5"];
const teamScores = {};
let currentPoints = 0;

const questions = {
  "Historie": {
    "100": "Kdy začala 2. světová válka?",
    "200": "Kdo byl prvním československým prezidentem?",
    "300": "Kdy byla podepsána Mnichovská dohoda?",
    "400": "Kdo vedl husity?",
    "500": "Ve kterém roce skončila 1. světová válka?"
  },
  "Věda": {
    "100": "Kolik nohou má pavouk?",
    "200": "Co je H2O?",
    "300": "Jak se jmenuje největší planeta sluneční soustavy?",
    "400": "Kdo vynalezl žárovku?",
    "500": "Jaký je chemický prvek Au?"
  },
  "Sport": {
    "100": "Kolik hráčů je v jednom fotbalovém týmu?",
    "200": "Ve kterém sportu se používá pálka a míček?",
    "300": "Jak se jmenuje slavný český hokejista s číslem 68?",
    "400": "Kde se konaly olympijské hry 2016?",
    "500": "Kolik prstenů je na logu olympiády?"
  },
  "Příroda": {
    "100": "Jaký je největší savec na světě?",
    "200": "Který strom je národní strom ČR?",
    "300": "Jak se nazývá mládě lišky?",
    "400": "Co je to fotosyntéza?",
    "500": "Kde roste bambus přirozeně?"
  },
  "Kultura": {
    "100": "Kdo napsal Babičku?",
    "200": "Jaké je hlavní město Francie?",
    "300": "Kdo složil Českou hymnu?",
    "400": "Kdo je autorem obrazu Mona Lisa?",
    "500": "Jak se jmenuje slavná divadelní scéna v Praze?"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Inicializace skóre týmů
  const scoreboard = document.getElementById("scoreboard");
  teams.forEach(team => {
    teamScores[team] = 0;
    const div = document.createElement("div");
    div.className = "team-score";
    div.id = `score-${team}`;
    div.innerText = `${team}: 0 bodů`;
    scoreboard.appendChild(div);
  });

  renderBoard();

  // Zavírací tlačítko modálu
  document.getElementById("close-question").onclick = () => {
    closeModal();
  };
});

function renderBoard() {
  const board = document.getElementById("game-board");
  board.innerHTML = "";

  Object.keys(questions).forEach(category => {
    const column = document.createElement("div");
    column.className = "category-column";

    // Nadpis kategorie
    const title = document.createElement("div");
    title.className = "category-title";
    title.innerText = category;
    column.appendChild(title);

    // Přidání tlačítek s body vertikálně (100-500)
    const sortedPoints = Object.keys(questions[category]).sort((a, b) => a - b);

    sortedPoints.forEach(points => {
      const btn = document.createElement("div");
      btn.className = "card";
      btn.innerText = points;
      btn.dataset.category = category;
      btn.dataset.points = points;

      btn.addEventListener("click", () => {
        if (btn.classList.contains("used")) return;

        currentPoints = parseInt(points);
        const questionText = questions[category][points];
        document.getElementById("question-text").innerText = questionText;

        const teamBtns = document.getElementById("team-buttons");
        teamBtns.innerHTML = "";

        teams.forEach(team => {
          const tbtn = document.createElement("button");
          tbtn.innerText = team;
          tbtn.onclick = () => {
            teamScores[team] += currentPoints;
            document.getElementById(`score-${team}`).innerText =
              `${team}: ${teamScores[team]} bodů`;
            btn.classList.add("used");
            closeModal();
            checkGameEnd();

          };
          teamBtns.appendChild(tbtn);
        });

        const noOneBtn = document.createElement("button");
        noOneBtn.innerText = "Nikdo";
        noOneBtn.style.backgroundColor = "#6b7280";
        noOneBtn.onclick = () => {
          btn.classList.add("used");
          closeModal();
        };
        teamBtns.appendChild(noOneBtn);

        document.getElementById("question-modal").classList.remove("hidden");
      });

      column.appendChild(btn);
    });

    board.appendChild(column);
  });
}

function closeModal() {
  document.getElementById("question-modal").classList.add("hidden");
}
function checkGameEnd() {
  // Najdi všechny otázky na desce
  const allCards = document.querySelectorAll(".card");
  const allUsed = Array.from(allCards).every(card => card.classList.contains("used"));

  if (allUsed) {
    showResults();
  }
}

function showResults() {
  const sortedTeams = Object.entries(teamScores)
    .sort((a, b) => b[1] - a[1]);

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const title = document.createElement("h2");
  title.innerText = "Konec hry - výsledky";
  modalContent.appendChild(title);

  const list = document.createElement("ol");
  list.style.textAlign = "left";
  list.style.margin = "20px 0";

  sortedTeams.forEach(([team, score]) => {
    const li = document.createElement("li");
    li.innerText = `${team}: ${score} bodů`;
    li.style.marginBottom = "8px";
    li.style.color = teamColors[team];  // tady barva týmu
    list.appendChild(li);
  });

  modalContent.appendChild(list);

  const btnClose = document.createElement("button");
  btnClose.innerText = "Zavřít";
  btnClose.style.marginTop = "20px";
  btnClose.style.padding = "10px 25px";
  btnClose.style.border = "none";
  btnClose.style.borderRadius = "10px";
  btnClose.style.backgroundColor = "#2563eb";
  btnClose.style.color = "white";
  btnClose.style.fontWeight = "600";
  btnClose.style.cursor = "pointer";

  btnClose.onclick = () => {
    document.getElementById("endgame-modal").classList.add("hidden");
  };
  modalContent.appendChild(btnClose);

  const endModal = document.getElementById("endgame-modal");
  endModal.innerHTML = "";
  endModal.appendChild(modalContent);
  endModal.classList.remove("hidden");
}


// V modálním tlačítku při správné odpovědi i "nikdo" přidej checkGameEnd() za closeModal()
const teamColors = {
  "Tým 1": "#dc2626", // červená
  "Tým 2": "#2563eb", // modrá
  "Tým 3": "#16a34a", // zelená
  "Tým 4": "#eab308", // žlutá
  "Tým 5": "#db2777"  // růžová
};