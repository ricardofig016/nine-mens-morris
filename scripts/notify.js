const fs = require('fs');

const notify = (req, res, { nick, game, cell }) => {
    const games = JSON.parse(fs.readFileSync('./data/games.json', 'utf-8') || '{}');
    if (!games[game]) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Game not found' }));
    }

    games[game].state.push(cell);
    fs.writeFileSync('./data/games.json', JSON.stringify(games));

    res.statusCode = 200;
    res.end(JSON.stringify({ success: true }));
};

module.exports = notify;
