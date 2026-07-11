"use strict";

const questionCard = document.getElementById("questionCard");
const successCard = document.getElementById("successCard");
const buttonArea = document.getElementById("buttonArea");

const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const replayButton = document.getElementById("replayButton");

const buttonMessage = document.getElementById("buttonMessage");
const confettiContainer = document.getElementById(
  "confettiContainer"
);

const escapeMessages = [
  "Não appears to be unavailable in Paraíba.",
  "The capybara respectfully disagrees.",
  "Nice try.",
  "Peça ajuda à Pretinha para clicar!",
  "This button is now hiding near Cabo Branco.",
  "The capybara saw your finger approaching.",
  "Como está o seu nariz agora?",   
  "Não has temporarily left João Pessoa.",
  "Please select the emotionally correct answer.",
  "That option has been rejected by international law.",
  "The button has escaped to India.",
  "Too slow. Muito devagar.",
  "Você está ficando mais rápido!"
];

const capybaraTrack = document.getElementById("capybaraTrack");
const floatingCapybara = document.getElementById(
  "floatingCapybara"
);

let capybaraMovementTimer = null;
let capybaraPosition = 0;

let escapeCount = 0;

function randomNumber(minimum, maximum) {
  return Math.random() * (maximum - minimum) + minimum;
}

function moveNoButton() {
  const areaRectangle = buttonArea.getBoundingClientRect();
  const buttonRectangle = noButton.getBoundingClientRect();

  const maximumX = Math.max(
    0,
    areaRectangle.width - buttonRectangle.width
  );

  const maximumY = Math.max(
    0,
    areaRectangle.height - buttonRectangle.height
  );

  const randomX = randomNumber(0, maximumX);
  const randomY = randomNumber(0, maximumY);

  noButton.style.left = `${randomX}px`;
  noButton.style.top = `${randomY}px`;
  noButton.style.transform = "none";

  buttonMessage.textContent =
    escapeMessages[escapeCount % escapeMessages.length];

  escapeCount += 1;
}

function handlePointerMovement(event) {
  const buttonRectangle = noButton.getBoundingClientRect();

  const buttonCentreX =
    buttonRectangle.left + buttonRectangle.width / 2;

  const buttonCentreY =
    buttonRectangle.top + buttonRectangle.height / 2;

  const horizontalDistance = event.clientX - buttonCentreX;
  const verticalDistance = event.clientY - buttonCentreY;

  const distance = Math.sqrt(
    horizontalDistance ** 2 + verticalDistance ** 2
  );

  if (distance < 95) {
    moveNoButton();
  }
}

buttonArea.addEventListener(
  "pointermove",
  handlePointerMovement
);

noButton.addEventListener("mouseenter", moveNoButton);

noButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  moveNoButton();
});

noButton.addEventListener(
  "touchstart",
  (event) => {
    event.preventDefault();
    moveNoButton();
  },
  { passive: false }
);

noButton.addEventListener("focus", moveNoButton);

noButton.addEventListener("click", (event) => {
  event.preventDefault();
  moveNoButton();
});

function createConfettiPiece() {
  const piece = document.createElement("span");

  const colours = [
    "#f5c842",
    "#ef8b2c",
    "#16884b",
    "#2878b8",
    "#e95e7d",
    "#ffffff"
  ];

  piece.className = "confetti";

  piece.style.left = `${Math.random() * 100}vw`;

  piece.style.backgroundColor =
    colours[Math.floor(Math.random() * colours.length)];

  piece.style.animationDuration =
    `${randomNumber(2.5, 4.5)}s`;

  piece.style.animationDelay =
    `${randomNumber(0, 0.3)}s`;

  confettiContainer.appendChild(piece);

  window.setTimeout(() => {
    piece.remove();
  }, 5000);
}

function launchConfetti() {
  if (!confettiContainer) return;

  confettiContainer.innerHTML = "";

  const startTime = Date.now();

  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime;

    let pieces = 8;

    if (elapsed > 15000) pieces = 6;
    if (elapsed > 30000) pieces = 4;
    if (elapsed > 45000) pieces = 2;

    for (let i = 0; i < pieces; i++) {
      createConfettiPiece();
    }

    if (elapsed >= 60000) {
      clearInterval(interval);
    }
  }, 250);
}

function showSuccess() {
  questionCard.classList.add("hidden");
  successCard.classList.remove("hidden");

  document.title = "Sim! 🌻";

  launchConfetti();

  /*
    Wait for the answer screen to become visible
    before measuring the movement area.
  */
  window.requestAnimationFrame(() => {
    startFloatingCapybara();
  });
}
function resetQuestion() {
  stopFloatingCapybara();

  successCard.classList.add("hidden");
  questionCard.classList.remove("hidden");

  noButton.style.left = "";
  noButton.style.top = "";
  noButton.style.transform = "";

  buttonMessage.textContent =
    "The capybara believes there is only one sensible answer.";

  escapeCount = 0;
  document.title = "A Question for You";
}

function moveFloatingCapybara() {
  if (!capybaraTrack || !floatingCapybara) {
    return;
  }

  const trackWidth = capybaraTrack.clientWidth;
  const capybaraWidth = floatingCapybara.offsetWidth;

  const maximumPosition = Math.max(
    0,
    trackWidth - capybaraWidth
  );

  const newPosition =
    Math.random() * maximumPosition;

  const movingRight = newPosition > capybaraPosition;

  floatingCapybara.style.left = `${newPosition}px`;

  /*
    Flip the capybara so it faces the direction
    in which it is moving.
  */
  floatingCapybara.style.transform =
    movingRight ? "scaleX(1)" : "scaleX(-1)";

  capybaraPosition = newPosition;

  /*
    Random delay between approximately
    1.5 and 3.2 seconds.
  */
  const nextDelay =
    1500 + Math.random() * 1700;

  capybaraMovementTimer = window.setTimeout(
    moveFloatingCapybara,
    nextDelay
  );
}

function startFloatingCapybara() {
  window.clearTimeout(capybaraMovementTimer);

  capybaraPosition = 0;
  floatingCapybara.style.left = "0px";
  floatingCapybara.style.transform = "scaleX(1)";

  capybaraMovementTimer = window.setTimeout(
    moveFloatingCapybara,
    300
  );
}

function stopFloatingCapybara() {
  window.clearTimeout(capybaraMovementTimer);
  capybaraMovementTimer = null;
}

yesButton.addEventListener("click", showSuccess);
replayButton.addEventListener("click", resetQuestion);
