import About from "./sections/about.js";
import Settings from "./sections/settings.js";
import Home from "./sections/home.js";
import Login from "./sections/login.js";
import board from "./sections/board.js";
import { registerUser, joinGame } from "./twserver-alunos/communication.js";
import { initializeInstructionsModal } from "./instructions.js";

const sections = {
  about: About,
  settings: Settings,
  login: Login,
  home: Home,
  board, 
};

const config = {
  level: "normal",
  player1: "Alice",
  player2: "Bob",
  shufflePlayers: true,
  autoPlayer: false,
};

// show this section on page load
const defaultSection = new Home();
export var BASE_URL = "http://twserver.alunos.dcc.fc.up.pt:8008";

document.addEventListener("DOMContentLoaded", () => {
  // add listeners for the nav buttons
  Object.keys(sections).forEach((key) => {
    const button = document.getElementById(`to-${key}-button`);
    if (!button) return;
    button.addEventListener("click", () => {
      if (key === "board") new sections[key]().load(config);
      else new sections[key]().load();
    });
  });

  document.getElementById("settings-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    config.autoPlayer = formData.get("player-mode") === "nohuman";
    config.level = formData.get("level");
    // config.shufflePlayers = formData.get("shufflePlayers") === "true";
    board.load(config);
  });

  defaultSection.load();

  initializeInstructionsModal();
  initializeScoreboardModal();
});

export function showScoreboard() {
  const ratings_modal = document.getElementById("ratings-modal");
  ratings_modal.style.display = "block"; // show
}

export function closeScoreboard() {
  const ratings_modal = document.getElementById("ratings-modal");
  ratings_modal.style.display = "none"; // hide
}

export function closeOnOutsideClick(event) {
  const ratings_modal = document.getElementById("ratings-modal");
  if (event.target == ratings_modal) {
    ratings_modal.style.display = "none";
  }
}
export function initializeScoreboardModal() {
  const showScoreboardBtn = document.getElementById("show-ratings-btn");
  if (showScoreboardBtn) {
    showScoreboardBtn.addEventListener("click", showScoreboard);
  }
  const closeModalBtn = document.getElementById("ratings-close-modal-btn");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeScoreboard);
  }
  window.addEventListener("click", closeOnOutsideClick);
}

export function changeurl(){
  if(BASE_URL === "http://localhost:8008"){
    BASE_URL="http://twserver.alunos.dcc.fc.up.pt:8008";
  }else{
    BASE_URL = "http://localhost:8008";
  }
  console.log("changed url")
}
document.getElementById("comment").addEventListener("change", changeurl);

document.getElementById("login-button").addEventListener("click", async () => {
  const username = document.getElementById("username-input-login").value;
  const password = document.getElementById("password-input-login").value;
  await registerUser(username, password);
  //await joinGame("group1", username, password, 3);
});