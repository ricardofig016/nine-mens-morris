import About from "./sections/about.mjs";
import Home from "./sections/home.mjs";
import Login from "./sections/login.mjs";
import Board from "./sections/board.mjs";
import Toast from "./toast.mjs";
import { initializeInstructionsModal } from "./instructions.mjs";
import error from "./error.mjs";

const sections = {
  about: About,
  login: Login,
  home: Home,
  board: Board,
};

const config = {
  level: "normal",
  player1: "Alice",
  player2: "Bob",
  shufflePlayers: true,
};

// show this section on page load
const defaultSection = new Board(); // TODO: change this to Home when testing for Board is not needed

document.addEventListener("DOMContentLoaded", () => {
  // add listeners for the nav buttons
  Object.keys(sections).forEach((key) => {
    document.getElementById(`to-${key}-button`).addEventListener("click", () => {
      if (key === "board") new sections[key]().load(config);
      else new sections[key]().load();
    });
  });

  defaultSection.load(config); // TODO: remove config when Home is the default section instead of Board

  initializeInstructionsModal();

  /*// example of how to use the error function
  error("This is an error message");

  // example of how to manually create toasts
  const toast = new Toast("This is a toast message");
  toast.show();*/
});
