import About from "./sections/about.mjs";
import Home from "./sections/home.mjs";
import Login from "./sections/login.mjs";
import Board from "./sections/board.mjs";
import Game from "./game.mjs";

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
});

// debugging the Game class
const mini = new Game("mini");
mini.print();

const small = new Game("small");
small.print();

const normal = new Game("normal");
normal.print();

const big = new Game("big");
big.print();
