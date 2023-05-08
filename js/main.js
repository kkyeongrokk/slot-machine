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
const betMoneyEls = [
  ...document.querySelectorAll("#bet-money div:first-child > button"),
];

/*----- event listeners -----*/
document.getElementById("spin-btn").addEventListener("click", render);
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

  for (let i = 0; i < 3; i++) {
    let randomReelImg =
      REELIMGS_LOOKUP[Math.floor(Math.random() * REELIMGS_LOOKUP.length)];
    document.querySelector(
      `.reel:nth-child(${i + 1})`
    ).innerHTML = `<img src="${randomReelImg}" >`;
  }

  render();
}

function handleBetPerSpin(evt) {
  betPerSpin = parseInt(
    evt.target.innerText.replace(evt.target.innerText[0], "")
  );
}

function handleWithdraw() {
  console.log(`Withdrawing ${accMoney}`);
  accMoney = 0;
}

function handleAddMoney() {
  accMoney += parseInt(document.getElementById("add-money").value);
}

function renderReel() {
  // guard to not spin when the user have not enough money
  if (accMoney < betPerSpin) {
    console.log("Not enough money to spin!");
    return;
  }
  for (let i = 0; i < 3; i++) {
    let randomReelImg =
      REELIMGS_LOOKUP[Math.floor(Math.random() * REELIMGS_LOOKUP.length)];
    document.querySelector(
      `.reel:nth-child(${i + 1})`
    ).innerHTML = `<img src="${randomReelImg}" >`;
  }
}

function countIdenticalReelImgs() {
  let count = 0;
  const reelImgs = document.querySelectorAll(".reel");
  if (reelImgs[0] === reelImgs[1] && reelImgs[1] === reelImgs[2]) {
    return 2;
  } else if (
    reelImgs[0] === reelImgs[1] ||
    reelImgs[1] === reelImgs[2] ||
    reelImgs[0] === reelImgs[2]
  ) {
    return 1;
  } else {
    return 0;
  }
}

// return positive number if win money, else return negative number
function winOrLoseMoney() {}

function renderAccount() {
  accMoney += winOrLoseMoney();
}

// function setHighScore() {
//   highScore = winOrLoseMoney() > highScore ? winOrLoseMoney : highScore;
// }

function render() {
  renderReel();
  renderAccount();
  // setHighScore();
}
