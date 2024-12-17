import Section from "./section.js";
import { updateGameState } from "../twserver-alunos/communication.js";
import error from "../error.js";

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
   * Load the board and set up periodic updates.
   */
  async load({ username, password, gameId }) {
    super.load();
    this.username = username;
    this.password = password;
    this.gameId = gameId;
    // Initial render
    await this.updateAndRender();

    // Poll for updates every 2 seconds
    this.intervalId = setInterval(() => this.updateAndRender(), 2000);

    this.addListeners();
  }

  /**
   * Fetch the board state from the server and render it.
   */
  async updateAndRender() {
    try {
      const serverState = await updateGameState(this.username, this.gameId);
      if (!serverState || Object.keys(serverState).length === 0) {
        this.renderWaitingMessage();
        return;
      }
      

      const { board, phase, turn, players } = serverState;
      const playerColors = this.getPlayerColors(players);

      this.renderBoard(board, phase, turn, playerColors);
    } catch (err) {
      error(`Error updating the board: ${err.message}`);
    }
  }

  /**
   * Render a waiting message if the opponent hasn't joined yet.
   */
  renderWaitingMessage() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";

    const waitingMessage = document.createElement("div");
    waitingMessage.className = "waiting-message";
    waitingMessage.textContent = "Waiting for another player to join...";
    boardElement.appendChild(waitingMessage);

    console.log("Waiting for opponent...");
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

    serverBoard.forEach((row, i) => {
      row.forEach((cellContent, j) => {
        const cellElement = document.createElement("div");
        cellElement.className = `cell ${this.getCellClass(cellContent, playerColors)} ${this.getGridAreaClass(i, j)}`;
        boardElement.appendChild(cellElement);
      });
    });

    document.getElementById("game-phase").textContent = `Phase: ${phase}`;
    document.getElementById("game-turn").textContent = `Turn: ${turn}`;
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
   * Returns the CSS class for a cell based on its content.
   * @param {string} cellContent - The content of the cell from the server.
   * @param {Object} playerColors - Mapping of player usernames to CSS classes.
   * @returns {string} - The corresponding CSS class for the cell.
   */
  getCellClass(cellContent, playerColors) {
    if (cellContent === "empty") return "empty";
    if (cellContent === "blue") return "clear";
    if (cellContent === "red") return "dark";
    return "empty";
  }

  /**
   * Returns the CSS grid class for positioning the cell.
   * @param {number} i - The row index.
   * @param {number} j - The column index.
   * @returns {string} - The CSS class for grid positioning.
   */
  getGridAreaClass(i, j) {
    return `${String.fromCharCode(97 + i)}${j + 1}`;
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
    });
  }

  /**
   * Extracts cell coordinates from a clicked cell element.
   * @param {HTMLElement} cellElement - The clicked cell element.
   * @returns {[number, number]} - The row and column indices.
   */
  getCellCoordinates(cellElement) {
    const classList = Array.from(cellElement.classList);
    const gridAreaClass = classList.find((cls) => /^[a-z][0-9]+$/.test(cls));
    const i = gridAreaClass.charCodeAt(0) - 97;
    const j = parseInt(gridAreaClass.substring(1), 10) - 1;
    return [i, j];
  }

  /**
   * Clean up when leaving the board.
   */
  unload() {
    if (this.intervalId) clearInterval(this.intervalId);
    super.unload();
  }
}

const board = new Board();
export default board;
