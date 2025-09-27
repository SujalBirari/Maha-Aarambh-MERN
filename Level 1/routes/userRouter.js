const express = require('express');
const protectAuthMiddleware = require('../middlewares/protect');
const authorizeMiddleware = require('../middlewares/authorize');

const router = express.Router();

router.get('/profile', protectAuthMiddleware, authorizeMiddleware('user', 'admin'), (req, res) => {
    res.json({
        message: `Hello ${req.user.id}, your role is ${req.user.role}`
    });
});

module.exports = router;