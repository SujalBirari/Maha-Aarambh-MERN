const express = require('express')
const loggerMiddleware = require("./middlewares/logger.js")
const rateLimiter = require('./middlewares/rateLimiter.js')

const app = express();

app.use(rateLimiter);
app.use(loggerMiddleware);

app.get('/', (req, res) => {
    res.send('Home page');
});
app.get('/read', (req, res) => {
    res.send('Read info');
})

app.listen(3000);