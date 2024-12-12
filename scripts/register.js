const fs = require('fs');
const crypto = require('crypto');

const register = (req, res, { nick, password }) => {
    if (!nick || !password) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Missing nick or password' }));
    }

    const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8') || '{}');
    if (users[nick]) {
        if (users[nick] !== hashPassword(password)) {
            res.statusCode = 401;
            return res.end(JSON.stringify({ error: 'Incorrect password' }));
        }
    } else {
        users[nick] = hashPassword(password);
        fs.writeFileSync('./data/users.json', JSON.stringify(users));
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ success: true }));
};