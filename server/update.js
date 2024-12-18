const fs = require('fs');

const update = (req, res, { game }) => {
    const games = JSON.parse(fs.readFileSync('./data/games.json', 'utf-8') || '{}');
    if (!games[game]) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Game not found' }));
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ state: games[game].state }));
};

module.exports = update;
