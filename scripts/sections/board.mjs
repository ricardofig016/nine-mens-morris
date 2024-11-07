import Section from "./section.mjs";
import Game from "../game/game.mjs";
import AutoPlayer from "../game/autoplayer.mjs";
import error from "../error.mjs";

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
    this.autoPlayer = new AutoPlayer(game); // Initialize AutoPlayer
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
          const gridAreaClass = `${String.fromCharCode(97 + i)}${j + 1}`;
          const colorClass = cell.piece ? (cell.piece.symbol === "X" ? "clear" : "dark") : "empty";
          const isPickedUpClass = game.pickedUpPiece && game.pickedUpPiece.coords[0] === i && game.pickedUpPiece.coords[1] === j ? "picked-up" : "";
          cellElement.className = `cell ${colorClass} ${gridAreaClass} ${isPickedUpClass}`;
          boardElement.appendChild(cellElement); 
        } else{
          const cellElement=document.createElement("span");
          if(j===0 || j===6) cellElement.className = "vline";
          else if((i===0 || i==6) && (j>0 && j<6)) cellElement.className = "hline";
          else if((i===1 || i==5) && (j>1 && j<5)) cellElement.className = "hline";
          else if((i===2 || i==4) && (j===1 || j===5)) cellElement.className = "vline";
          // debug else cellElement.innerHTML=`i: ${i} / j: ${j}`
          boardElement.appendChild(cellElement);
        }
      });
    });
    if (game.result) this.gameEnd(game.result);
    game.print(true);
  }

  gameEnd(result) {
    if(result=="X"){
      error("Player 1 Won!");
      document.getElementById("scoring").innerHTML+="<tr><td>9 Men's Morris</td><td>Player 1</td><td>00:00:00</td></tr>"
    }else{
      error("Player 2 Won!");
      document.getElementById("scoring").innerHTML+="<tr><td>9 Men's Morris</td><td>Player 2</td><td>00:00:00</td></tr>"
    }
    
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
  
      // Check if it's Bob's turn
      if (game.players[game.turn].username === "Bob") {
        boardElement.disabled = true;
  
        // Let AutoPlayer handle retries internally
        setTimeout(() => {
          this.autoPlayer.playRandomMove(); // Bob plays, with retries handled in AutoPlayer
          this.render(game); // Re-render after Bob’s move
          boardElement.disabled = false;
        }, 500); // Initial delay for Bob's turn
      }
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
