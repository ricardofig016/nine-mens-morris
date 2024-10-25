/**
 * Represents a game piece.
 *
 * The status of a piece object can be:
 * - "hand": Not played yet.
 * - "placed": Placed on the board.
 * - "up": The player is currently holding the piece.
 * - "out": The piece has been taken and is out of the game.
 */
class Piece {
  /**
   * Creates a new piece.
   * @param {string} symbol - The symbol to represent the piece (e.g., X or O).
   */
  constructor(symbol) {
    this.symbol = symbol;
    this.status = "hand";
  }
}

export default Piece;
