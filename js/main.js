/*----- constants -----*/
const REELIMGS_LOOKUP = [
  "img/777.png",
  "img/cherry.png",
  "img/diamond.png",
  "img/grape.png",
  "img/watermelon.png",
];

/*----- state variables -----*/
let accMoney;
let betPerSpin;
let highScore;

/*----- cached elements  -----*/
const addMoneyEl = document.getElementById("add-money");
const betMoneyEls = [
  ...document.querySelectorAll("#bet-money div:first-child > button"),
];

/*----- event listeners -----*/
document.getElementById("spin-btn").addEventListener("click", renderReel);
document
  .getElementById("add-money-btn")
  .addEventListener("click", handleAddMoney);
document
  .getElementById("withdraw-btn")
  .addEventListener("click", handleWithdraw);
document
  .querySelector("#bet-money div:first-child")
  .addEventListener("click", handleBetPerSpin);

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
  console.log(`Withdrawing $${accMoney}`);
  accMoney = 0;
}

function handleAddMoney() {
  if (addMoneyEl.value < 0) {
    addMoneyEl.value = "";
    return;
  }
  accMoney += parseInt(addMoneyEl.value);
  addMoneyEl.value = "";
  console.log(`$${accMoney} left in your account!`);
}

function renderReel() {
  // guard to not spin when the user have not enough money
  if (accMoney < betPerSpin) return;
  if (accMoney === 0) return;

  accMoney -= betPerSpin;

  randomPattern();

  render();
}

function randomPattern() {
  for (let i = 0; i < 3; i++) {
    let randomReelImg =
      REELIMGS_LOOKUP[Math.floor(Math.random() * REELIMGS_LOOKUP.length)];
    document.querySelector(
      `.reel:nth-child(${i + 1})`
    ).innerHTML = `<img src="${randomReelImg}" >`;
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

function winOrLoseMoney(res) {
  let countOfIdenticalImgs = Object.keys(res)[0];
  let img = res[countOfIdenticalImgs];

  if (countOfIdenticalImgs === 1) return 0;

  switch (true) {
    case img.includes(REELIMGS_LOOKUP[0]):
      return countOfIdenticalImgs * betPerSpin;

    case img.includes(REELIMGS_LOOKUP[1]):
      return countOfIdenticalImgs * (betPerSpin / 10);

    case img.includes(REELIMGS_LOOKUP[2]):
      return countOfIdenticalImgs * (betPerSpin / 2);

    case img.includes(REELIMGS_LOOKUP[3]):
      return countOfIdenticalImgs * (betPerSpin / 15);

    case img.includes(REELIMGS_LOOKUP[4]):
      return countOfIdenticalImgs * (betPerSpin / 12);
  }
}

function renderAccount() {
  if (accMoney < betPerSpin) {
    console.log("Not enough money to spin!");
    return;
  }
  console.log(`won $${winOrLoseMoney(countIdenticalReelImgs())}`);
  accMoney += winOrLoseMoney(countIdenticalReelImgs());
  console.log(`$${accMoney} left in your account!`);
}

function setHighScore() {
  highScore =
    winOrLoseMoney(countIdenticalReelImgs()) > highScore
      ? winOrLoseMoney(countIdenticalReelImgs())
      : highScore;
  document.getElementById("high-score").innerText = `HIGH SCORE: $${highScore}`;
}

function render() {
  renderAccount();
  setHighScore();
}
