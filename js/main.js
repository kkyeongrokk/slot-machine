/*----- constants -----*/
const PROBABILITY_LOOKUP = [
  "c",
  "c",
  "c",
  "c",
  "c",
  "g",
  "g",
  "g",
  "g",
  "g",
  "g",
  "d",
  "d",
  "w",
  "w",
  "w",
  "w",
  "w",
  "w",
  "w",
  "s",
];
// 'c' -> cherry, 'g' -> grape, 'd' -> diamond, etc.
// In the above example, a cherry should come up 4 times as often as a diamond...

const REELIMGS_LOOKUP = {
  s: { img: "img/777.png", payoutFactor: 10 },
  c: { img: "img/cherry.png", payoutFactor: 1.5 },
  d: { img: "img/diamond.png", payoutFactor: 5 },
  g: { img: "img/grape.png", payoutFactor: 1 },
  w: { img: "img/watermelon.png", payoutFactor: 0.8 },
};

/*----- state variables -----*/
let accMoney;
let betPerSpin;
let highScore;
let reels;
let moneyWon;

/*----- cached elements  -----*/
const highScoreEl = document.getElementById("high-score");
const reelEls = document.querySelectorAll(".reel");
const soundBtn = document.getElementById('mute');
const moneyLeftEl = document.getElementById("status-bar-money-left");
const wonMoneyEl = document.getElementById("status-bar-won-money");
const betPerSpinEl = document.querySelector("#bet-money div:first-child");
const addMoneyBtn = document.getElementById("add-money-btn");
const addMoneyEl = document.getElementById("add-money");
const soundEls = document.querySelectorAll("audio");
const spinBtn = document.getElementById("spin-btn");
const withdrawBtn = document.getElementById("withdraw-btn");
const betMoneyEls = [
  ...document.querySelectorAll("#bet-money div:first-child > button"),
];

/*----- event listeners -----*/
spinBtn.addEventListener("click", handleSpin);
addMoneyBtn.addEventListener("click", handleAddMoney);
withdrawBtn.addEventListener("click", handleWithdraw);
betPerSpinEl.addEventListener("click", handleBetPerSpin);
soundBtn.addEventListener("click", handleSound);

/*----- functions -----*/
init();

function init() {
  // You can still win money from the last spin by having initialize value of 0.1
  accMoney = 0.1;
  betPerSpin = 15;
  highScore = 0;
  reels = ["s", "s", "s"];

  render();
}

/*************************** HANDLERS ***************************/
function handleSpin() {
  // guard to not spin when the user have not enough money
  if (accMoney < betPerSpin || accMoney === 0) {
    moneyLeftEl.innerText = "Insert Money";
    return;
  }

  accMoney -= betPerSpin;
  randomPattern();
  moneyWon = winMoney();
  highScore = moneyWon > highScore ? moneyWon : highScore;
  playSound("#spin-btn > audio");

  flashRandomSymbols(render);
}

function handleBetPerSpin(evt) {
  //Guard
  if (evt.target.tagName !== "BUTTON") return;
  
  betMoneyEls.forEach(function (betMoneyBtn) {
    if (betMoneyBtn.classList.contains("active"))
      betMoneyBtn.classList.remove("active");
  });
  evt.target.classList.add("active");

  betPerSpin = parseInt(
    evt.target.innerText.replace(evt.target.innerText[0], "")
  );
}

function handleWithdraw() {
  if (accMoney === 0) return;

  playSound("#withdraw-btn > audio");
  moneyLeftEl.innerText = `Withdrawing $${accMoney}`;
  accMoney = 0;
}

function handleAddMoney() {
  // Guards
  if (addMoneyEl.value === "") return;

  if (addMoneyEl.value < 0) {
    addMoneyEl.value = "";
    return;
  }

  playSound("#add-money-btn > audio");
  accMoney += parseInt(addMoneyEl.value);
  accMoney = Math.floor(accMoney);
  addMoneyEl.value = "";
  moneyLeftEl.innerText = `$${accMoney} left in your account!`;
}

function handleSound() {
  const soundImg = document.getElementById("on-off");
  soundImg.src = soundImg.src.includes("img/sound.png")
    ? "img/speaker-filled-audio-tool.png"
    : "img/sound.png";
  soundEls.forEach(function (el) {
    el.muted = !el.muted;
  });
}

/*************************** Other Functions ***************************/
function playSound(query) {
  const sound = document.querySelector(query);
  sound.play();
}

function flashRandomSymbols(cb) {
  const TICK_RESOLUTION = 50;
  const MAX_TICKS = 40;
  let tickCount = 0;

  const timerId = setInterval(function () {
    for (let i = 0; i < 3; i++) {
      const reelEl = reelEls[i];
      let randIdx = Math.floor(Math.random() * PROBABILITY_LOOKUP.length);
      let symbol = PROBABILITY_LOOKUP[randIdx];
      reelEl.innerHTML = `<img src="${REELIMGS_LOOKUP[symbol].img}" >`;
    }

    // Generate a random symbol for the cur reel
    // Update reelEl's image to the random symbol
    tickCount++;
    if (tickCount > MAX_TICKS) {
      clearInterval(timerId);
      cb();
    }
  }, TICK_RESOLUTION);
}

// Randomly generate images for reels
function randomPattern() {
  for (let i = 0; i < 3; i++) {
    let randIdx = Math.floor(Math.random() * PROBABILITY_LOOKUP.length);

    reels[i] = PROBABILITY_LOOKUP[randIdx];
  }
}

/*************************** WIN-LOGIC functions ***************************/
function countIdenticalReelImgs() {
  if (reels[0] === reels[1] && reels[1] === reels[2]) {
    return [3, reels[0]];
  } else if (reels[0] === reels[1]) {
    return [2, reels[0]];
  } else if (reels[0] === reels[2]) {
    return [2, reels[0]];
  } else if (reels[1] === reels[2]) {
    return [2, reels[1]];
  } else {
    return [1, reels[0]];
  }
}

function winMoney() {
  let [numIdenticalSymbols, symbol] = countIdenticalReelImgs();
  if (numIdenticalSymbols <= 1) return 0;

  let prizeMultiplyer = numIdenticalSymbols === 2 ? 1 : 5;

  return Math.floor(
    betPerSpin * prizeMultiplyer * REELIMGS_LOOKUP[symbol].payoutFactor
  );
}

/*************************** RENDER functions ***************************/
function renderAccount() {
  // Guard for initializing
  if (accMoney === 0.1) {
    moneyLeftEl.innerText = "Insert Money";
    return;
  }

  wonMoneyEl.innerText = `won $${moneyWon}`;
  accMoney += moneyWon;
  moneyLeftEl.innerText = `$${accMoney} left in your account!`;
  highScoreEl.innerText = `HIGH SCORE: $${highScore}`;
}

function renderReels() {
  reelEls.forEach(function (el, idx) {
    el.innerHTML = `<img src="${REELIMGS_LOOKUP[reels[idx]].img}" >`;
  });
}

function render() {
  renderReels();
  renderAccount();
}
