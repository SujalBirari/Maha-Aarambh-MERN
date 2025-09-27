// question 1 - part 2
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