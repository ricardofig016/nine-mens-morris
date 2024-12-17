import { notifyMove, updateGameState } from "../twserver-alunos/communication.js";
import error from "../error.js";

class Game {
  constructor(level, username, password, gameId, size = 3) {
    this.level = level;
    this.username = username;
    this.password = password;
    this.gameId = gameId;
    this.size = size;

    this.grid = Array.from({ length: size }, () => Array(size).fill(null));
    this.phase = "placing";
    this.turn = username; // Set as the player's username
    this.#render();
  }

  async place(square, position) {
    try {
      await notifyMove(this.username, this.password, this.gameId, { square, position });
      console.log("Move sent to server.");
      await this.#updateBoard();
    } catch (err) {
      console.error(`Error placing piece: ${err.message}`);
    }
  }

  async #updateBoard() {
    try {
      const state = await updateGameState(this.username, this.gameId);
      this.phase = state.phase;
      this.grid = state.board;
      this.turn = state.turn;
      this.#render();
    } catch (err) {
      console.error(`Error updating game state: ${err.message}`);
    }
  }

  #render() {
    console.clear();
    console.log(`Phase: ${this.phase}`);
    console.log(`Turn: ${this.turn}`);
    console.table(this.grid);
  }
}

export default Game;
