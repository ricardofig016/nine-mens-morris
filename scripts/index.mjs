import About from "./sections/about.mjs";
import Home from "./sections/home.mjs";
import Login from "./sections/login.mjs";
import Board from "./sections/board.mjs";
import Game from "./game/game.mjs";
import Toast from "./toast.mjs";
import { initializeInstructionsModal } from "./instructions.mjs";

const sections = {
  about: About,
  login: Login,
  home: Home,
  board: Board,
};

// show this section on page load
const defaultSection = new Home();

document.addEventListener("DOMContentLoaded", () => {
  // add listeners for the nav buttons
  Object.keys(sections).forEach((key) => {
    document.getElementById(`to-${key}-button`).addEventListener("click", () => {
      new sections[key]().load();
    });
  });

  defaultSection.load();

  initializeInstructionsModal();

  // debugging the Game class
  const game = new Game("big", "Alice", "Bob", true);
  game.place(0, 0);
  game.place(1, 1);
  game.pickUp(0, 0);
  game.place(5, 5);
  game.pickUp(0, 0);
  game.print(true);
});
