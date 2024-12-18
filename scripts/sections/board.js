import Section from "./section.js";
import { notifyMove, updateGameState } from "../twserver-alunos/communication.js";
import error from "../error.js";

class Board extends Section {
  constructor() {
    if (Board.instance) return Board.instance;
    super("board");
    Board.instance = this;

    this.username = null;
    this.password = null;
    this.gameId = null;
    this.grid = [];
    this.phase = "drop";
    this.turn = "";
    this.players = {};

    this.intervalId = null;
  }

  /**
   * Load and initialize a game board.
   */
  async load({ username, password, gameId, size }) {
    super.load();
    this.username = username;
    this.password = password;
    this.gameId = gameId;
    this.size = size;

    await this.updateAndRender();
    this.intervalId = setInterval(() => this.updateAndRender(), 2000);
  }

  /**
   * Fetch the latest game state and render the board.
   */
  async updateAndRender() {
    console.log("updateAndRender")
    const state = updateGameState(this.username, this.gameId);
    if (Object.keys(state).length === 0) {
      console.log(Object.keys(state))
      this.renderWaitingMessage();
      return;
    }
    // checks if there is a winner
    if (state.winner) {
      this.showWinner(state.winner);
      return;
    }
    console.log("board")
    this.grid = state.board || [];
    this.phase = state.phase || "drop";
    this.turn = state.turn || "";
    this.players = state.players || {};
    this.renderBoard();
  }

  showWinner(winner) {
    const boardElement2 = document.getElementById("whoisplaying2");
    const boardElement = document.getElementById("whatisplaying");
    boardElement2.innerHTML = "Looks like we have a winner!";
    boardElement.innerHTML = `<strong>${winner}</strong> won!`;
    
    if (this.intervalId) clearInterval(this.intervalId);
    console.log(`winner: ${winner}`);
  }

  /**
   * Render the board and game state.
   */
  renderBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";

    this.grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        const cellElement = document.createElement("div");
        cellElement.className = `cell ${this.getCellClass(cell)}`;
        cellElement.addEventListener("click", () => this.makeMove(i, j));
        boardElement.appendChild(cellElement);
      });
    });

    document.getElementById("game-phase").textContent = `Phase: ${this.phase}`;
    document.getElementById("game-turn").textContent = `Turn: ${this.turn}`;
  }

  /**
   * Handle player's move.
   */
  async makeMove(row, col) {
    try {
      console.log(`Move: Row ${row}, Col ${col}`);
      await notifyMove(this.username, this.password, this.gameId, { square: row, position: col });
      await this.updateAndRender();
    } catch (err) {
      error(`Error making move: ${err.message}`);
    }
  }

  /**
   * Render a waiting message for unpaired games.
   */
  renderWaitingMessage() {
    const boardElement2 = document.getElementById("whoisplaying2");
    const boardElement = document.getElementById("whatisplaying");
    boardElement2.innerHTML = "Waiting for another player...";
    boardElement.innerHTML = "Waiting";
  }

  /**
   * Return the CSS class for a cell.
   */
  getCellClass(cellContent) {
    if (cellContent === "empty") return "empty";
    if (cellContent === "blue") return "clear";
    if (cellContent === "red") return "dark";
    return "empty";
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
