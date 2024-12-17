/**
 * Represents a game piece.
 *
 * The status of a piece object can be:
 * - "placed": Placed on the board.
 * - "picked up": The player is currently holding the piece.
 */
class Piece {
  /**
   * Creates a new piece.
   * @param {string} symbol - The symbol to represent the piece (e.g., X or O).
   * @param {number} i - The row index of the piece.
   * @param {number} j - The column index of the piece.
   */
  constructor(symbol, i, j, status) {
    this.symbol = symbol;
    this.coords = [i, j];
    this.status = status;
  }

  updateCoords(i, j) {
    this.coords = [i, j];
  }
}

export default Piece;
