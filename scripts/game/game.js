import Player from "./player.js";
import Piece from "./piece.js";
import AutoPlayer from "./autoplayer.js";
import levels from "./levels.js";
import millCheckOffsets from "./millCheckOffsets.js";
import error from "../error.js";

class Game {
  /**
   * Creates a new Game instance.
   * @param {string} level The level of the game, can be ```mini```, ```small```, ```normal``` or ```big```.
   * @param {string} username1 The name of the first player.
   * @param {string} username2 The name of the second player.
   * @param {boolean} [shufflePlayers=false] Whether to shuffle the players' order.
   *
   * Initializes the game grid, connections, and players.
   */
  constructor(level, username1, username2, shufflePlayers = false) {
    this.level = level;
    this.size = levels[this.level].size;
    this.grid = Array.from({ length: this.size }, () => Array.from({ length: this.size }, () => ({ piece: null, isRelevant: false })));
    this.connections = this.#getConnections();
    this.#hideNotRelevantCells();
    this.pieceAmount = levels[this.level].pieces;
    this.#definePlayers(username1, username2, shufflePlayers);
    this.phase = "placing"; // can be "placing", "moving" or "taking"
    this.turn = 0; // 0 for player X, 1 for player O
    this.pickedUpPiece = null;
    this.result = null; // can be "X", "O" or "draw"
  }

  // public methods

  /**
   * Plays a piece on the board.
   * @param {number} i The row index.
   * @param {number} j The column index.
   * @returns {boolean} Whether the piece was placed successfully.
   */
  place(i, j) {
    if (!this.#inBounds(i, j)) return error(`coordinates out of bounds [${i}, ${j}]`);
    if (!this.grid[i][j].isRelevant) return error(`you can't place a piece here, this cell is not relevant [${i}, ${j}]`);
    if (this.phase === "taking") return error("you can't place a piece in the taking phase");
    if (this.phase === "placing") {
      // placing phase
      if (this.grid[i][j].piece) return error(`there is already a piece here [${i}, ${j}]`);
      this.grid[i][j].piece = new Piece(this.players[this.turn].symbol, i, j, "placed");
      this.players[this.turn].inHandPieces--;
      this.players[this.turn].alivePieces++;
      if (this.players[0].inHandPieces === 0 && this.players[1].inHandPieces === 0) this.phase = "moving";
    } else {
      // moving phase
      if (!this.pickedUpPiece) return error("you need to pick up a piece first");
      if (this.grid[i][j].piece) return error(`there is already a piece here [${i}, ${j}]`);
      if (!this.#canMove(i, j)) return error(`you can't move here because you have more than 3 pieces [${i}, ${j}]`);
      this.grid[this.pickedUpPiece.coords[0]][this.pickedUpPiece.coords[1]].piece = null;
      this.grid[i][j].piece = this.pickedUpPiece;
      this.pickedUpPiece = null;
      this.grid[i][j].piece.status = "placed";
      this.grid[i][j].piece.updateCoords(i, j);
    }
    this.#hasUnmilledPieces(this.turn);
    if (this.checkMill(i, j)) this.phase = "taking";
    else this.#flipTurn();
    return true;
  }

  /**
   * Attempts to pick up a piece from the specified coordinates.
   * Cancels any previous pick-up action before attempting to pick up a new piece.
   *
   * @param {number} i - The row index of the piece to pick up.
   * @param {number} j - The column index of the piece to pick up.
   * @returns {boolean} Whether the piece was picked up successfully.
   */
  pickUp(i, j) {
    this.#cancelPickUp();
    if (this.phase !== "moving") return error("you can only pick up a piece in the moving phase");
    if (!this.grid[i][j].piece) return error(`there is no piece here to pick up [${i}, ${j}]`);
    if (this.grid[i][j].piece.status !== "placed") return error(`you can't pick up a piece that is not placed [${i}, ${j}]`);
    if (this.grid[i][j].piece.symbol !== this.players[this.turn].symbol) return error(`you can't pick up your opponent's piece [${i}, ${j}]`);
    this.pickedUpPiece = this.grid[i][j].piece;
    this.pickedUpPiece.status = "picked up";
    return true;
  }

  take(i, j) {
    if (!this.#inBounds(i, j)) return error(`coordinates out of bounds [${i}, ${j}]`);
    if (!this.grid[i][j].isRelevant) return error(`you can't take a piece here, this cell is not relevant [${i}, ${j}]`);
    if (this.phase !== "taking") return error("you can only take a piece in the taking phase");
    if (!this.grid[i][j].piece) return error(`there is no piece here to take [${i}, ${j}]`);
    if (this.grid[i][j].piece.symbol === this.players[this.turn].symbol) return error(`you can't take your own piece [${i}, ${j}]`);
    if (this.checkMill(i, j) && this.#hasUnmilledPieces(1 - this.turn))
      return error(`you can't take a piece that is part of a mill when your opponent has other pieces available [${i}, ${j}]`);
    this.grid[i][j].piece = null;
    this.players[1 - this.turn].alivePieces--;
    this.players[1 - this.turn].takenPieces++;
    if (this.players[1 - this.turn].alivePieces < 3 && this.players[1 - this.turn].inHandPieces === 0) return (this.result = this.players[this.turn].symbol);
    this.phase = this.players[0].inHandPieces === 0 && this.players[1].inHandPieces === 0 ? "moving" : "placing";
    this.#flipTurn();
    return true;
  }

  print(includeInfo = false) {
    document.getElementById("whatisplaying").innerHTML = this.phase;
    if (!includeInfo) console.log(this.#gridString());
    let str = "";
    str += `Level: ${this.level}\n`;
    str += `Phase: ${this.phase}\n`;
    str += `Players: ${this.players[0].username} vs ${this.players[1].username} \n`;
    str += this.players[0].toString();
    str += this.players[1].toString();
    str += `Turn: ${this.players[this.turn].username} (${this.players[this.turn].symbol}) \n`;
    str += this.#gridString() + "\n";
    console.log(str);
  }

  // private methods

  #flipTurn() {
    var place = new Audio("./assets/audio/piece-placement.mp3");
    this.turn = 1 - this.turn;
    if (this.turn) {
      document.getElementById("whoisplaying").classList.remove("clear");
      document.getElementById("whoisplaying").classList.add("dark");
      document.getElementById("whoisplaying2").innerHTML = this.players[1];
      place.play();
    } else {
      document.getElementById("whoisplaying").classList.remove("dark");
      document.getElementById("whoisplaying").classList.add("clear");
      document.getElementById("whoisplaying2").innerHTML = this.players[0];
      place.play();
    }
  }

  /**
   * @private
   * Generates all the connections (sides) of the grid by leveraging the symmetry of the grid.
   *
   * The connections stored in ```levels``` represent only an eighth part of the true grid of connections. This method takes advantage
   * of the existing symmetry of the grid (horizontal symmetry, vertical symmetry, and both diagonal symmetries) and
   * infers the rest of the connections by "folding" the given eighth of connections three times:
   * 1. First on the diagonal axis to get the first quadrant.
   * 2. Then on the vertical axis to get all the top part.
   * 3. Finally on the horizontal axis to get the full grid of connections.
   *
   * @returns {Array<Array<Array<number>>>} An array of connections, where each connection is represented as a pair of points.
   * Each point is an array of two integers representing the coordinates _[x, y]_.
   */
  #getConnections() {
    const maxIndex = this.size - 1;
    /**
     * @param {Array<Array<Array<number>>>} arr the array of connections to fold
     * @param {number} direction the direction to fold the connections ( 0 for a diagonal fold, 1 for a vertical fold and 2 for an horizontal fold)
     * @returns {Array<Array<Array<number>>>} the folded connections
     */
    const fold = (arr, direction) => {
      let folded = arr.map((conn) => conn.map((point) => [...point]));
      arr.forEach(([i, j]) => {
        let connection;
        // diagonal fold
        if (direction === 0) connection = this.#sortConnection([i[1], i[0]], [j[1], j[0]]);
        // vertical fold
        else if (direction === 1) connection = this.#sortConnection([i[0], maxIndex - i[1]], [j[0], maxIndex - j[1]]);
        // horizontal fold
        else connection = this.#sortConnection([maxIndex - i[0], i[1]], [maxIndex - j[0], j[1]]);
        folded.push(connection);
      });
      return folded;
    };
    const firstQuadrantConnections = fold(levels[this.level].firstOctantConnections, 0);
    const topConnections = fold(firstQuadrantConnections, 1);
    const allConnections = fold(topConnections, 2);
    return allConnections;
  }

  #sortConnection(i, j) {
    if (i[0] < j[0]) return [i, j];
    if (i[0] > j[0]) return [j, i];
    if (i[1] < j[1]) return [i, j];
    return [j, i];
  }

  /**
   * @private
   * Marks relevant cells in the grid.
   *
   * On construction of the Game class, all cells inside the grid are marked as not relevant by default.
   * This method iterates through all connections in the grid, and if a cell is found in a connection,
   * it will be marked as a relevant cell.
   */
  #hideNotRelevantCells() {
    this.connections.forEach(([i, j]) => {
      this.grid[i[0]][i[1]].isRelevant = true;
      this.grid[j[0]][j[1]].isRelevant = true;
    });
  }

  /**
   * @private
   * Defines the 2 players of the game.
   *
   * @param {string} username1 the username of the first player
   * @param {string} username2 the username of the second player
   * @param {boolean} shufflePlayers whether to shuffle the players or not
   */
  #definePlayers(username1, username2, shufflePlayers) {
    this.players = [new Player(username1, "X", this.pieceAmount), new Player(username2, "O", this.pieceAmount)];
  }

  /**
   * @private
   * Cancels the pick-up action.
   */
  #cancelPickUp() {
    if (!this.pickedUpPiece || this.pickedUpPiece.status !== "picked up") return;
    this.pickedUpPiece.status = "placed";
    this.pickedUpPiece = null;
  }

  /**
   * @public
   * Checks if placing a piece at the given coordinates forms a mill.
   *
   * A mill is formed when three pieces of the same symbol are aligned either horizontally, vertically, or diagonally.
   * This method checks all possible directions for forming a mill from the given coordinates.
   *
   * @param {number} i - The row index of the piece.
   * @param {number} j - The column index of the piece.
   * @returns {boolean} - Returns true if a mill is formed, otherwise false.
   */
  checkMill(i, j) {
    const nextRelevantCell = ([i, j], [iOffset, jOffset], distance = 1) => {
      let iNew = i + iOffset;
      let jNew = j + jOffset;
      while (this.#inBounds(iNew, jNew) && !this.grid[iNew][jNew].isRelevant) {
        iNew += iOffset;
        jNew += jOffset;
      }
      if (!this.#inBounds(iNew, jNew)) return null;
      if (!this.connections.some((c) => c.toString() === this.#sortConnection([i, j], [iNew, jNew]).toString())) return null;
      if (distance > 1) return nextRelevantCell([iNew, jNew], [iOffset, jOffset], distance - 1);
      return [iNew, jNew];
    };
    const checkMillWith = (cell1, cell2) => {
      if (!cell1 || !cell2) return false;
      let [i1, j1] = cell1;
      let [i2, j2] = cell2;
      return (
        // coords are in bounds
        this.#inBounds(i1, j1) &&
        this.#inBounds(i2, j2) &&
        // the given coords have pieces
        this.grid[i1][j1].piece &&
        this.grid[i2][j2].piece &&
        // the pieces have the same symbol
        this.grid[i1][j1].piece.symbol === this.grid[i][j].piece.symbol &&
        this.grid[i2][j2].piece.symbol === this.grid[i][j].piece.symbol
      );
    };
    for (const [first, second] of millCheckOffsets)
      if (checkMillWith(nextRelevantCell([i, j], first.offset, first.distance), nextRelevantCell([i, j], second.offset, second.distance))) return true;
    return false;
  }

  #canMove(i, j) {
    if (this.players[this.turn].alivePieces <= 3) return true;
    const connection = this.#sortConnection(this.pickedUpPiece.coords, [i, j]);
    return this.connections.some((c) => c.toString() === connection.toString());
  }

  /**
   * @private
   * Checks if the player has any unmilled pieces.
   *
   * @param {number} player the player index  (0 for player X, 1 for player O)
   * @returns {boolean} whether the player has any unmilled pieces
   */
  #hasUnmilledPieces(player) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j].piece && this.grid[i][j].piece.symbol === this.players[player].symbol) {
          if (!this.checkMill(i, j)) return true;
        }
      }
    }
    return false;
  }

  #inBounds(i, j) {
    return i >= 0 && i < this.size && j >= 0 && j < this.size;
  }

  #gridString() {
    function setCharAt(str, i, char) {
      return str.substring(0, i) + char + str.substring(i + 1);
    }
    let strings = Array.from({ length: this.size * 2 - 1 }, () => " ".repeat(this.size * 4 - 3));
    // add piece symbols
    this.grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.isRelevant && cell.piece) {
          strings[i * 2] = setCharAt(strings[i * 2], j * 4, cell.piece.symbol);
        }
      });
    });
    this.connections.forEach(([start, end]) => {
      if (start[0] === end[0]) {
        // add horizontal connections
        for (let i = start[1] * 4 + 2; i <= end[1] * 4 - 2; i++) {
          strings[start[0] * 2] = setCharAt(strings[start[0] * 2], i, "—");
        }
        strings[start[0] * 2] = setCharAt(strings[start[0] * 2], start[1] * 4 + 2, "—");
      } else if (start[1] === end[1]) {
        // add vertical connections
        for (let i = start[0] * 2 + 1; i <= end[0] * 2 - 1; i++) {
          strings[i] = setCharAt(strings[i], start[1] * 4, "|");
        }
        strings[start[0] * 2 + 1] = setCharAt(strings[start[0] * 2 + 1], start[1] * 4, "|");
      } else if (start[1] > end[1]) {
        // add diagonal left connections
        strings[start[0] * 2 + 1] = setCharAt(strings[start[0] * 2 + 1], start[1] * 4 - 2, "/");
      } else if (start[1] < end[1]) {
        // add diagonal right connections
        strings[start[0] * 2 + 1] = setCharAt(strings[start[0] * 2 + 1], start[1] * 4 + 2, "\\");
      }
    });
    return strings.join("\n");
  }
}

export default Game;
