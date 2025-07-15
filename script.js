const gameData = [
  {
    topic: "Ministrantské znalosti",
    questions: [
      { value: 100, question: "Co to je? <br><img src='lavabo.jpg' alt='obrázek' style='max-width:100%; max-height: 600px; height:auto;'>", answer: "Lavábo" },
      { value: 200, question: "Co to je? <br><img src='purifikatorium.jpg' alt='obrázek' style='max-width:100%; max-height: 600px; height:auto;'>", answer: "Purifikatorium" },
      { value: 300, question: "Jak se nazývá kniha, ze které se čte evangelium?", answer: "Lekcionář nebo evangeliář" },
      { value: 400, question: "Jaké jsou liturgické barvy používané při mši?", answer: "růžová, červená, zelená, bílá, fialová" },
      { value: 500, question: "Jaký je symbolický význam kadidla?", answer: "Stoupající modlitby k Bohu" }
    ]
  },
  {
    topic: "Uhádni vedoucího",
    questions: [
      { value: 100, question: "Kdy byla bitva na Bílé hoře?", answer: "1620" },
      { value: 200, question: "Kdo byl prvním prezidentem ČSR?", answer: "T. G. Masaryk" },
      { value: 300, question: "Ve kterém roce skončila 2. světová válka?", answer: "1945" },
      { value: 400, question: "Kdy začala 1. světová válka?", answer: "1914" },
      { value: 500, question: "Kdo vedl husitské vojsko?", answer: "Jan Žižka" }
    ]
  },
  {
    topic: "Poznej ministranta",
    questions: [
      { value: 100, question: "Hlavní město Francie?", answer: "Paříž" },
      { value: 200, question: "Největší oceán na světě?", answer: "Tichý oceán" },
      { value: 300, question: "Nejvyšší hora světa?", answer: "Mount Everest" },
      { value: 400, question: "Který stát má nejvíce obyvatel?", answer: "Čína" },
      { value: 500, question: "Kde leží Viktoriino jezero?", answer: "Afrika" }
    ]
  },
  {
    topic: "Poznej film (hláška)",
    questions: [
      { value: 100, question: "Jaké je největší zvíře?", answer: "Modrá velryba" },
      { value: 200, question: "Jaký je nejrychlejší suchozemský savec?", answer: "Gepard" },
      { value: 300, question: "Kolik má pavouk nohou?", answer: "8" },
      { value: 400, question: "Který pták neumí létat?", answer: "Pštros" },
      { value: 500, question: "Jak dlouho trvá březost slona?", answer: "22 měsíců" }
    ]
  },
  {
    topic: "Poznej film (song)",
    questions: [
      { value: 100, question: "Kdo napsal Máj?", answer: "Karel Hynek Mácha" },
      { value: 200, question: "Kdo je autorem Malého prince?", answer: "Antoine de Saint-Exupéry" },
      { value: 300, question: "Autor R.U.R.?", answer: "Karel Čapek" },
      { value: 400, question: "Kdo napsal Kytici?", answer: "Karel Jaromír Erben" },
      { value: 500, question: "Autorka Harryho Pottera?", answer: "J. K. Rowlingová" }
    ]
  }
];

const teams = ["Tým 1", "Tým 2", "Tým 3", "Tým 4", "Tým 5"];
const teamColors = {
  "Tým 1": "#dc2626",
  "Tým 2": "#2563eb",
  "Tým 3": "#16a34a",
  "Tým 4": "#eab308",
  "Tým 5": "#db2777"
};
const teamScores = Object.fromEntries(teams.map(t => [t, 0]));

const board = document.getElementById("board");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const scores = document.getElementById("scores");

teams.forEach(team => {
  const div = document.createElement("div");
  div.className = "team-score";
  div.style.color = teamColors[team];
  div.id = `${team}-score`;
  div.innerText = `${team}: 0 bodů`;
  scores.appendChild(div);
});

gameData.forEach(category => {
  const column = document.createElement("div");
  column.className = "column";

  const title = document.createElement("div");
  title.className = "category-title";
  title.innerText = category.topic;
  column.appendChild(title);

  category.questions.forEach(q => {
    const btn = document.createElement("button");
    btn.className = "card";
    btn.innerText = q.value;
    btn.onclick = () => showQuestion(q, btn);
    column.appendChild(btn);
  });

  board.appendChild(column);
});

function showQuestion(question, btn) {
  modalContent.innerHTML = "";

  const questionText = document.createElement("div");
  questionText.className = "question-text";
  questionText.innerHTML = question.question;
  modalContent.appendChild(questionText);

  // Odpověď (skrytá)
  const answerText = document.createElement("div");
  answerText.className = "correct-answer hidden";
  answerText.innerHTML = `Správná odpověď: ${question.answer}`;
  modalContent.appendChild(answerText);

  const showAnswerBtn = document.createElement("button");
  showAnswerBtn.innerText = "Zobrazit správnou odpověď";
  showAnswerBtn.className = "show-answer-btn";
  showAnswerBtn.onclick = () => {
    answerText.classList.remove("hidden");
    answerText.classList.add("animated");
  };
  modalContent.appendChild(showAnswerBtn);

  const teamChoice = document.createElement("div");
  teamChoice.className = "team-choice";

  [...teams, "Nikdo"].forEach(team => {
    const tbtn = document.createElement("button");
    tbtn.innerText = team;
    tbtn.style.backgroundColor = team === "Nikdo" ? "#ccc" : teamColors[team];
    tbtn.style.color = "white";
    tbtn.onclick = () => {
      if (team !== "Nikdo") {
        teamScores[team] += question.value;
        const teamScore = document.getElementById(`${team}-score`);
        teamScore.innerText = `${team}: ${teamScores[team]} bodů`;

        teamScore.classList.add("highlighted");
        setTimeout(() => teamScore.classList.remove("highlighted"), 1000);
      }
      btn.classList.add("used");
      closeModal();
      checkGameEnd();
    };
    teamChoice.appendChild(tbtn);
  });

  modalContent.appendChild(teamChoice);

  const closeBtn = document.createElement("button");
  closeBtn.innerText = "Zavřít";
  closeBtn.className = "close-btn";
  closeBtn.onclick = () => closeModal();
  modalContent.appendChild(closeBtn);

  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

function checkGameEnd() {
  const allCards = document.querySelectorAll(".card");
  const allUsed = Array.from(allCards).every(card => card.classList.contains("used"));
  if (allUsed) showResults();
}

function showResults() {
  const sortedTeams = Object.entries(teamScores)
    .sort((a, b) => b[1] - a[1]);

  const endModal = document.getElementById("endgame-modal");
  endModal.innerHTML = "";

  const content = document.createElement("div");
  content.className = "modal-content";

  const title = document.createElement("h2");
  title.innerText = "Konec hry – Výsledky";
  content.appendChild(title);

  const list = document.createElement("ol");
  sortedTeams.forEach(([team, score]) => {
    const li = document.createElement("li");
    li.innerText = `${team}: ${score} bodů`;
    li.style.color = teamColors[team];
    li.style.marginBottom = "8px";
    list.appendChild(li);
  });

  content.appendChild(list);

  const btnClose = document.createElement("button");
  btnClose.innerText = "Zavřít";
  btnClose.className = "close-btn";
  btnClose.onclick = () => {
    endModal.classList.add("hidden");
  };
  content.appendChild(btnClose);

  endModal.appendChild(content);
  endModal.classList.remove("hidden");
}
