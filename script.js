const cells = document.querySelectorAll(".cell");

const statusText = document.getElementById("statusText");

const scoreXElement = document.getElementById("scoreX");
const scoreOElement = document.getElementById("scoreO");
const drawScoreElement = document.getElementById("drawScore");

const winnerMessage = document.getElementById("winnerMessage");
const winnerTitle = document.getElementById("winnerTitle");
const winnerDescription = document.getElementById("winnerDescription");

const restartBtn = document.getElementById("restartBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const nextGameBtn = document.getElementById("nextGameBtn");

const modeButtons = document.querySelectorAll(".mode-btn");

let board = ["", "", "", "", "", "", "", "",];

let currentPlayer = "X";

let gameActive = true;

let gameMode = "pvp";

let scores = {
    X: 0,
    O: 0,
    draw: 0
};

const winningPatterns = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];

/* CELL CLICK */

cells.forEach(cell => {

    cell.addEventListener("click", () => {

        const index = cell.dataset.index;

        if (!gameActive || board[index] !== "") {
            return;
        }

        makeMove(index, currentPlayer);

        if (gameMode === "computer" &&
            gameActive &&
            currentPlayer === "O") {

            setTimeout(computerMove, 500);
        }

    });

});

/* MAKE MOVE */

function makeMove(index, player) {

    board[index] = player;

    const cell = cells[index];

    cell.textContent = player;

    cell.classList.add(player.toLowerCase());

    checkGame();

}

/* CHECK GAME */

function checkGame() {

    let winner = null;

    let winningCells = [];

    for (let pattern of winningPatterns) {

        const [a, b, c] = pattern;

        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            winner = board[a];

            winningCells = pattern;

            break;
        }
    }

    if (winner) {

        gameActive = false;

        winningCells.forEach(index => {
            cells[index].classList.add("winner");
        });

        scores[winner]++;

        updateScores();

        showWinner(
            `${winner === "X" ? "Player X" : "Player O"} Wins!`,
            "Excellent! You played a great game."
        );

        return;
    }

    if (!board.includes("")) {

        gameActive = false;

        scores.draw++;

        updateScores();

        showWinner(
            "It's a Draw!",
            "Nobody wins this round."
        );

        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    updateStatus();

}

/* COMPUTER MOVE */

function computerMove() {

    if (!gameActive) {
        return;
    }

    const emptyCells = board
        .map((value, index) => value === "" ? index : null)
        .filter(index => index !== null);

    if (emptyCells.length === 0) {
        return;
    }

    /*
        First try to win.
    */

    const winningMove = findWinningMove("O");

    if (winningMove !== null) {

        makeMove(winningMove, "O");

        return;
    }

    /*
        Block player X.
    */

    const blockingMove = findWinningMove("X");

    if (blockingMove !== null) {

        makeMove(blockingMove, "O");

        return;
    }

    /*
        Take center.
    */

    if (board[4] === "") {

        makeMove(4, "O");

        return;
    }

    /*
        Take a random corner.
    */

    const corners = [0, 2, 6, 8]
        .filter(index => board[index] === "");

    if (corners.length > 0) {

        const randomCorner =
            corners[Math.floor(Math.random() * corners.length)];

        makeMove(randomCorner, "O");

        return;
    }

    /*
        Random move.
    */

    const randomMove =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

    makeMove(randomMove, "O");

}

/* FIND WINNING MOVE */

function findWinningMove(player) {

    for (let pattern of winningPatterns) {

        const [a, b, c] = pattern;

        const values = [
            board[a],
            board[b],
            board[c]
        ];

        const playerCount =
            values.filter(value => value === player).length;

        const emptyIndex =
            values.indexOf("");

        if (playerCount === 2 && emptyIndex !== -1) {

            return pattern[emptyIndex];
        }
    }

    return null;
}

/* STATUS */

function updateStatus() {

    if (gameMode === "computer") {

        if (currentPlayer === "X") {

            statusText.textContent = "Your Turn — X";

        } else {

            statusText.textContent = "Computer's Turn — O";

        }

    } else {

        statusText.textContent =
            `Player ${currentPlayer}'s Turn`;

    }
}

/* WINNER */

function showWinner(title, description) {

    winnerTitle.textContent = title;

    winnerDescription.textContent = description;

    winnerMessage.classList.add("show");
}

/* UPDATE SCORE */

function updateScores() {

    scoreXElement.textContent = scores.X;

    scoreOElement.textContent = scores.O;

    drawScoreElement.textContent = scores.draw;

}

/* RESET BOARD */

function resetBoard() {

    board = ["", "", "", "", "", "", "", "",];

    currentPlayer = "X";

    gameActive = true;

    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "winner"
        );

    });

    winnerMessage.classList.remove("show");

    updateStatus();

}

/* RESTART */

restartBtn.addEventListener("click", resetBoard);

nextGameBtn.addEventListener("click", resetBoard);

/* RESET SCORE */

resetScoreBtn.addEventListener("click", () => {

    scores = {
        X: 0,
        O: 0,
        draw: 0
    };

    updateScores();

    resetBoard();

});

/* CHANGE GAME MODE */

modeButtons.forEach(button => {

    button.addEventListener("click", () => {

        modeButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        gameMode = button.dataset.mode;

        resetBoard();

    });

});

/* INITIAL STATUS */

updateStatus();