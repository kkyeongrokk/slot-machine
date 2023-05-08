/*----- constants -----*/
REELIMGS_LOOKUP = {
  7: "img/777.png",
  cherry: "img/cherry.png",
  diamond: "img/diamond.png",
  grape: "img/grape.png",
  watermelon: "img/watermelon",
};

/*----- state variables -----*/
let accMoney;
let betPerSpin;
let reelImg;
let highScore;

/*----- cached elements  -----*/

/*----- event listeners -----*/

/*----- functions -----*/
init();

function init() {
  accMoney = 0;
  betPerSpin = 15;
  highScore = 0;

  render();
}

function render() {
  renderReel();
  renderAccount();
}
