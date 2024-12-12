import About from "./sections/about.js";
import Settings from "./sections/settings.js";
import Home from "./sections/home.js";
import Login from "./sections/login.js";
import board from "./sections/board.js";
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

/*
const http = require('http');
const url = require('url');

const register = require('./routes/register');
const ranking = require('./routes/ranking');
const join = require('./routes/join');
const leave = require('./routes/leave');
const notify = require('./routes/notify');
const update = require('./routes/update');

const PORT = 8008;

const routes = {
    '/register': register,
    '/ranking': ranking,
    '/join': join,
    '/leave': leave,
    '/notify': notify,
    '/update': update,
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (routes[pathname]) {
        if (req.method === 'POST' || req.method === 'GET') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                const data = body ? JSON.parse(body) : parsedUrl.query;
                routes[pathname](req, res, data);
            });
        } else {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: 'Method not allowed' }));
        }
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Unknown endpoint' }));
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
*/

//O Prof disse para eu usar as cenas dos slides (o que está abaixo):
/*
http.createServer(function (request, response) {
    const preq = url.parse(request.url,true);
    const pathname = preq.pathname;
    let answer = {};

    switch(request.method) {
    case 'GET':
        answer = doGet(pathname,request,response);
        break;
    case 'POST':
        answer = doPost(pathname);
        break;
    default:
        answer.status = 400;
    }
…
}).listen(PORT);

function doPost(pathname) {
 let answer = {};

 switch(pathname) {
  case '/incr':
   counter.incr();
   updater.update(counter.get());
   break;
  case '/reset':
   counter.reset();
   updater.update(counter.get());
    break;
  default:
    answer.status = 400;
    break;
  }

 return answer;
}
*/
