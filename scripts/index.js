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
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (req.method === 'POST') {
        switch (pathname) {
            case '/register':
                register(req, res, parsedUrl.query);
                break;
            case '/ranking':
                ranking(req, res, parsedUrl.query);
                break;
            case '/join':
                join(req, res, parsedUrl.query);
                break;
            // Add additional cases for leave, notify, update
            default:
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Unknown endpoint' }));
        }
    } else {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid method' }));
    }
});

server.listen(8000, () => console.log('Server running on port 8000'));
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
