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
let reelImg;
let highScore;

/*----- cached elements  -----*/

/*----- event listeners -----*/
document.getElementById("spin-btn").addEventListener("click", render);
/*----- functions -----*/
init();

function init() {
  accMoney = 0;
  betPerSpin = 15;
  highScore = 0;

  render();
}

function renderReel() {
  for (let i = 0; i < 3; i++) {
    let randomReelImg =
      REELIMGS_LOOKUP[Math.floor(Math.random() * REELIMGS_LOOKUP.length)];
    document.querySelector(
      `.reel:nth-child(${i + 1})`
    ).innerHTML = `<img src="${randomReelImg}" >`;
  }
}

function render() {
  renderReel();
  // renderAccount();
}
