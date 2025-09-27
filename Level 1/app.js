const express = require('express')
const fs = require('fs').promises

const app = express();

async function loggerMiddleware(req, res, next) {
    try {
        console.log(req.method);
        console.log(req.url);
        console.log(new Date().toISOString());
        console.log(req.ip);

        let timestamp = new Date().toISOString();
        const data = ['req method: ' + req.method, 'req url: ' + req.url, 'req timestamp: ' + timestamp, 'req ip address: ' + req.ip];
        const content = data.join('\n');

        await fs.appendFile('requests.log', content, 'utf-8');
        next();
    }
    catch (err) {
        next(err);
    }
}

let clientTrack = {};
// 100 requests per 1 minute per ip address
function rateLimiter(req, res, next) {
    const ONE_MINUTE = 60 * 1000;

    const clientIP = req.ip;
    const now = Date.now();
    if (!clientTrack[clientIP]) {
        clientTrack[clientIP] = [];
    }
    clientTrack[clientIP] = clientTrack[clientIP].filter(ts => now - ts < ONE_MINUTE);
    clientTrack[clientIP].push(now);
    if (clientTrack[clientIP].length > 100) {
        res.set('Retry-After', '60');
        res.status(429).send('Too many requests');
        return;
    }

    next();
}

app.use(rateLimiter);
app.use(loggerMiddleware);

app.get('/', (req, res) => {
    res.send('Home page');
});
app.get('/read', (req, res) => {
    res.send('Read info');
})

app.listen(3000);