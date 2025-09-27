const fs = require('fs').promises

// question 1 - part 1
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

module.exports = loggerMiddleware;