const fs = require('fs');
const crypto = require('crypto');

const join = (req, res, { group, nick, password, size }) => {
    if (!group || !nick || !password || !size) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Missing parameters' }));
    }

    const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8') || '{}');
    if (users[nick] !== hashPassword(password)) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ error: 'Invalid credentials' }));
    }

    const games = JSON.parse(fs.readFileSync('./data/games.json', 'utf-8') || '{}');
    const gameID = crypto.randomUUID(); // Create unique game ID

    games[gameID] = { players: [nick], group, size, state: [] };
    fs.writeFileSync('./data/games.json', JSON.stringify(games));

    res.statusCode = 200;
    res.end(JSON.stringify({ game: gameID }));
};

const hashPassword = (password) => crypto.createHash('sha256').update(password).digest('hex');

module.exports = join;
