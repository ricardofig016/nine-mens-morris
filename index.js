// Main server script
// This script was installed to the 'twserver' with adjusted paths to the required modules

const http = require("http");
const url = require("url");

const register = require("./server/register");
const ranking = require("./server/ranking");
const join = require("./server/join");
const leave = require("./server/leave");
const notify = require("./server/notify");
const update = require("./server/update");

const PORT = 8114;

const routes = {
  "/register": register,
  "/ranking": ranking,
  "/join": join,
  "/leave": leave,
  "/notify": notify,
  "/update": update,
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); 
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); 

  if (req.method === "OPTIONS") {
    res.writeHead(204); // No Content
    res.end();
    return;
  }

  if (routes[pathname]) {
    if (req.method === "POST" || req.method === "GET") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        const data = body ? JSON.parse(body) : parsedUrl.query;
        routes[pathname](req, res, data);
      });
    } else {
      res.statusCode = 405;
      res.end(JSON.stringify({ error: "Method not allowed" }));
    }
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Unknown endpoint" }));
  }
});

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
