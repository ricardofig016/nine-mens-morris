const http = require('http');
const url = require('url');

const register = require('./register');
const ranking = require('./ranking');
const join = require('./join');
const leave = require('./leave');
const notify = require('./notify');
const update = require('./update');

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
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

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