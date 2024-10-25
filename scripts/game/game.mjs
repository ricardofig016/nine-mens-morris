import Player from "./player.mjs";
import Piece from "./piece.mjs";
import levels from "./levels.mjs";
import error from "../error.mjs";

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
    this.phase = "placing"; // can be "placing" or "moving"
    this.turn = 0; // 0 for player X, 1 for player O
    this.pickedUpPiece = null;
  }

  // public methods

  /**
   * Plays a piece on the board.
   * @param {number} i The row index.
   * @param {number} j The column index.
   * @returns {Object} An object containing the success status and an optional error message.
   * @returns {boolean} [return.success] - Indicates whether the piece was successfully placed.
   * @returns {string} [return.message] - An optional error message if the piece could not be placed.
   */
  place(i, j) {
    if (this.phase === "placing") {
      // placing phase
      if (this.grid[i][j].piece) return error("there is already a piece here");
      this.grid[i][j].piece = new Piece(this.players[this.turn].symbol, i, j);
      this.grid[i][j].piece.status = "placed";
      this.players[this.turn].inHandPieces--;
      this.players[this.turn].alivePieces++;
      if (this.players[0].inHandPieces === 0 && this.players[1].inHandPieces === 0) this.phase = "moving";
    } else {
      // moving phase
      if (!this.pickedUpPiece) return error("you need to pick up a piece first");
      if (this.grid[i][j].piece) return error("there is already a piece here");
      this.grid[this.pickedUpPiece.coords[0]][this.pickedUpPiece.coords[1]].piece = null;
      this.grid[i][j].piece = this.pickedUpPiece;
      this.pickedUpPiece = null;
      this.grid[i][j].piece.status = "placed";
      this.grid[i][j].piece.updateCoords(i, j);
    }
    this.#flipTurn();
    return { success: true };
  }

  /**
   * Attempts to pick up a piece from the specified coordinates.
   * Cancels any previous pick-up action before attempting to pick up a new piece.
   *
   * @param {number} i - The row index of the piece to pick up.
   * @param {number} j - The column index of the piece to pick up.
   * @returns {Object} An object containing the success status and an optional error message.
   * @returns {boolean} [return.success] - Indicates whether the piece was successfully picked up.
   * @returns {string} [return.message] - An optional error message if the piece could not be picked up.
   */
  pickUp(i, j) {
    this.cancelPickUp();
    if (this.phase === "placing") return error("you can't pick up a piece in the placing phase");
    if (!this.grid[i][j].piece) return error("there is no piece here to pick up");
    if (this.grid[i][j].piece.status !== "placed") return error("you can't pick up a piece that is not placed");
    if (this.grid[i][j].piece.symbol !== this.players[this.turn].symbol) return error("you can't pick up your opponent's piece");
    this.pickedUpPiece = this.grid[i][j].piece;
    this.pickedUpPiece.status = "up";
    return { success: true };
  }

  cancelPickUp() {
    if (!this.pickedUpPiece || this.pickedUpPiece.status !== "up") return false;
    this.pickedUpPiece.status = "placed";
    this.pickedUpPiece = null;
    return true;
  }

  print(includeInfo = false) {
    let str = "";
    if (includeInfo) {
      str += `Level: ${this.level}\n`;
      str += `Phase: ${this.phase}\n`;
      str += `Turn: ${this.players[this.turn].username} \n`;
      str += `Players: ${this.players[0].username} vs ${this.players[1].username} \n`;
      str += this.players[0].toString();
      str += this.players[1].toString();
    }
    str += this.#gridString();
    console.log(str);
  }

  // private methods

  #flipTurn() {
    this.turn = 1 - this.turn;
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
    function sortConnection([i, j]) {
      if (i[0] < j[0]) return [i, j];
      if (i[0] > j[0]) return [j, i];
      if (i[1] < j[1]) return [i, j];
      return [j, i];
    }
    /**
     * @param {Array<Array<Array<number>>>} arr the array of connections to fold
     * @param {number} direction the direction to fold the connections ( 0 for a diagonal fold, 1 for a vertical fold and 2 for an horizontal fold)
     * @returns {Array<Array<Array<number>>>} the folded connections
     */
    function fold(arr, direction) {
      let folded = arr.map((conn) => conn.map((point) => [...point]));
      arr.forEach(([i, j]) => {
        let connection;
        // diagonal fold
        if (direction === 0)
          connection = sortConnection([
            [i[1], i[0]],
            [j[1], j[0]],
          ]);
        // vertical fold
        else if (direction === 1)
          connection = sortConnection([
            [i[0], maxIndex - i[1]],
            [j[0], maxIndex - j[1]],
          ]);
        // horizontal fold
        else
          connection = sortConnection([
            [maxIndex - i[0], i[1]],
            [maxIndex - j[0], j[1]],
          ]);
        folded.push(connection);
      });
      return folded;
    }
    const firstQuadrantConnections = fold(levels[this.level].firstOctantConnections, 0);
    const topConnections = fold(firstQuadrantConnections, 1);
    const allConnections = fold(topConnections, 2);
    return allConnections;
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
    if (shufflePlayers && Math.random() < 0.5) {
      this.players = [new Player(username2, "X", this.pieceAmount), new Player(username1, "O", this.pieceAmount)];
    } else {
      this.players = [new Player(username1, "X", this.pieceAmount), new Player(username2, "O", this.pieceAmount)];
    }
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
