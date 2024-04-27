import Piece from './Piece.js';
class UI {
    constructor(game) {
        this.game = game;
        this.modal = document.getElementById("easyModal");
        this.gameElement = document.getElementById("game");
    }

    buildBoard() {
        this.gameElement.innerHTML = "";
        let black = 0;
        let white = 0;
        for (let i = 0; i < this.game.board.board.length; i++) {
            const element = this.game.board.board[i];
            let row = document.createElement("div"); // create div for each row
            row.setAttribute("class", "row");

            for (let j = 0; j < element.length; j++) {
                let col = document.createElement("div"); // create div for each case
                let piece = document.createElement("div");
                let caseType = "";
                let occupied = "";

                if (i % 2 === 0) {
                    if (j % 2 === 0) {
                        caseType = "Whitecase";
                    } else {
                        caseType = "blackCase";
                    }
                } else {
                    if (j % 2 !== 0) {
                        caseType = "Whitecase";
                    } else {
                        caseType = "blackCase";
                    }
                }

                // add the piece if the case isn't empty
                if (this.game.board.board[i][j] === 1) {
                    occupied = "whitePiece";
                } else if (this.game.board.board[i][j] === -1) {
                    occupied = "blackPiece";
                } else {
                    occupied = "empty";
                }

                piece.setAttribute("class", "occupied " + occupied);

                // set row and colum in the case
                piece.setAttribute("row", i);
                piece.setAttribute("column", j);
                piece.setAttribute("data-position", i + "-" + j);

                //add event listener to each piece
                piece.addEventListener("click", (event) => {
                    if (this.game.currentPlayer === -1 && this.game.iaEnabled) {
                        // Se for a vez da IA jogar, não fazer nada ao clicar na peça preta
                        return;
                    }
                    // Caso contrário, chamar a função movePiece normalmente
                    this.game.movePiece(event);
                });

                col.appendChild(piece);

                col.setAttribute("class", "column " + caseType);
                row.appendChild(col);

                // counter number of each piece
                if (this.game.board.board[i][j] === -1) {
                    black++;
                } else if (this.game.board.board[i][j] === 1) {
                    white++;
                }

                //display the number of piece for each player
                this.displayCounter(black, white);
            }

            this.gameElement.appendChild(row);
        }

        if (this.game.gameStarted && (black === 0 || white === 0)) {
            this.modalOpen(black);
        }
    }

    displayCurrentPlayer() {
        var container = document.getElementById("next-player");
        if (container.classList.contains("whitePiece")) {
            container.setAttribute("class", "occupied blackPiece");
        } else {
            container.setAttribute("class", "occupied whitePiece");
        }
    }

    markPossiblePosition(p, player = 0, direction = 0) {
        let attribute = parseInt(p.row + player) + "-" + parseInt(p.column + direction);

        let position = document.querySelector("[data-position='" + attribute + "']");
        if (position) {
            position.style.background = "green";
            // // save where it can move
            this.game.posNewPosition.push(new Piece(p.row + player, p.column + direction));
        }
    }

    displayCounter(black, white) {
        var blackContainer = document.getElementById("black-player-count-pieces");
        var whiteContainer = document.getElementById("white-player-count-pieces");
        blackContainer.innerHTML = black;
        whiteContainer.innerHTML = white;
    }

    modalOpen(black) {
        document.getElementById("winner").innerHTML = black === 0 ? "White" : "Black";
        document.getElementById("loser").innerHTML = black !== 0 ? "White" : "Black";
        this.modal.classList.add("effect");
    }

    modalClose() {
        this.modal.classList.remove("effect");
    }
}
export default UI;