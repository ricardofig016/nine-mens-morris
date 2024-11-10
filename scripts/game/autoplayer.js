import Game from "./game.js";

class AutoPlayer {
  constructor(game) {
    this.game = game;
  }

  playRandomMove() {
    console.log("- autoplay -");
    const maxRetries = 100; // Limit the number of retries to avoid infinite loops
    let attempts = 0;
    let actionCompleted = false;

    while (!actionCompleted && attempts < maxRetries) {
      attempts++;

      if (this.game.phase === "placing") {
        actionCompleted = this.#placeRandomPiece();
      } else if (this.game.phase === "moving") {
        actionCompleted = this.#moveRandomPiece();
      } else if (this.game.phase === "taking") {
        actionCompleted = this.#takeRandomPiece();
      }
    }

    if (!actionCompleted) {
      console.log("Autoplayer needs some help completing the task."); // debug
    }
  }

  #placeRandomPiece() {
    let availableCells = this.#getRelevantEmptyCells();
    if (availableCells.length > 0) {
      let [i, j] = this.#randomChoice(availableCells);
      return this.game.place(i, j);
    }
    return false; // No available cells to place
  }

  #moveRandomPiece() {
    let movablePieces = this.#getPlayerPieces();
    if (movablePieces.length > 0) {
      let piece = this.#randomChoice(movablePieces);
      if (this.game.pickUp(piece.coords[0], piece.coords[1])) {
        let moveOptions = this.#getRelevantEmptyCells();
        if (moveOptions.length > 0) {
          let [i, j] = this.#randomChoice(moveOptions);
          return this.game.place(i, j);
        }
      }
    }
    return false; // No valid moves or pickups available
  }

  #takeRandomPiece() {
    let opponentPieces = this.#getOpponentPieces();
    if (opponentPieces.length > 0) {
      let [i, j] = this.#randomChoice(opponentPieces);
      return this.game.take(i, j);
    }
    return false; // No opponent pieces to take
  }

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

  #getPlayerPieces() {
    const playerSymbol = this.game.players[1].symbol;
    let pieces = [];

    this.game.grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.piece && cell.piece.symbol === playerSymbol && cell.piece.status === "placed") {
          pieces.push(cell.piece);
        }
      });
    });

    return pieces;
  }

  #getOpponentPieces() {
    let pieces = [];
    for (let i = 0; i < this.game.size; i++) {
      for (let j = 0; j < this.game.size; j++) {
        let piece = this.game.grid[i][j].piece;
        // Use checkMill method to check if the piece is part of a mill
        if (piece && piece.symbol !== this.game.players[1].symbol && !this.game.checkMill(i, j)) {
          pieces.push([i, j]);
        }
      }
    }
    return pieces;
  }

  #randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
}

export default AutoPlayer;
