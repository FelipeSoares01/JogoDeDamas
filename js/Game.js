import Piece from './Piece.js';
class Game {
    constructor(board, ui, modal) {
        this.board = board;
        this.ui = ui;
        this.gameStarted = false;
        this.modal = modal;
        this.currentPlayer = 1;
        this.posNewPosition = [];
        this.capturedPosition = [];
        this.readyToMove = null; // Adicionando readyToMove como propriedade da classe
    }

    movePiece(e) {
        let piece = e.target;
        const row = parseInt(piece.getAttribute("row"));
        const column = parseInt(piece.getAttribute("column"));
        let p = new Piece(row, column);

        if (this.capturedPosition.length > 0) {
            this.enableToCapture(p);
        } else {
            if (this.posNewPosition.length > 0) {
                this.enableToMove(p);
            }
        }

        if (this.currentPlayer === this.board.board[row][column]) {
            let player = this.reverse(this.currentPlayer);
            if (!this.findPieceCaptured(p, player)) {
                this.findPossibleNewPosition(p, player);
            }
        }
    }

    enableToCapture(p) {
        let find = false;
        let pos = null;
        let old = null;
        this.capturedPosition.forEach((element) => {
            if (element.newPosition.compare(p)) {
                find = true;
                pos = element.newPosition;
                old = element.pieceCaptured;
                return;
            }
        });

        if (find) {
            // if the current piece can move on, edit the board and rebuild
            this.board.board[pos.row][pos.column] = this.currentPlayer; // move the piece
            this.board.board[this.readyToMove.row][this.readyToMove.column] = 0; // delete the old position
            // delete the piece that had been captured
            this.board.board[old.row][old.column] = 0;

            // reinit ready to move value

            this.readyToMove = null;
            this.capturedPosition = [];
            this.posNewPosition = [];
            this.ui.displayCurrentPlayer();
            this.ui.buildBoard();
            // check if there are possibility to capture other piece
            this.currentPlayer = this.reverse(this.currentPlayer);
        } else {
            this.ui.buildBoard();
        }
    }

    enableToMove(p) {
        let find = false;
        let newPosition = null;
        // check if the case where the player play the selected piece can move on
        this.posNewPosition.forEach((element) => {
            if (element.compare(p)) {
                find = true;
                newPosition = element;
                return;
            }
        });

        if (find) this.moveThePiece(newPosition);
        else this.ui.buildBoard();
    }

    moveThePiece(newPosition) {
        // if the current piece can move on, edit the board and rebuild
        this.board.board[newPosition.row][newPosition.column] = this.currentPlayer;
        this.board.board[this.readyToMove.row][this.readyToMove.column] = 0;

        // init value
        this.readyToMove = null;
        this.posNewPosition = [];
        this.capturedPosition = [];

        this.currentPlayer = this.reverse(this.currentPlayer);

        this.ui.displayCurrentPlayer();
        this.ui.buildBoard();
    }

    findPossibleNewPosition(piece, player) {
        if (
            piece.row + player >= 0 &&
            piece.row + player < this.board.board.length &&
            piece.column + 1 >= 0 &&
            piece.column + 1 < this.board.board[0].length &&
            this.board.board[piece.row + player][piece.column + 1] === 0
        ) {
            this.readyToMove = piece;
            this.ui.markPossiblePosition(piece, player, 1);
        }

        if (
            piece.row + player >= 0 &&
            piece.row + player < this.board.board.length &&
            piece.column - 1 >= 0 &&
            piece.column - 1 < this.board.board[0].length &&
            this.board.board[piece.row + player][piece.column - 1] === 0
        ) {
            this.readyToMove = piece;
            this.ui.markPossiblePosition(piece, player, -1);
        }
    }

    findPieceCaptured(p, player) {
        let found = false;
        if (
            p.row - 1 >= 0 &&
            p.column - 1 >= 0 &&
            p.row - 2 >= 0 &&
            p.column - 2 >= 0 &&
            this.board.board[p.row - 1][p.column - 1] === player &&
            this.board.board[p.row - 2][p.column - 2] === 0
        ) {
            found = true;
            let newPosition = new Piece(p.row - 2, p.column - 2);
            this.readyToMove = p;
            this.ui.markPossiblePosition(newPosition);
            this.capturedPosition.push({
                newPosition: newPosition,
                pieceCaptured: new Piece(p.row - 1, p.column - 1),
            });
        }

        if (
            p.row - 1 >= 0 &&
            p.column + 1 < this.board.board[0].length &&
            p.row - 2 >= 0 &&
            p.column + 2 < this.board.board[0].length &&
            this.board.board[p.row - 1][p.column + 1] === player &&
            this.board.board[p.row - 2][p.column + 2] === 0
        ) {
            found = true;
            let newPosition = new Piece(p.row - 2, p.column + 2);
            this.readyToMove = p;
            this.ui.markPossiblePosition(newPosition);
            this.capturedPosition.push({
                newPosition: newPosition,
                pieceCaptured: new Piece(p.row - 1, p.column + 1),
            });
        }

        if (
            p.row + 1 < this.board.board.length &&
            p.column - 1 >= 0 &&
            p.row + 2 < this.board.board.length &&
            p.column - 2 >= 0 &&
            this.board.board[p.row + 1][p.column - 1] === player &&
            this.board.board[p.row + 2][p.column - 2] === 0
        ) {
            found = true;
            let newPosition = new Piece(p.row + 2, p.column - 2);
            this.readyToMove = p;
            this.ui.markPossiblePosition(newPosition);
            this.capturedPosition.push({
                newPosition: newPosition,
                pieceCaptured: new Piece(p.row + 1, p.column - 1),
            });
        }

        if (
            p.row + 1 < this.board.board.length &&
            p.column + 1 < this.board.board[0].length &&
            p.row + 2 < this.board.board.length &&
            p.column + 2 < this.board.board[0].length &&
            this.board.board[p.row + 1][p.column + 1] === player &&
            this.board.board[p.row + 2][p.column + 2] === 0
        ) {
            found = true;
            let newPosition = new Piece(p.row + 2, p.column + 2);
            this.readyToMove = p;
            this.ui.markPossiblePosition(newPosition);
            this.capturedPosition.push({
                newPosition: newPosition,
                pieceCaptured: new Piece(p.row + 1, p.column + 1),
            });
        }

        return found;
    }

    reverse(player) {
        return player === -1 ? 1 : -1;
    }
}

export default Game;
