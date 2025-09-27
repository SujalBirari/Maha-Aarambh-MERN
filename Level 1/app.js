const express = require('express')
const loggerMiddleware = require("./middlewares/logger.js")
const rateLimiter = require('./middlewares/rateLimiter.js')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const userModel = require('./models/userModel.js');
const authRouter = require('./routes/authRouter.js');

const app = express();

app.set("view engine", "ejs");
// app.use(rateLimiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
app.use(loggerMiddleware);

// CONNECT TO DATABASE

app.get('/', (req, res) => {
    res.send('Home page');
});
app.get('/read', (req, res) => {
    res.send('Read info');
});

app.get('/api/auth/register', (req, res) => {
    res.render('register.ejs');
});
app.get('/api/auth/login', (req, res) => {
    res.render('login.ejs');
});

app.use("/api/auth", authRouter);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));