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

const SOUNDS_LOOKUP = {
  spin: "sound/mixkit-arcade-slot-machine-wheel-1933.wav",
  money: "sound/cha-ching-7053.mp3",
  withdraw: "sound/essential-effects-fx-money-counter.wav",
};

/*----- state variables -----*/
let accMoney;
let betPerSpin;
let highScore;
let reels;

/*----- cached elements  -----*/
const player = new Audio();
const reelEls = document.querySelectorAll(".reel");
const spinBtn = document.getElementById("spin-btn");
const addMoneyBtn = document.getElementById("add-money-btn");
const withdrawBtn = document.getElementById("withdraw-btn");
const betPerSpinEl = document.querySelector("#bet-money div:first-child");
const addMoneyEl = document.getElementById("add-money");
const moneyLeftEl = document.getElementById("money-left");
const wonMoneyEl = document.getElementById("won-money");
const soundBtn = document.querySelector("#main-screen > button");
const soundEls = document.querySelectorAll("audio");
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

function playSound(query) {
  const sound = document.querySelector(query);
  sound.play();
}

function init() {
  accMoney = 0;
  betPerSpin = 15;
  highScore = 0;
  reels = ["s", "s", "s"];

  render();
}

function handleSpin() {
  // guard to not spin when the user have not enough money
  if (accMoney < betPerSpin || accMoney === 0) return;

  accMoney -= betPerSpin;
  moneyLeftEl.innerText = `$${accMoney} left in your account!`;
  randomPattern();
  setHighScore();
  playSound("#spin-btn > audio");

  flashRandomSymbols(function () {
    render();
  });
}

function setHighScore() {
  let moneyWon = winMoney(countIdenticalReelImgs());

  highScore = moneyWon > highScore ? moneyWon : highScore;
  document.getElementById("high-score").innerText = `HIGH SCORE: $${highScore}`;
}

function flashRandomSymbols(cb) {
  const TICK_RESOLUTION = 50; // adjust to taste
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

function randomPattern() {
  for (let i = 0; i < 3; i++) {
    let randIdx = Math.floor(Math.random() * PROBABILITY_LOOKUP.length);

    reels[i] = PROBABILITY_LOOKUP[randIdx];
  }
}

function handleBetPerSpin(evt) {
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
  if (addMoneyEl.value === "") return;

  if (addMoneyEl.value < 0) {
    addMoneyEl.value = "";
    return;
  }

  playSound("#add-money-btn > audio");
  accMoney += parseInt(addMoneyEl.value);
  addMoneyEl.value = "";
  moneyLeftEl.innerText = `$${accMoney} left in your account!`;
}

function countIdenticalReelImgs() {
  if (reels[0] === reels[1] && reels[1] === reels[2]) {
    return { 3: reels[0] };
  } else if (reels[0] === reels[1]) {
    return { 2: reels[0] };
  } else if (reels[0] === reels[2]) {
    return { 2: reels[0] };
  } else if (reels[1] === reels[2]) {
    return { 2: reels[1] };
  } else {
    return { 1: reels[0] };
  }
}

function winMoney(res) {
  let countOfIdenticalImgs = parseInt(Object.keys(res)[0]);
  let img = res[countOfIdenticalImgs];
  if (countOfIdenticalImgs === 1) {
    return 0;
  } else if (countOfIdenticalImgs === 2) {
    switch (true) {
      case img === "s":
        return Math.floor(betPerSpin * REELIMGS_LOOKUP["s"].payoutFactor);

      case img === "c":
        return Math.floor(betPerSpin * REELIMGS_LOOKUP["c"].payoutFactor);

      case img === "g":
        return Math.floor(betPerSpin * REELIMGS_LOOKUP["g"].payoutFactor);

      case img === "d":
        return Math.floor(betPerSpin * REELIMGS_LOOKUP["d"].payoutFactor);

      case img === "w":
        return Math.floor(betPerSpin * REELIMGS_LOOKUP["w"].payoutFactor);
    }
  } else {
    switch (true) {
      case img === "s":
        return Math.floor(betPerSpin * 5 * REELIMGS_LOOKUP["s"].payoutFactor);

      case img === "c":
        return Math.floor(betPerSpin * 5 * REELIMGS_LOOKUP["c"].payoutFactor);

      case img === "g":
        return Math.floor(betPerSpin * 5 * REELIMGS_LOOKUP["g"].payoutFactor);

      case img === "d":
        return Math.floor(betPerSpin * 5 * REELIMGS_LOOKUP["d"].payoutFactor);

      case img === "w":
        return Math.floor(betPerSpin * 5 * REELIMGS_LOOKUP["w"].payoutFactor);
    }
  }
}

function renderAccount() {
  if (accMoney < betPerSpin) {
    console.log("Not enough money to spin!");
    return;
  }

  let moneyWon = winMoney(countIdenticalReelImgs());

  wonMoneyEl.innerText = `won $${moneyWon}`;
  accMoney += moneyWon;
  moneyLeftEl.innerText = `$${accMoney} left in your account!`;
}

//render -> visualize
function renderReels() {
  reelEls.forEach(function (el, idx) {
    el.innerHTML = `<img src="${REELIMGS_LOOKUP[reels[idx]].img}" >`;
  });
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

function render() {
  renderReels();
  renderAccount();
}
