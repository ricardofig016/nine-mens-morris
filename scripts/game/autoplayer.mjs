import Game from "./game.mjs";

class AutoPlayer {
  constructor(game) {
    this.game = game;
  }

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

  #placeRandomPiece() {
    let availableCells = this.#getRelevantEmptyCells();
    if (availableCells.length > 0) {
      let [i, j] = this.#randomChoice(availableCells);
      this.game.place(i, j);
    }
  }

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

  #takeRandomPiece() {
    let opponentPieces = this.#getOpponentPieces();
    if (opponentPieces.length > 0) {
      let [i, j] = this.#randomChoice(opponentPieces);
      this.game.take(i, j);
    }
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
    const playerSymbol = this.game.players[1].symbol; // Symbol for Bob 
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