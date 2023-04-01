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
  // empty array to keep track of the game
  let board = ["", "", "", "", "", "", "", "", ""];
  // renders the 3x3 grid using the board array
  const render = () => {
    const boardContainer = document.querySelector("#boardContainer");
    boardContainer.innerHTML = "";
    board.forEach((cell = "", index) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.innerHTML = cell;
      cellDiv.setAttribute("data-index", index);
      boardContainer.appendChild(cellDiv);
    });
  };
  return { board, render };
})();
// factroy functions for player 1 and player 2
const playerFactory = (name, marker , score) => {
  return { name, marker ,score};
};

const player1 = playerFactory(null, "X" , score = 0);
const player2 = playerFactory(null, "O", score = 0);
// main game function
const game = (() => {
  let currentPlayer = player1;
  let isGameEnded = false;

  // adds mark on the clicker spot ! if names are not defined throws alert
  const addMark = (cellIndex) => {
    if (player1.name && player2.name) {
      if (!isGameEnded && gameBoard.board[cellIndex] === "") {
        gameBoard.board[cellIndex] = currentPlayer.marker;
        gameBoard.render();
        checkForEndGame();
        currentPlayer = currentPlayer === player1 ? player2 : player1;
      }
    } else {
      alert("Please enter names for both players before starting the game.");
    }
  };
  // checks for all the possible winning positions

  const checkForEndGame = () => {
    const scorePOne = document.getElementById("oneScore");
    const scorePTwo = document.getElementById("twoScore");

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
    //  checks who won or tie
    const isBoardFull = gameBoard.board.every((cell) => cell !== "");
    let winner = null;
    // loops through winningCombinations and checks for 3 in a row
    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (
        gameBoard.board[a] &&
        gameBoard.board[a] === gameBoard.board[b] &&
        gameBoard.board[a] === gameBoard.board[c]
      ) {
        ``;
        winner = currentPlayer;
        displayController.showEndGameMessage(winner);
        isGameEnded = true;
        //  adjusts the score for both players
        if (winner == player1) {
          player1.score ++;
          scorePOne.innerHTML = player1.score;
        } else {
          player2.score ++;
          scorePTwo.innerHTML = player2.score;
        }
        return;
      }
    }
    if (isBoardFull) {
      displayController.showEndGameMessage(); // Call showEndGameMessage without winner parameter
      isGameEnded = true;
    }
  };

  // restarts the game clears array renders new board
  const restart = () => {
    gameBoard.board.fill("");
    gameBoard.render();
    currentPlayer = player1;
    displayController.hideEndGameMessage();
    isGameEnded = false;
  };

  return { addMark, restart };
})();

//  tie the gameObject to DOM

// add market to clicked cell
const boardContainer = document.querySelector("#boardContainer");
boardContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("cell")) {
    const cellIndex = event.target.getAttribute("data-index");
    game.addMark(cellIndex);
  }
});
// shows winning message / tie
const displayController = (() => {
  const endGameMessage = document.querySelector("#endGameMsg");
  const showEndGameMessage = (winner = null) => {
    endGameMessage.style.display = "block";
    if (winner) {
      endGameMessage.textContent = `${winner.name} wins!`;
    } else {
      endGameMessage.textContent = "It's a tie!";
    }
  };
  const hideEndGameMessage = () => {
    endGameMessage.style.display = "none";
  };
  return { showEndGameMessage, hideEndGameMessage };
})();

// selectors
const startButton = document.querySelector("#start-btn");
const player1Input = document.querySelector("#player1Name");
const player2Input = document.querySelector("#player2Name");
const resetBtn = document.querySelector("#reset");
const resetGameBtn = document.querySelector('#resetGame')

// start button in the modal
startButton.addEventListener("click", (e) => {
  e.preventDefault();
  const player1Name = player1Input.value;
  const player2Name = player2Input.value;
  player1.name = player1Name;
  player2.name = player2Name;
  const playerOne = document.getElementById("playerOne");
  const playerTwo = document.getElementById("playerTwo");
  playerOne.innerHTML = player1.name;
  playerTwo.innerHTML = player2.name;
  document.getElementById("names").reset();
  modal.style.display = "none";
});
const restartGame = () => {
  game.restart();
  displayController.hideEndGameMessage();
};
// button to restart round
resetBtn.addEventListener("click", () => {
  restartGame();
});
// button to reset game
resetGameBtn.addEventListener('click',()=>{
  location.reload();
})
// player names and score
gameBoard.render();
