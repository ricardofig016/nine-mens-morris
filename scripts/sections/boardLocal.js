import Section from "./section.js";
import Game from "../game/game.js";
import AutoPlayer from "../game/autoplayer.js";
import error from "../error.js";

class Board extends Section {
  constructor() {
    if (Board.instance) {
      return Board.instance;
    }
    super("board");
    Board.instance = this;
    this.isAutoPlaying = false;
  }

  load({ level, player1, player2, shufflePlayers, autoPlayer }) {
    super.load();
    const game = new Game(level, player1, player2, shufflePlayers);
    if (autoPlayer) this.autoPlayer = new AutoPlayer(game);
    else this.autoPlayer = null;
    const boardElement = document.getElementById("board");
    const newBoardElement = document.createElement("div");
    newBoardElement.id = "board";
    newBoardElement.className = game.level;
    boardElement.parentNode.insertBefore(newBoardElement, boardElement.nextSibling);
    boardElement.remove();
    this.render(game);
    this.addListeners(game);
  }

  render(game) {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";

    game.grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.isRelevant) {
          const cellElement = document.createElement("div");
          const gridAreaClass = `${String.fromCharCode(97 + i)}${j + 1}`;
          const colorClass = cell.piece ? (cell.piece.symbol === "X" ? "clear" : "dark") : "empty";
          const isPickedUpClass = game.pickedUpPiece && game.pickedUpPiece.coords[0] === i && game.pickedUpPiece.coords[1] === j ? "picked-up" : "";
          cellElement.className = `cell ${colorClass} ${gridAreaClass} ${isPickedUpClass}`;
          boardElement.appendChild(cellElement);
        } else {
          const cellElement = document.createElement("span");
          if (game.size >= 7) {
            if (j === 0 || j === 6) cellElement.className = "vline";
            else if ((i === 0 || i == 6) && j > 0 && j < 6) cellElement.className = "hline";
            else if ((i === 1 || i == 5) && j > 1 && j < 5) cellElement.className = "hline";
            else if ((i === 2 || i == 4) && (j === 1 || j === 5)) cellElement.className = "vline";
          } else {
            if (j === 1 || j === 3) cellElement.className = "hline";
            if (j === 0 || j === 4) cellElement.className = "vline";
          }

          boardElement.appendChild(cellElement);
        }
      });
    });
    if (game.result) this.gameEnd(game.result);
    game.print(true);

    if (game.players[game.turn].username === "Bob" && this.autoPlayer) {
      boardElement.disabled = true;
      setTimeout(() => {
        this.autoPlayer.playRandomMove();
        this.render(game);
        boardElement.disabled = false;
      }, 500);
    }
  }

  gameEnd(result) { // added localstorage

    const now = new Date();
    const formattedTime = now.toISOString().substr(11, 8);

    let winner;
    if (result == "X") {
      error("Player 1 Won!");
      winner = "Player 1";
    } else {
      error("Player 2 Won!");
      winner = "Player 2";
    }
  
    document.getElementById("scoring").innerHTML += `
      <tr><td>9 Men's Morris</td><td>${winner}</td><td>${formattedTime}</td></tr>
    `;
  
    let scores = JSON.parse(localStorage.getItem("gameScores")) || [];
    scores.push({
      game: "9 Men's Morris",
      winner: winner,
      time: formattedTime
    });
    localStorage.setItem("gameScores", JSON.stringify(scores));
  }

  addListeners(game) {
    if (!game) return;
    const boardElement = document.getElementById("board");
    boardElement.addEventListener("click", (event) => {
      const target = event.target;
      if (!target.classList.contains("cell")) return;
      const [i, j] = this.getCellCoordinates(target);

      if (game.grid[i][j].piece && game.phase !== "placing") {
        if (game.phase === "moving") game.pickUp(i, j);
        else if (game.phase === "taking") game.take(i, j);
      } else {
        game.place(i, j);
      }

      this.render(game);
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

const boardLocal = new Board();
export default boardLocal;
