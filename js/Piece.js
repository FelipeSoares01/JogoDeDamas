class Piece {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }

    compare(piece) {
        return piece.row === this.row && piece.column === this.column;
    }
}
export default Piece;