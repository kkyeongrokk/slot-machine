/*----- constants -----*/
const PROBABILITY_LOOKUP = [
  "c",
  "c",
  "c",
  "c",
  "g",
  "g",
  "g",
  "g",
  "d",
  "d",
  "d",
  "w",
  "w",
  "w",
  "w",
  "s",
  "s",
];
// 'c' -> cherry, 'g' -> grape, 'd' -> diamond, etc.
// In the above example, a cherry should come up 4 times as often as a diamond...

const REELIMGS_LOOKUP = {
  s: { img: "img/777.png", payoutFactor: 50 },
  c: { img: "img/cherry.png", payoutFactor: 5 },
  d: { img: "img/diamond.png", payoutFactor: 40 },
  g: { img: "img/grape.png", payoutFactor: 10 },
  w: { img: "img/watermelon.png", payoutFactor: 15 },
};

/*----- state variables -----*/
let accMoney;
let betPerSpin;
let highScore;
let reels;

/*----- cached elements  -----*/
const reelEls = document.querySelectorAll(".reel");
const spinBtn = document.getElementById("spin-btn");
const addMoneyBtn = document.getElementById("add-money-btn");
const withdrawBtn = document.getElementById("withdraw-btn");
const betPerSpinEl = document.querySelector("#bet-money div:first-child");
const addMoneyEl = document.getElementById("add-money");
const moneyLeftEl = document.getElementById("money-left");
const wonMoneyEl = document.getElementById("won-money");
const betMoneyEls = [
  ...document.querySelectorAll("#bet-money div:first-child > button"),
];

/*----- event listeners -----*/
spinBtn.addEventListener("click", handleSpin);
addMoneyBtn.addEventListener("click", handleAddMoney);
withdrawBtn.addEventListener("click", handleWithdraw);
betPerSpinEl.addEventListener("click", handleBetPerSpin);

/*----- functions -----*/
init();

function init() {
  accMoney = 0;
  betPerSpin = 15;
  highScore = 0;
  reels = ["s", "s", "s"];

  render();
}

function handleBetPerSpin(evt) {
  betPerSpin = parseInt(
    evt.target.innerText.replace(evt.target.innerText[0], "")
  );
}

function handleWithdraw() {
  moneyLeftEl.innerText = `Withdrawing $${accMoney}`;
  accMoney = 0;
}

function handleAddMoney() {
  if (addMoneyEl.value === "") return;

  if (addMoneyEl.value < 0) {
    addMoneyEl.value = "";
    return;
  }
  accMoney += parseInt(addMoneyEl.value);
  addMoneyEl.value = "";
  moneyLeftEl.innerText = `$${accMoney} left in your account!`;
}

function handleSpin() {
  // guard to not spin when the user have not enough money
  if (accMoney < betPerSpin || accMoney === 0) return;

  accMoney -= betPerSpin;
  moneyLeftEl.innerText = `$${accMoney} left in your account!`;
  randomPattern();
  setHighScore();

  flashRandomSymbols(function () {
    render();
  });
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
  if (countOfIdenticalImgs === 1) return 0;

  switch (true) {
    case img === "s":
      return Math.floor(
        countOfIdenticalImgs * betPerSpin * REELIMGS_LOOKUP["s"].payoutFactor
      );

    case img === "c":
      return Math.floor(
        countOfIdenticalImgs *
          (betPerSpin / 10) *
          REELIMGS_LOOKUP["c"].payoutFactor
      );

    case img === "g":
      return Math.floor(
        countOfIdenticalImgs *
          (betPerSpin / 2) *
          REELIMGS_LOOKUP["g"].payoutFactor
      );

    case img === "d":
      return Math.floor(
        countOfIdenticalImgs *
          (betPerSpin / 15) *
          REELIMGS_LOOKUP["d"].payoutFactor
      );

    case img === "w":
      return Math.floor(
        countOfIdenticalImgs *
          (betPerSpin / 12) *
          REELIMGS_LOOKUP["w"].payoutFactor
      );
  }
}

function renderAccount() {
  if (accMoney < betPerSpin) {
    console.log("Not enough money to spin!");
    return;
  }
  wonMoneyEl.innerText = `won $${winMoney(countIdenticalReelImgs())}`;
  accMoney += winMoney(countIdenticalReelImgs());
  moneyLeftEl.innerText = `$${accMoney} left in your account!`;
}

function setHighScore() {
  let moneyWon = winMoney(countIdenticalReelImgs());

  highScore = moneyWon > highScore ? moneyWon : highScore;
  document.getElementById("high-score").innerText = `HIGH SCORE: $${highScore}`;
}

//render -> visualize
function renderReels() {
  reelEls.forEach(function (el, idx) {
    el.innerHTML = `<img src="${REELIMGS_LOOKUP[reels[idx]].img}" >`;
  });
}

function render() {
  renderReels();
  renderAccount();
}
