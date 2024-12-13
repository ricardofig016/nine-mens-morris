const fs = require('fs');

const leave = (req, res, { nick, game }) => {
    const games = JSON.parse(fs.readFileSync('./data/games.json', 'utf-8') || '{}');
    if (!games[game]) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Game not found' }));
    }

    games[game].players = games[game].players.filter(player => player !== nick);
    if (games[game].players.length === 0) delete games[game];

    fs.writeFileSync('./data/games.json', JSON.stringify(games));
    res.statusCode = 200;
    res.end(JSON.stringify({ success: true }));
};

module.exports = leave;
