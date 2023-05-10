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

/*----- cached elements  -----*/
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
spinBtn.addEventListener("click", renderReel);
addMoneyBtn.addEventListener("click", handleAddMoney);
withdrawBtn.addEventListener("click", handleWithdraw);
betPerSpinEl.addEventListener("click", handleBetPerSpin);

/*----- functions -----*/
init();

function init() {
  accMoney = 0;
  betPerSpin = 15;
  highScore = 0;

  randomPattern();

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

function renderReel() {
  // guard to not spin when the user have not enough money
  if (accMoney < betPerSpin) return;
  if (accMoney === 0) {
    return;
  }

  accMoney -= betPerSpin;
  moneyLeftEl.innerText = `$${accMoney} left in your account!`;
  randomPattern();

  render();
}

function randomPattern() {
  for (let i = 0; i < 3; i++) {
    let randIdx = Math.floor(Math.random() * PROBABILITY_LOOKUP.length);
    document.querySelector(
      `.reel:nth-child(${i + 1})`
    ).innerHTML = `<img src="${
      REELIMGS_LOOKUP[PROBABILITY_LOOKUP[randIdx]].img
    }" >`;
  }
}

function countIdenticalReelImgs() {
  let reelImgs = document.querySelectorAll(".reel img");

  if (
    reelImgs[0].src === reelImgs[1].src &&
    reelImgs[1].src === reelImgs[2].src
  ) {
    return { 3: reelImgs[0].src };
  } else if (reelImgs[0].src === reelImgs[1].src) {
    return { 2: reelImgs[0].src };
  } else if (reelImgs[0].src === reelImgs[2].src) {
    return { 2: reelImgs[0].src };
  } else if (reelImgs[1].src === reelImgs[2].src) {
    return { 2: reelImgs[1].src };
  } else {
    return { 1: reelImgs[0].src };
  }
}

function winMoney(res) {
  let countOfIdenticalImgs = Object.keys(res)[0];
  let img = res[countOfIdenticalImgs];

  if (countOfIdenticalImgs === 1) return 0;

  switch (true) {
    case img.includes(REELIMGS_LOOKUP["s"].img):
      return Math.floor(
        countOfIdenticalImgs * betPerSpin * REELIMGS_LOOKUP["s"].payoutFactor
      );

    case img.includes(REELIMGS_LOOKUP["c"].img):
      return Math.floor(
        countOfIdenticalImgs *
          (betPerSpin / 10) *
          REELIMGS_LOOKUP["c"].payoutFactor
      );

    case img.includes(REELIMGS_LOOKUP["g"].img):
      return Math.floor(
        countOfIdenticalImgs *
          (betPerSpin / 2) *
          REELIMGS_LOOKUP["g"].payoutFactor
      );

    case img.includes(REELIMGS_LOOKUP["d"].img):
      return Math.floor(
        countOfIdenticalImgs *
          (betPerSpin / 15) *
          REELIMGS_LOOKUP["d"].payoutFactor
      );

    case img.includes(REELIMGS_LOOKUP["w"].img):
      return Math.floor(
        countOfIdenticalImgs *
          (betPerSpin / 12) *
          REELIMGS_LOOKUP["w"].payoutFactor
      );
  }
}

function renderAccount() {
  if (accMoney < betPerSpin) return;
  wonMoneyEl.innerText = `won $${winMoney(countIdenticalReelImgs())}`;
  accMoney += winMoney(countIdenticalReelImgs());
  moneyLeftEl.innerText = `$${accMoney} left in your account!`;
}

function setHighScore() {
  highScore =
    winMoney(countIdenticalReelImgs()) > highScore
      ? winMoney(countIdenticalReelImgs())
      : highScore;
  document.getElementById("high-score").innerText = `HIGH SCORE: $${highScore}`;
}

function render() {
  renderAccount();
  setHighScore();
}
