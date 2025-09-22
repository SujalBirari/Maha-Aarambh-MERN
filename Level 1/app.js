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

        await fs.writeFile('requests.log', content, 'utf-8');
        next();
    }
    catch (err) {
        next(err);
    }
}

app.use(loggerMiddleware);

app.get('/', (req, res) => {
    res.send('Home page');
});
app.get('/read', (req, res) => {
    res.send('Read info');
})

app.listen(3000);