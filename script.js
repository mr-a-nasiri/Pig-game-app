'use strict';

///////////////////////////////////////////////////////////
/////----------- Players~ elements -----------/////
///////////////////////////////////////////////////////////
const playerOneEl = document.querySelector('.player--0');
const playerOneScoreEl = document.querySelector('#current--0');
const playerOneTotalScoreEl = document.querySelector('#score--0');

const playerTwoEl = document.querySelector('.player--1');
const playerTwoScoreEl = document.querySelector('#current--1');
const playerTwoTotalScoreEl = document.querySelector('#score--1');

///////////////////////////////////////////////////////////
/////----------- Btn Elements -----------/////
///////////////////////////////////////////////////////////
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const btnNew = document.querySelector('.btn--new');

const diceEl = document.querySelector('.dice');
/////////////////////////////////////////////
/////----------- Values -----------/////
/////////////////////////////////////////////
let dice;
let isPlayerTwoTurn;
let playerOneScore = 0;
let playerOneTotalScore = 0;
let playerTwoScore = 0;
let playerTwoTotalScore = 0;

///////////////////////////////////////////////////////////
/////----------- Event listeners -----------/////
///////////////////////////////////////////////////////////
function loadEventListeners() {
  btnRoll.addEventListener('click', rollDice);
  btnHold.addEventListener('click', holdScore);
  btnNew.addEventListener('click', newGame);
}
loadEventListeners();

///////////////////////////////////////////////////////////
/////----------- LocalStorage Functions -----------/////
///////////////////////////////////////////////////////////
const setScoreLS = function (playerName, score) {
  localStorage.setItem(playerName, score);
};
const setTotalScoreLS = function (playerName, totalScore) {
  localStorage.setItem(playerName, totalScore);
};
const setTurnLS = function (isPlayerTwoTurn) {
  localStorage.setItem('isPlayerTwoTurn', isPlayerTwoTurn);
};

const renderLS = function () {
  if (localStorage.getItem('playerOneScore')) {
    playerOneScore = Number(localStorage.getItem('playerOneScore'));
    playerOneScoreEl.textContent = playerOneScore;
  }

  if (localStorage.getItem('playerTwoScore')) {
    playerTwoScore = Number(localStorage.getItem('playerTwoScore'));
    playerTwoScoreEl.textContent = playerTwoScore;
  }

  if (localStorage.getItem('playerOneTotalScore')) {
    playerOneTotalScore = Number(localStorage.getItem('playerOneTotalScore'));
    playerOneTotalScoreEl.textContent = playerOneTotalScore;
  }

  if (localStorage.getItem('playerTwoTotalScore')) {
    playerTwoTotalScore = Number(localStorage.getItem('playerTwoTotalScore'));
    playerTwoTotalScoreEl.textContent = playerTwoTotalScore;
  }

  if (Boolean(Number(localStorage.getItem('isPlayerTwoTurn')))) {
    activePlayerTwoUI();
  } else {
    activePlayerOneUI();
  }
};

renderLS();

///////////////////////////////////////////////////////////
/////----------- Utility Functions -----------/////
///////////////////////////////////////////////////////////
const randomNum = () => Math.trunc(Math.random() * 6) + 1;

const renderDiceImg = dice => {
  diceEl.src = `images/dice-${dice}.png`;
  diceEl.classList.remove('hidden');
};

const disableBtn = function () {
  btnRoll.setAttribute('disabled', '');
  btnHold.setAttribute('disabled', '');
};

const enableBtn = function () {
  btnRoll.removeAttribute('disabled', '');
  btnHold.removeAttribute('disabled', '');
};

function activePlayerOneUI() {
  playerOneEl.classList.add('player--active');
  playerTwoEl.classList.remove('player--active');
  isPlayerTwoTurn = false;
}

function activePlayerTwoUI() {
  playerTwoEl.classList.add('player--active');
  playerOneEl.classList.remove('player--active');
  isPlayerTwoTurn = true;
}

const changePlayer = function () {
  if (isPlayerTwoTurn) {
    playerTwoScore = 0;
    playerTwoScoreEl.textContent = playerTwoScore;
    activePlayerOneUI();

    setScoreLS('playerTwoScore', playerTwoScore);
    setTurnLS(0);
  } else {
    playerOneScore = 0;
    playerOneScoreEl.textContent = playerOneScore;
    activePlayerTwoUI();

    setScoreLS('playerOneScore', playerOneScore);
    setTurnLS(1);
  }
};

const increaseScore = function () {
  if (isPlayerTwoTurn) {
    playerTwoScore += dice;
    playerTwoScoreEl.textContent = playerTwoScore;

    setScoreLS('playerTwoScore', playerTwoScore);
  } else {
    playerOneScore += dice;
    playerOneScoreEl.textContent = playerOneScore;

    setScoreLS('playerOneScore', playerOneScore);
  }
};

const increaseTotalScore = function () {
  if (isPlayerTwoTurn) {
    playerTwoTotalScore += playerTwoScore;
    playerTwoTotalScoreEl.textContent = playerTwoTotalScore;

    setTotalScoreLS('playerTwoTotalScore', playerTwoTotalScore);
  } else {
    playerOneTotalScore += playerOneScore;
    playerOneTotalScoreEl.textContent = playerOneTotalScore;

    setTotalScoreLS('playerOneTotalScore', playerOneTotalScore);
  }
};

const checkWinner = function () {
  if (playerOneTotalScore >= 50) {
    playerOneEl.classList.add('player--winner');
    playerTwoEl.classList.remove('player--active');
    disableBtn();
    localStorage.clear();
  } else if (playerTwoTotalScore >= 50) {
    playerTwoEl.classList.add('player--winner');
    playerOneEl.classList.remove('player--active');
    disableBtn();
    localStorage.clear();
  }
};

const resetUI = function () {
  playerOneEl.classList.remove('player--winner');
  playerTwoEl.classList.remove('player--winner');
  playerOneEl.classList.add('player--active');
  playerTwoEl.classList.remove('player--active');
  diceEl.classList.add('hidden');
  playerOneScoreEl.textContent = 0;
  playerOneTotalScoreEl.textContent = 0;
  playerTwoScoreEl.textContent = 0;
  playerTwoTotalScoreEl.textContent = 0;
};

const resetScores = function () {
  playerOneScore = 0;
  playerOneTotalScore = 0;
  playerTwoScore = 0;
  playerTwoTotalScore = 0;
};

///////////////////////////////////////////////////////////
/////----------- Functions -----------/////
///////////////////////////////////////////////////////////
function rollDice() {
  dice = randomNum();
  renderDiceImg(dice);

  if (dice !== 1) {
    increaseScore();
  } else {
    changePlayer();
  }
}

function holdScore() {
  increaseTotalScore();
  changePlayer();
  checkWinner();
}

function newGame() {
  enableBtn();
  resetUI();
  resetScores();
  isPlayerTwoTurn = false;
  localStorage.clear();
}
