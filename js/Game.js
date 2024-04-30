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
        this.readyToMove = null;
        this.iaEnabled = false;
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
        if (this.iaEnabled && this.currentPlayer === -1) {
            setTimeout(() => {
                this.makeRandomMoveForAI();
            }, 1000);
            //this.makeRandomMoveForAI();
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
        //console.log(`Verificando posições possíveis para a peça: row ${piece.row}, column ${piece.column}`);
        let positions = [];

        if (
            piece.row + player >= 0 &&
            piece.row + player < this.board.board.length &&
            piece.column + 1 >= 0 &&
            piece.column + 1 < this.board.board[0].length &&
            this.board.board[piece.row + player][piece.column + 1] === 0
        ) {
            positions.push(new Piece(piece.row + player, piece.column + 1));
            this.ui.markPossiblePosition(piece, player, 1);
            //console.log(`Posição válida encontrada: row ${piece.row + player}, column ${piece.column + 1}`);
        }

        if (
            piece.row + player >= 0 &&
            piece.row + player < this.board.board.length &&
            piece.column - 1 >= 0 &&
            piece.column - 1 < this.board.board[0].length &&
            this.board.board[piece.row + player][piece.column - 1] === 0
        ) {
            positions.push(new Piece(piece.row + player, piece.column - 1));
            this.ui.markPossiblePosition(piece, player, -1);
            //console.log(`Posição válida encontrada: row ${piece.row + player}, column ${piece.column - 1}`);
        }

        // Se posições válidas foram encontradas, atualize readyToMove e posNewPosition
        if (positions.length > 0) {
            this.readyToMove = piece;
            this.posNewPosition = positions;
        }

        //console.log(`Total de posições novas possíveis: ${this.posNewPosition.length}`);
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

    makeRandomMoveForAI() {
        console.log("VEZ DA IA")
        //console.log('Iniciando makeRandomMoveForAI...');
        // Encontrar todas as peças pretas disponíveis para mover
        let blackPieces = [];
        for (let i = 0; i < this.board.board.length; i++) {
            for (let j = 0; j < this.board.board[i].length; j++) {
                if (this.board.board[i][j] === -1) {
                    blackPieces.push(new Piece(i, j));
                    //console.log(`Peça preta encontrada: row ${i}, column ${j}`);
                }
            }
        }

        console.log(`Total de peças pretas: ${blackPieces.length}`);

        // Filtrar as peças que podem se mover para uma posição vazia na diagonal abaixo
        let eligiblePieces = blackPieces.filter(piece => {
            let downLeft = (piece.row + 1 < this.board.board.length && piece.column - 1 >= 0 && this.board.board[piece.row + 1][piece.column - 1] === 0);
            let downRight = (piece.row + 1 < this.board.board.length && piece.column + 1 < this.board.board[0].length && this.board.board[piece.row + 1][piece.column + 1] === 0);
            return downLeft || downRight;
        });

        console.log(`Peças elegíveis para movimento: ${eligiblePieces.length}`);

        let captureEligiblePieces = blackPieces.filter(piece => {
            let canCapture = false;
            if (piece.row + 2 < this.board.board.length && piece.column - 2 >= 0) {
                if (this.board.board[piece.row + 1][piece.column - 1] === 1 && this.board.board[piece.row + 2][piece.column - 2] === 0) {
                    canCapture = true;
                }
            }
            if (piece.row + 2 < this.board.board.length && piece.column + 2 < this.board.board[0].length) {
                if (this.board.board[piece.row + 1][piece.column + 1] === 1 && this.board.board[piece.row + 2][piece.column + 2] === 0) {
                    canCapture = true;
                }
            }
            return canCapture;
        });
        
        // Se houver peças elegíveis para captura
        if (captureEligiblePieces.length > 0) {
            // Escolher uma peça aleatória entre as elegíveis para captura
            const randomCaptureIndex = Math.floor(Math.random() * captureEligiblePieces.length);
            const pieceToCapture = captureEligiblePieces[randomCaptureIndex];
            
            // Determinar em qual direção a peça pode capturar
            let captureDownLeft = (pieceToCapture.row + 2 < this.board.board.length && pieceToCapture.column - 2 >= 0 &&
                this.board.board[pieceToCapture.row + 1][pieceToCapture.column - 1] === 1 && this.board.board[pieceToCapture.row + 2][pieceToCapture.column - 2] === 0);
            let captureDownRight = (pieceToCapture.row + 2 < this.board.board.length && pieceToCapture.column + 2 < this.board.board[0].length &&
                this.board.board[pieceToCapture.row + 1][pieceToCapture.column + 1] === 1 && this.board.board[pieceToCapture.row + 2][pieceToCapture.column + 2] === 0);
        
            // Escolher aleatoriamente uma direção de captura
            let captureDirection = captureDownLeft ? 'left' : 'right';
        
            // Remover a peça adversária capturada da direção selecionada
            if (captureDirection === 'left') {
                this.board.board[pieceToCapture.row + 1][pieceToCapture.column - 1] = 0; // Remover a peça adversária capturada
            } else {
                this.board.board[pieceToCapture.row + 1][pieceToCapture.column + 1] = 0; // Remover a peça adversária capturada
            }
        
            // Mover a peça para a nova posição na direção selecionada
            if (captureDirection === 'left') {
                this.board.board[pieceToCapture.row][pieceToCapture.column] = 0; // Remover a peça da posição atual
                this.board.board[pieceToCapture.row + 2][pieceToCapture.column - 2] = -1; // Mover a peça para a nova posição
            } else {
                this.board.board[pieceToCapture.row][pieceToCapture.column] = 0; // Remover a peça da posição atual
                this.board.board[pieceToCapture.row + 2][pieceToCapture.column + 2] = -1; // Mover a peça para a nova posição
            }
        
            // Atualizar a exibição do tabuleiro após a captura
            this.ui.buildBoard();
            this.currentPlayer = this.reverse(this.currentPlayer);
            this.ui.displayCurrentPlayer();
        } else {
            if (eligiblePieces.length > 0) {
                const randomPieceIndex = Math.floor(Math.random() * eligiblePieces.length);
                const pieceToMove = eligiblePieces[randomPieceIndex];
                console.log(`Peça escolhida para mover: row ${pieceToMove.row}, column ${pieceToMove.column}`);

                // Encontrar todas as novas posições possíveis para a peça escolhida
                let possibleNewPositions = [];

                // Verificar se a peça pode se mover para a diagonal abaixo à esquerda
                if (pieceToMove.row + 1 < this.board.board.length && pieceToMove.column - 1 >= 0 && this.board.board[pieceToMove.row + 1][pieceToMove.column - 1] === 0) {
                    possibleNewPositions.push(new Piece(pieceToMove.row + 1, pieceToMove.column - 1));
                }

                // Verificar se a peça pode se mover para a diagonal abaixo à direita
                if (pieceToMove.row + 1 < this.board.board.length && pieceToMove.column + 1 < this.board.board[0].length && this.board.board[pieceToMove.row + 1][pieceToMove.column + 1] === 0) {
                    possibleNewPositions.push(new Piece(pieceToMove.row + 1, pieceToMove.column + 1));
                }

                console.log(`Posições novas possíveis: ${possibleNewPositions.length}`);

                // Escolher uma nova posição aleatória para a peça, se houver posições disponíveis
                if (possibleNewPositions.length > 0) {
                    const randomNewPositionIndex = Math.floor(Math.random() * possibleNewPositions.length);
                    const newPosition = possibleNewPositions[randomNewPositionIndex];
                    console.log(`Movendo peça para: row ${newPosition.row}, column ${newPosition.column}`);

                    // Mover a peça para a nova posição escolhida
                    this.board.board[pieceToMove.row][pieceToMove.column] = 0; // Remover a peça da posição atual
                    this.board.board[newPosition.row][newPosition.column] = -1; // Mover a peça para a nova posição

                    // Atualizar a exibição do tabuleiro após o movimento
                    this.ui.buildBoard();
                    this.currentPlayer = this.reverse(this.currentPlayer);
                    this.ui.displayCurrentPlayer();
                }
            }
        }
    }

    reverse(player) {
        return player === 1 ? -1 : 1;
    }
}
export default Game;
