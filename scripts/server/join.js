const fs = require("fs");
const crypto = require("crypto");

const join = (req, res, { group, nick, password, size }) => {
  if (!group || !nick || !password || !size) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: "Missing parameters" }));
  }

  const users = JSON.parse(fs.readFileSync("./data/users.json", "utf-8") || "{}");
  if (users[nick] !== hashPassword(password)) {
    res.statusCode = 401;
    return res.end(JSON.stringify({ error: "Invalid credentials" }));
  }

  let games = JSON.parse(fs.readFileSync("./data/games.json", "utf-8") || "{}");
  for (const gameId in games) {
    if (games[gameId].group === group && games[gameId].size === size && games[gameId].state.length === 0 && games[gameId].players.length === 1) {
      games[gameId].players.push(nick);
      fs.writeFileSync("./data/games.json", JSON.stringify(games));

      res.statusCode = 200;
      return res.end(JSON.stringify({ game: gameId }));
    }
  }

  const gameId = crypto.randomUUID(); // Create unique game ID
  games[gameId] = { players: [nick], group, size, state: [] };
  fs.writeFileSync("./data/games.json", JSON.stringify(games));

  res.statusCode = 200;
  res.end(JSON.stringify({ game: gameId }));
};

const hashPassword = (password) => crypto.createHash("sha256").update(password).digest("hex");

module.exports = join;
