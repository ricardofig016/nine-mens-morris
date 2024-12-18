import About from "./sections/about.js";
import Settings from "./sections/settings.js";
import Home from "./sections/home.js";
import Login from "./sections/login.js";
import board from "./sections/board.js";
import { registerUser, joinGame, leaveGame, getRanking } from "./twserver-alunos/communication.js";
import { initializeInstructionsModal } from "./instructions.js";

const sections = {
  about: About,
  settings: Settings,
  login: Login,
  home: Home,
  board, 
};

// show this section on page load
const defaultSection = new Home();
export var BASE_URL = "http://twserver.alunos.dcc.fc.up.pt:8008";
var username="";
var password="";
var gameUniqueId="";
var size=3;

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
  if(BASE_URL === "http://twserver.alunos.dcc.fc.up.pt:8114"){
    BASE_URL="http://twserver.alunos.dcc.fc.up.pt:8008";
  }else{
    BASE_URL = "http://twserver.alunos.dcc.fc.up.pt:8114";
  }
  console.log("changed url")
}
document.getElementById("comment").addEventListener("change", changeurl);

document.getElementById("login-button").addEventListener("click", async () => {
  username = document.getElementById("username-input-login").value;
  password = document.getElementById("password-input-login").value;
  await registerUser(username, password);
});

document.getElementById("settings-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const groupid = document.getElementById("groupid").value;
  const formData = new FormData(event.target);
  let config={
    username: username,
    password: password,
    gameId: gameUniqueId,
    size: size
  };
  config.level = formData.get("level");
  if (config.level === "mini") size = 3;
  else if (config.level === "small") size = 6;
  else if (config.level === "normal") size = 9;
  else size = 12;
  gameUniqueId=await joinGame(groupid, username, password, size);
  config.gameId=gameUniqueId;
  config.size=size;
  console.log(gameUniqueId);
  board.load(config);
});

document.getElementById("abandon-game").addEventListener("click", async () => {
  await leaveGame(username, password,gameUniqueId);
  document.getElementById("to-home-button").click();
});

async function displayRanking() {
  const group = 14;
  const size = 9;

  try {
    const data = await getRanking(group, size);

    if (data && data.ranking && data.ranking.length > 0) {
      const rankingTable = document.getElementById("scoring");
      rankingTable.innerHTML = `
        <tr>
          <th>Nick</th>
          <th>Victories</th>
          <th>Games</th>
        </tr>
      `;

      data.ranking.forEach((player) => {
        const row = `
          <tr>
            <td>${player.nick}</td>
            <td>${player.victories}</td>
            <td>${player.games}</td>
          </tr>
        `;
        rankingTable.innerHTML += row;
      });
    } else {
      const rankingTable = document.getElementById("scoring");
      rankingTable.innerHTML = `
        <tr>
          <th>Nick</th>
          <th>Victories</th>
          <th>Games</th>
        </tr>
        <tr>
            <td>No</td>
            <td>data</td>
            <td>available.</td>
          </tr>
      `;
    }
  } catch (err) {
    console.error("Failed to fetch ranking:", err);
  }
}

document.getElementById("show-ratings-btn").addEventListener("click", displayRanking);