import Player from "./player.mjs";
import Piece from "./piece.mjs";
import levels from "./levels.mjs";

class Game {
  /**
   * Creates a new Game instance.
   * @param {string} level the level of the game, can be ```mini```, ```small```, ```normal``` or ```big```
   */
  constructor(level, username1, username2, shufflePlayers = false) {
    this.level = level;
    this.size = levels[this.level].size;
    this.grid = Array.from({ length: this.size }, () => Array.from({ length: this.size }, () => ({ value: "", isRelevant: false })));
    this.connections = this.#getConnections();
    this.#hideNotRelevantCells();
    this.#definePlayers(username1, username2, shufflePlayers);
  }

  // public methods

  start() {}

  print(includeInfo = false) {
    let str = "";
    if (includeInfo) {
      str += `Level: ${this.level}\n`;
      str += `Players: ${this.players[0].username} (${this.players[0].symbol}) vs ${this.players[1].username} (${this.players[1].symbol})\n`;
    }
    str += this.gridString();
    console.log(str);
  }

  gridString() {
    function setCharAt(str, i, char) {
      return str.substring(0, i) + char + str.substring(i + 1);
    }
    let strings = Array.from({ length: this.size * 2 - 1 }, () => " ".repeat(this.size * 4 - 3));
    // add values
    this.grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.isRelevant && cell.value) {
          const ch = cell.value === 1 ? "X" : "O";
          strings[i * 2] = setCharAt(strings[i * 2], j * 4, ch);
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

  // private methods

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
      this.players = [new Player(username2, "X"), new Player(username1, "O")];
    } else {
      this.players = [new Player(username1, "X"), new Player(username2, "O")];
    }
  }
}

export default Game;
