import About from "./sections/about.mjs";
import Home from "./sections/home.mjs";
import Login from "./sections/login.mjs";
import Board from "./sections/board.mjs";
import Game from "./game/game.mjs";

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
  const mini = new Game("mini", "Alice", "Bob", true);
  mini.print(true);

  const small = new Game("small", "Alice", "Bob", true);
  small.print(true);

  const normal = new Game("normal", "Alice", "Bob", true);
  normal.print(true);

  const big = new Game("big", "Alice", "Bob", true);
  big.print(true);
});
