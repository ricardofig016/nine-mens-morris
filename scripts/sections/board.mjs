import Section from "./section.mjs";
import Game from "../game/game.mjs";

class Board extends Section {
  constructor() {
    if (Board.instance) {
      return Board.instance;
    }
    super("board");
    Board.instance = this;
  }

  load({ level, player1, player2, shufflePlayers }) {
    super.load();
    const game = new Game(level, player1, player2, shufflePlayers);
    this.render(game);
    this.addListeners(game);
  }

  render(game) {
    const boardElement = document.getElementById("board");
    boardElement.className = game.level;
    boardElement.innerHTML = "";

    game.grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.isRelevant) {
          const cellElement = document.createElement("div");
          const colorClass = cell.piece ? (cell.piece.symbol === "X" ? "clear" : "dark") : "empty";
          cellElement.className = `cell ${colorClass} ${String.fromCharCode(97 + i)}${j + 1}`;
          boardElement.appendChild(cellElement);
        }
      });
    });
    game.print(true);
  }

  addListeners(game) {
    if (!game) return;
    const boardElement = document.getElementById("board");
    boardElement.addEventListener("click", (event) => {
      const target = event.target;
      if (!target.classList.contains("cell")) return;
      const [i, j] = this.getCellCoordinates(target);
      if (game.phase === "placing") {
        game.place(i, j);
      } else if (game.phase === "moving") {
        game.move(i, j);
      }
      this.render(game); // Re-render the board after the game state changes
    });
  }

  getCellCoordinates(cellElement) {
    const classList = Array.from(cellElement.classList);
    const gridAreaClass = classList.find((cls) => /^[a-g][1-7]$/.test(cls));
    const i = gridAreaClass.charCodeAt(0) - 97; // 'a' is 97 in ASCII
    const j = parseInt(gridAreaClass[1], 10) - 1;
    return [i, j];
  }
}

export default Board;
