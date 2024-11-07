import Game from "./game.mjs";

class AutoPlayer {
  constructor(game) {
    this.game = game;
  }

  /**
   * Plays a random move for the auto-player based on the game phase.
   */
  playRandomMove() {
    console.log('- autoplay -')
    if (this.game.phase === "placing") {
      this.#placeRandomPiece();
    } else if (this.game.phase === "moving") {
      this.#moveRandomPiece();
    } else if (this.game.phase === "taking") {
      this.#takeRandomPiece();
    }
  }

  /**
   * Places a piece at a random, available spot.
   */
  #placeRandomPiece() {
    let availableCells = this.#getRelevantEmptyCells();
    if (availableCells.length > 0) {
      let [i, j] = this.#randomChoice(availableCells);
      this.game.place(i, j);
    }
  }

  /**
   * Moves a randomly selected piece to a random, valid location.
   */
  #moveRandomPiece() {
    let movablePieces = this.#getPlayerPieces();
    if (movablePieces.length > 0) {
      let piece = this.#randomChoice(movablePieces);
      this.game.pickUp(piece.coords[0], piece.coords[1]);

      let moveOptions = this.#getRelevantEmptyCells();
      if (moveOptions.length > 0) {
        let [i, j] = this.#randomChoice(moveOptions);
        this.game.place(i, j);
      }
    }
  }

  /**
   * Takes a random piece from the opponent based on valid game rules.
   */
  #takeRandomPiece() {
    let opponentPieces = this.#getOpponentPieces();
    if (opponentPieces.length > 0) {
      let [i, j] = this.#randomChoice(opponentPieces);
      this.game.take(i, j);
    }
  }

  /**
   * Gets relevant empty cells where pieces can be placed or moved to.
   */
  #getRelevantEmptyCells() {
    let cells = [];
    for (let i = 0; i < this.game.size; i++) {
      for (let j = 0; j < this.game.size; j++) {
        if (this.game.grid[i][j].isRelevant && !this.game.grid[i][j].piece) {
          cells.push([i, j]);
        }
      }
    }
    return cells;
  }

  /**
   * Retrieves all pieces belonging to the current auto-player.
   */
  #getPlayerPieces() {
    const playerSymbol = this.game.players[1].symbol; // Symbol for Bob (e.g., "O")
    let pieces = [];
  
    // Loop through the grid to find all pieces belonging to Player 2 (Bob) with status "placed"
    this.game.grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.piece && cell.piece.symbol === playerSymbol && cell.piece.status === "placed") {
          pieces.push(cell.piece);
        }
      });
    });
  
    return pieces;
  }

  /**
   * Retrieves all opponent pieces, excluding those in mills.
   */
  #getOpponentPieces() {
    let pieces = [];
    for (let i = 0; i < this.game.size; i++) {
      for (let j = 0; j < this.game.size; j++) {
        let piece = this.game.grid[i][j].piece;
        if (piece && piece.symbol !== this.game.players[1].symbol && !this.game.checkMill(i, j)) {
          pieces.push([i, j]);
        }
      }
    }
    return pieces;
  }

  /**
   * Selects a random element from an array.
   */
  #randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
}

export default AutoPlayer;