import About from "./sections/about.mjs";
import Home from "./sections/home.mjs";
import Login from "./sections/login.mjs";
import Board from "./sections/board.mjs";
import Game from "./game/game.mjs";
import Toast from "./toast.mjs";
import { initializeInstructionsModal } from "./instructions.mjs";
import error from "./error.mjs";

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

  // example of how to use the error function
  error("This is an error message");

  // example of how to manually create toasts
  const toast = new Toast("This is a toast message");
  toast.show();

  // example of how to use the Game class
  const game = new Game("normal", "Alice", "Bob", true);
  // placing phase
  game.place(3, 0);
  game.place(5, 1);
  game.place(6, 6);
  game.place(0, 0);
  game.place(1, 1);
  game.place(1, 3);
  game.place(1, 5);
  game.place(2, 2);
  game.place(2, 3);
  game.place(3, 6);
  game.place(0, 3);
  game.place(4, 4);
  game.place(2, 4);
  game.place(6, 0);
  game.place(3, 2);
  game.place(6, 3);
  game.place(4, 2);
  game.place(5, 5);
  // moving phase
  game.pickUp(4, 2);
  game.place(4, 3);
  game.pickUp(5, 5);
  game.place(5, 3);
  game.pickUp(3, 2);
  game.place(4, 2);
  game.print(true);
});
