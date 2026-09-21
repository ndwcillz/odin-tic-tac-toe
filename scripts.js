const gameboard = (function () {
    let gameSquares = ["","","","","","","","",""];


    return {
        placeMark: function (index, marker) {
            if (gameSquares[index] == "") {
                gameSquares[index] = marker;
                return true;
            } else {
                return false;
            }
        },

        
        resetBoard: function () {
            gameSquares.fill("");
        },

        readBoard: function() {
            return gameSquares;
        }
    };
})();

function createPlayer(name, marker) {
    return {
        name, marker
    }
};

const gameController = (function () {
    let players = [];
    let curPlayer = 0;
    let gameOver = false;

    function getCurPlayer() {
        return players[curPlayer];
    }

    function switchTurn() {
        curPlayer = 1 - curPlayer;
    }

    function playRound(index) {
        if (gameOver) {
            return;
        }
        let won = false;
        if (gameboard.placeMark(index, players[curPlayer].marker)) {
            won = checkWinner();
            if (!gameOver) {
                switchTurn();
            }
        }    
        return won;
    }

    function checkWinner() {
        const winIndices = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]

        const board = gameboard.readBoard();

        for (let row = 0; row < winIndices.length; row++) {
            const first = winIndices[row][0];
            const second = winIndices[row][1];
            const third = winIndices[row][2];

            if ((board[first] === board[second] && board[second] === board[third]) && (board[first] != "")) {
                gameOver = true;
                return true;
            }
        }

        if (!board.includes("")) {
            gameOver = true;
            return false;
        }

        return false;
    }

    function startGame(p1, p2) {
        const player1 = createPlayer(p1, "X");
        const player2 = createPlayer(p2, "O");
        players = [player1, player2];
        curPlayer = 0;
        gameOver = false;
        gameboard.resetBoard();
    }

    function isGameOver() {
        return gameOver;
    }

    return {
        playRound,
        getCurPlayer,
        checkWinner,
        startGame,
        isGameOver
    }
})();



const displayController = (function () {
    const squares = [];

    for (let i = 0; i < 9; i++) {
        const squareId = `${i}-square`;

        squares.push(document.getElementById(squareId));

        document.getElementById(squareId).addEventListener("click", function() {
            if (gameController.isGameOver()) {
                return;
            }

            const didWin = gameController.playRound(i);
            render();

            if(gameController.isGameOver()) {
                if (didWin) {
                    results.textContent = `${gameController.getCurPlayer().name} wins!`;
                } else {
                    results.textContent = "It's a tie!";
                }
            }
        })
    }

    function render() {
        let currentBoard = gameboard.readBoard();

        for (let i = 0; i < 9; i++) {
            squares[i].textContent = currentBoard[i];
        }
    }

    const startBtn = document.getElementById("start-btn");
    const results = document.getElementById("results");

    startBtn.addEventListener("click", function(event) {
        event.preventDefault();

        const name1 = document.getElementById("player1").value;
        const name2 = document.getElementById("player2").value;

        if (name1 != "" && name2 != "") {
            document.getElementById("p1-label").textContent = name1;
            document.getElementById("p2-label").textContent = name2;
            gameController.startGame(name1, name2);
        } else {
            document.getElementById("p1-label").textContent = "Player 1";
            document.getElementById("p2-label").textContent = "Player 2";
            gameController.startGame("Player 1", "Player 2");
            
        }
        
        results.textContent = "";
        document.getElementById("player1").value = "";
        document.getElementById("player2").value = "";
        startBtn.textContent = "Restart";
        render();

        
    });

    return {
        render
    }

})();