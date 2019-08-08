var board;
var squares = document.querySelectorAll('.cell');

var winningSquares = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
  [2, 5, 8],
  [1, 4, 7],
  [0, 3, 6]
];

var human = 'O';
var cpu = 'X';

start();

function start() {
  document.querySelector('.end').style.display = "none";
  document.querySelector('.end .text').innerText = "";
  document.querySelector('.selectSym').style.display = "block";
  for (let i = 0; i < squares.length; i++) {
    squares[i].innerText = '';
    squares[i].style.removeProperty('background-color');
  }
}

function selectSym(sym) {
  human = sym;
  cpu = sym === 'O' ? 'X' : 'O';
  board = Array.from(Array(9).keys());
  for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener('click', turnClick, false);
  }
  if (cpu === 'X') {
    turn(bestSpot(), cpu);
  }
  document.querySelector('.selectSym').style.display = "none";
}

function turnClick(square) {
  if (typeof board[square.target.id] === 'number') {
    turn(square.target.id, human);
    if (!checkWin(board, human) && !checkTie())
      turn(bestSpot(), cpu);
  }
}

function turn(squareId, player) {
  board[squareId] = player;
  document.getElementById(squareId).innerHTML = player;
  let gameWon = checkWin(board, player);
  if (gameWon) gameOver(gameWon);
  checkTie();
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winningSquares.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winningSquares[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player === human ? "blue" : "red";
  }
  for (let i = 0; i < squares.length; i++) {
    squares[i].removeEventListener('click', turnClick, false);
  }
  declareWinner(gameWon.player === human ? "You win!" : "You lose");
}

function declareWinner(who) {
  document.querySelector(".end").style.display = "block";
  document.querySelector(".end .text").innerText = who;
}
function emptySquares() {
  return board.filter((elm, i) => i === elm);
}

function bestSpot() {
  return minimax(board, cpu).index;
}

function checkTie() {
  if (emptySquares().length === 0) {
    for (cell of squares) {
      cell.style.backgroundColor = "green";
      cell.removeEventListener('click', turnClick, false);
    }
    declareWinner("Tie game");
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  var availSpots = emptySquares(newBoard);

  if (checkWin(newBoard, human)) {
    return { score: -10 };
  } else if (checkWin(newBoard, cpu)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  var moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player === cpu)
      move.score = minimax(newBoard, human).score;
    else
      move.score = minimax(newBoard, cpu).score;
    newBoard[availSpots[i]] = move.index;
    if ((player === cpu && move.score === 10) || (player === human && move.score === -10))
      return move;
    else
      moves.push(move);
  }

  let bestMove, bestScore;
  if (player === cpu) {
    bestScore = -1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    bestScore = 1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}