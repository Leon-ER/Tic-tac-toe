// pop up
const modal = document.getElementById("myModal");
const btn = document.getElementById("myBtn");
const span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
  modal.style.display = "block";
};

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// game board

const gameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];
  const render = () => {
    const boardContainer = document.querySelector("#boardContainer");
  boardContainer.innerHTML = "";
  board.forEach((cell, index) => {
    const cellDiv = document.createElement("div");
    cellDiv.classList.add("cell");
    cellDiv.innerHTML = cell;
    cellDiv.setAttribute("data-index", index)
    boardContainer.appendChild(cellDiv);
  });
  };
  return { board, render };
})();

const playerFactory = (name, marker) => {
  return { name, marker };
};

const player1 = playerFactory(null, "X");
const player2 = playerFactory(null, "O");

const game = (() => {
  let currentPlayer = player1;
  const addMark = (cellIndex) => {
    if (player1.name && player2.name) {
      if (gameBoard.board[cellIndex] === "") {
        gameBoard.board[cellIndex] = currentPlayer.marker;
        gameBoard.render();
        checkForEndGame();
        currentPlayer = currentPlayer === player1 ? player2 : player1;
      }
    } else {
      alert("Please enter names for both players before starting the game.");
    }
  };
  const checkForEndGame = () => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    const isBoardFull = gameBoard.board.every((cell) => cell !== "");
    let winner = null;
    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (
        gameBoard.board[a] &&
        gameBoard.board[a] === gameBoard.board[b] &&
        gameBoard.board[a] === gameBoard.board[c]
      ) {
        winner = currentPlayer;
        displayController.showEndGameMessage(winner);
        return;
      }
    }
    if (isBoardFull) {
      displayController.showEndGameMessage(); // Call showEndGameMessage without winner parameter
    }
  };

  const restart = () => {
    gameBoard.board = ["", "", "", "", "", "", "", "", ""];
    gameBoard.render();
    currentPlayer = player1;
    displayController.hideEndGameMessage();
  };
  return { addMark, restart };
})();

//  tie the gameObject to DOM

const boardContainer = document.querySelector("#boardContainer");
boardContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("cell")) {
    const cellIndex = event.target.getAttribute("data-index");
    game.addMark(cellIndex);
  }
});

const displayController = (() => {
  const endGameMessage = document.querySelector("#endGameMsg");
  const showEndGameMessage = (winner = null) => {
    endGameMessage.style.display = "block";
    if (winner) {
      endGameMessage.textContent = `${winner.name} wins!`;
      cellDiv.disabled = true;
    } else {
      endGameMessage.textContent = "It's a tie!";
      cellDiv.disabled = true;
    }
  };
  const hideEndGameMessage = () => {
    endGameMessage.style.display = "none";
  };
  return { showEndGameMessage, hideEndGameMessage };
})();

const startButton = document.querySelector("#start-btn");
const player1Input = document.querySelector("#player1Name");
const player2Input = document.querySelector("#player2Name");

startButton.addEventListener("click", () => {
  const player1Name = player1Input.value;
  const player2Name = player2Input.value;
  player1.name = player1Name;
  player2.name = player2Name;
  restartGame();
  modal.style.display = "none";
});
const restartGame = () => {
  game.restart();
  displayController.hideEndGameMessage();
};

gameBoard.render();
