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
    };
};

const gameController = (function () {
    const player1 = createPlayer("Player 1", "X");
    const player2 = createPlayer("Player 2", "O");
    let players = [player1, player2];
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
        if (gameboard.placeMark(index, players[curPlayer].marker)) {
            checkWinner();
            if (!gameOver) {
                switchTurn();
            }
        }    
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

    return {
        playRound,
        getCurPlayer,
        checkWinner
    }
})();

