import levels from "./levels.mjs";

class Game {
  /**
   * @param {string} level the level of the game, can be *mini*, *small*, *normal* or *big*
   * @returns {Game}
   */
  constructor(level) {
    this.level = level;
    this.size = levels[this.level].size;
    this.grid = Array.from({ length: this.size }, () => Array.from({ length: this.size }, () => ({ value: "", hidden: true })));
    this.connections = this.getConnections();
    this.hideUnusedCells();
  }

  getConnections() {
    const maxIndex = this.size - 1;
    function sortConnection([i, j]) {
      if (i[0] < j[0]) return [i, j];
      if (i[0] > j[0]) return [j, i];
      if (i[1] < j[1]) return [i, j];
      return [j, i];
    }
    /**
     * @param {[[Int,Int],[Int,Int]]} arr the array of connections to fold
     * @param {Int} direction the direction to fold the connections ( 0 for a right fold and 1 for a down fold)
     * @returns
     */
    function fold(arr, direction) {
      let folded = arr.map((conn) => conn.map((point) => [...point]));
      arr.forEach(([i, j]) => {
        let connection;
        // right fold
        if (direction === 0)
          connection = sortConnection([
            [i[0], maxIndex - i[1]],
            [j[0], maxIndex - j[1]],
          ]);
        // down fold
        else
          connection = sortConnection([
            [maxIndex - i[0], i[1]],
            [maxIndex - j[0], j[1]],
          ]);
        folded.push(connection);
      });
      return folded;
    }
    const topConnections = fold(levels[this.level].firstQuadrantConnections, 0);
    const allConnections = fold(topConnections, 1);
    return allConnections;
  }

  hideUnusedCells() {
    this.connections.forEach(([i, j]) => {
      this.grid[i[0]][i[1]].hidden = false;
      this.grid[j[0]][j[1]].hidden = false;
    });
  }

  print() {
    function setCharAt(str, i, char) {
      return str.substring(0, i) + char + str.substring(i + 1);
    }
    let strings = Array.from({ length: this.size * 2 - 1 }, () => " ".repeat(this.size * 4 - 3));
    // print values
    this.grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (!cell.hidden && cell.value) {
          const ch = cell.value === 1 ? "X" : "O";
          strings[i * 2] = setCharAt(strings[i * 2], j * 4, ch);
        }
      });
    });
    this.connections.forEach(([start, end]) => {
      if (start[0] === end[0]) {
        // print horizontal connections
        for (let i = start[1] * 4 + 2; i <= end[1] * 4 - 2; i++) {
          strings[start[0] * 2] = setCharAt(strings[start[0] * 2], i, "—");
        }
        strings[start[0] * 2] = setCharAt(strings[start[0] * 2], start[1] * 4 + 2, "—");
      } else if (start[1] === end[1]) {
        // print vertical connections
        for (let i = start[0] * 2 + 1; i <= end[0] * 2 - 1; i++) {
          strings[i] = setCharAt(strings[i], start[1] * 4, "|");
        }
        strings[start[0] * 2 + 1] = setCharAt(strings[start[0] * 2 + 1], start[1] * 4, "|");
      } else if (start[1] > end[1]) {
        // print diagonal left connections
        strings[start[0] * 2 + 1] = setCharAt(strings[start[0] * 2 + 1], start[1] * 4 - 2, "/");
      } else if (start[1] < end[1]) {
        // print diagonal right connections
        strings[start[0] * 2 + 1] = setCharAt(strings[start[0] * 2 + 1], start[1] * 4 + 2, "\\");
      }
    });
    const toPrint = strings.join("\n");
    console.log(toPrint);
  }
}

export default Game;
