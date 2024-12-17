import Section from "./section.js";
import error from "../error.js";
import { updateGameState } from "../twserver-alunos/communication.js";

class Board extends Section {
  constructor() {
    if (Board.instance) return Board.instance;
    super("board");
    Board.instance = this;
    this.username = null;
    this.password = null;
    this.gameId = null;
    this.intervalId = null;
  }

  /**
   * Load the board with the server state.
   * @param {Object} params - Parameters including username, password, gameId.
   */
  async load({ username, password, gameId }) {
    super.load();
    this.username = username;
    this.password = password;
    this.gameId = gameId;

    // Initial render
    await this.updateAndRender();

    // Set up periodic updates to fetch the latest game state
    this.intervalId = setInterval(() => this.updateAndRender(), 2000);

    this.addListeners();
  }

  /**
   * Fetch the board state from the server and render it.
   */
  async updateAndRender() {
    try {
      const serverState = await updateGameState(this.username, this.gameId);
      console.log("Server state:", serverState);

      const { board, phase, turn, players } = serverState;

      // Determine player colors from the 'players' object
      const playerColors = this.getPlayerColors(players);

      // Render the board based on the server's board state
      this.renderBoard(board, phase, turn, playerColors);
    } catch (err) {
      error(`Error updating the board: ${err.message}`);
    }
  }

  /**
   * Returns a mapping from colors ("blue"/"red") to local classes ("clear"/"dark").
   * @param {Object} players - The 'players' object from the server state.
   * @returns {Object} - Mapping of colors to CSS classes.
   */
  getPlayerColors(players) {
    const colorMap = {};
    for (const [player, color] of Object.entries(players)) {
      if (color === "blue") colorMap[player] = "clear";
      else if (color === "red") colorMap[player] = "dark";
    }
    return colorMap;
  }

  /**
   * Render the board based on the server's grid state.
   * @param {Array} serverBoard - The grid state received from the server.
   * @param {string} phase - The current phase of the game.
   * @param {string} turn - The username of the player whose turn it is.
   * @param {Object} playerColors - Mapping of player usernames to CSS classes.
   */
  renderBoard(serverBoard, phase, turn, playerColors) {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";

    // Update the board's CSS class based on size
    const sizeClass = this.getBoardSizeClass(serverBoard.length);
    boardElement.className = sizeClass;

    serverBoard.forEach((row, i) => {
      row.forEach((cellContent, j) => {
        const cellElement = document.createElement("div");
        cellElement.className = `cell ${this.getCellClass(cellContent, playerColors)} ${this.getGridAreaClass(i, j)}`;
        boardElement.appendChild(cellElement);
      });
    });

    // Update the game status display
    document.getElementById("game-phase").textContent = `Phase: ${phase}`;
    document.getElementById("game-turn").textContent = `Turn: ${turn}`;

    console.log(`Phase: ${phase}, Turn: ${turn}`);
  }

  /**
   * Returns the CSS class for the board size.
   * @param {number} size - The size of the board (number of rows/columns).
   * @returns {string} - The CSS class for the board size.
   */
  getBoardSizeClass(size) {
    switch (size) {
      case 3:
        return "mini";
      case 6:
        return "small";
      case 9:
        return "normal";
      case 12:
        return "big";
      default:
        return "normal";
    }
  }

  /**
   * Returns the CSS class for a cell based on its content.
   * @param {string} cellContent - The content of the cell from the server.
   * @param {Object} playerColors - Mapping of player usernames to CSS classes.
   * @returns {string} - The corresponding CSS class for the cell.
   */
  getCellClass(cellContent, playerColors) {
    if (cellContent === "empty") return "empty";
    // Map "blue" or "red" to "clear" or "dark"
    if (cellContent === "blue") return "clear";
    if (cellContent === "red") return "dark";
    // If cellContent is a player's username, use their color
    return playerColors[cellContent] || "empty";
  }

  /**
   * Returns the CSS grid class for positioning the cell.
   * @param {number} i - The row index.
   * @param {number} j - The column index.
   * @returns {string} - The CSS class for grid positioning.
   */
  getGridAreaClass(i, j) {
    // Generate grid area class based on the coordinates
    // Adjust for 0-based indexing
    return `${String.fromCharCode(97 + i)}${j + 1}`; // e.g., a1, b2, etc.
  }

  /**
   * Adds click listeners to the board cells.
   */
  addListeners() {
    const boardElement = document.getElementById("board");

    boardElement.addEventListener("click", async (event) => {
      const target = event.target;
      if (!target.classList.contains("cell")) return;

      const [i, j] = this.getCellCoordinates(target);
      console.log(`Cell clicked: Row ${i}, Col ${j}`);

      // Notify server or take appropriate action based on the click
      // For example, send a move to the server
      await this.notifyMove(i, j);
    });
  }

  /**
   * Notify the server of the player's move.
   * @param {number} i - The row index.
   * @param {number} j - The column index.
   */
  async notifyMove(i, j) {
    try {
      const cell = { row: i, col: j }; // Adjust according to your server's expected cell format
      await notifyMove(this.username, this.password, this.gameId, cell);
      console.log("Move notified to server.");
    } catch (err) {
      error(`Error notifying move: ${err.message}`);
    }
  }

  /**
   * Extracts cell coordinates from a clicked cell element.
   * @param {HTMLElement} cellElement - The clicked cell element.
   * @returns {[number, number]} - The row and column indices.
   */
  getCellCoordinates(cellElement) {
    const classList = Array.from(cellElement.classList);
    const gridAreaClass = classList.find((cls) => /^[a-z][0-9]+$/.test(cls));
    const i = gridAreaClass.charCodeAt(0) - 97; // 'a' is 97 in ASCII
    const j = parseInt(gridAreaClass.substring(1), 10) - 1;
    return [i, j];
  }

  /**
   * Clean up when leaving the board (e.g., clear intervals).
   */
  unload() {
    if (this.intervalId) clearInterval(this.intervalId);
    super.unload();
  }
}

const board = new Board();
export default board;
